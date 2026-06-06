// WebGL2 backend. Implements all three render strategies:
//   escape-time  -> two-pass cached RGBA16F field (or single-pass fallback)
//   L-system     -> screen-constant-width line triangles
//   IFS          -> additive point splat into an HDR buffer + log-density resolve
import type { BackendKind, RenderInputs, Renderer } from '../renderer';
import type { LineMesh } from '../../fractals/lsystem';
import type { PointCloud } from '../../fractals/ifs';
import { modeOf } from '../../fractals/registry';
import { worldHeight } from '../../app/camera';
import type { DensityRemap, TrapKind } from '../../app/scene';
import {
  Program,
  createTarget,
  deleteTarget,
  detectFloatRenderable,
  type RenderTarget,
} from './gl-helpers';
import { FULLSCREEN_VERT } from '../../shaders/common';
import {
  fieldFragmentSource,
  colorFragmentSource,
  singlePassFragmentSource,
} from '../../shaders/escape';
import { LINE_VERT, LINE_FRAG } from '../../shaders/line';
import { POINT_VERT, POINT_FRAG, POINT_RESOLVE_FRAG } from '../../shaders/points';

const trapInt = (t: TrapKind): number =>
  t === 'stalk' ? 1 : t === 'point' ? 2 : t === 'circle' ? 3 : 0;
const remapInt = (r: DensityRemap): number => (r === 'log' ? 1 : r === 'linear' ? 2 : 0);

export class Webgl2Renderer implements Renderer {
  readonly kind: BackendKind = 'webgl2';
  readonly floatTargets: boolean;

  private gl: WebGL2RenderingContext;

  private fieldProg: Program | null = null;
  private colorProg: Program | null = null;
  private singleProg: Program;
  private lineProg: Program;
  private pointProg: Program;
  private resolveProg: Program;

  private emptyVao: WebGLVertexArrayObject;
  private lineVao: WebGLVertexArrayObject;
  private lineBuf: WebGLBuffer;
  private lineVertexCount = 0;
  private pointVao: WebGLVertexArrayObject;
  private pointBuf: WebGLBuffer;
  private pointCount = 0;

  private fieldTarget: RenderTarget | null = null;
  private accTarget: RenderTarget | null = null;

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;
    this.floatTargets = detectFloatRenderable(gl);

    this.singleProg = new Program(gl, FULLSCREEN_VERT, singlePassFragmentSource());
    this.lineProg = new Program(gl, LINE_VERT, LINE_FRAG);
    this.pointProg = new Program(gl, POINT_VERT, POINT_FRAG);
    this.resolveProg = new Program(gl, FULLSCREEN_VERT, POINT_RESOLVE_FRAG);
    if (this.floatTargets) {
      this.fieldProg = new Program(gl, FULLSCREEN_VERT, fieldFragmentSource());
      this.colorProg = new Program(gl, FULLSCREEN_VERT, colorFragmentSource());
    }

    this.emptyVao = this.mustVao();
    this.lineVao = this.mustVao();
    this.lineBuf = this.mustBuf();
    this.pointVao = this.mustVao();
    this.pointBuf = this.mustBuf();
    this.setupLineVao();
    this.setupPointVao();
  }

  private mustVao(): WebGLVertexArrayObject {
    const v = this.gl.createVertexArray();
    if (!v) throw new Error('createVertexArray failed');
    return v;
  }
  private mustBuf(): WebGLBuffer {
    const b = this.gl.createBuffer();
    if (!b) throw new Error('createBuffer failed');
    return b;
  }

  private setupLineVao(): void {
    const gl = this.gl;
    const stride = 5 * 4;
    gl.bindVertexArray(this.lineVao);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.lineBuf);
    const aPos = this.lineProg.attrib('aPos');
    const aNorm = this.lineProg.attrib('aNorm');
    const aT = this.lineProg.attrib('aT');
    if (aPos >= 0) {
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, stride, 0);
    }
    if (aNorm >= 0) {
      gl.enableVertexAttribArray(aNorm);
      gl.vertexAttribPointer(aNorm, 2, gl.FLOAT, false, stride, 8);
    }
    if (aT >= 0) {
      gl.enableVertexAttribArray(aT);
      gl.vertexAttribPointer(aT, 1, gl.FLOAT, false, stride, 16);
    }
    gl.bindVertexArray(null);
  }

  private setupPointVao(): void {
    const gl = this.gl;
    const stride = 3 * 4;
    gl.bindVertexArray(this.pointVao);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.pointBuf);
    const aPos = this.pointProg.attrib('aPos');
    const aMap = this.pointProg.attrib('aMap');
    if (aPos >= 0) {
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, stride, 0);
    }
    if (aMap >= 0) {
      gl.enableVertexAttribArray(aMap);
      gl.vertexAttribPointer(aMap, 1, gl.FLOAT, false, stride, 8);
    }
    gl.bindVertexArray(null);
  }

  resize(_width: number, _height: number): void {
    // No-op: field and accumulation targets are (re)created lazily in render()
    // when the size implied by RenderInputs changes.
  }

  setLineGeometry(mesh: LineMesh): void {
    const gl = this.gl;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.lineBuf);
    gl.bufferData(gl.ARRAY_BUFFER, mesh.data, gl.DYNAMIC_DRAW);
    this.lineVertexCount = mesh.vertexCount;
  }

  setPointGeometry(cloud: PointCloud): void {
    const gl = this.gl;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.pointBuf);
    gl.bufferData(gl.ARRAY_BUFFER, cloud.data, gl.STATIC_DRAW);
    this.pointCount = cloud.count;
  }

  render(inputs: RenderInputs): void {
    const mode = modeOf(inputs.scene.kind);
    if (mode === 'escape') this.renderEscape(inputs);
    else if (mode === 'lines') this.renderLines(inputs);
    else this.renderPoints(inputs);
  }

  private drawFullscreen(): void {
    const gl = this.gl;
    gl.bindVertexArray(this.emptyVao);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.bindVertexArray(null);
  }

  private setFieldUniforms(p: Program, inputs: RenderInputs, resW: number, resH: number, pixelSize: number): void {
    const s = inputs.scene;
    const e = s.escape;
    p.vec2('uResolution', resW, resH);
    p.vec2('uCenter', s.camera.centerX, s.camera.centerY);
    p.float('uPixelSize', pixelSize);
    p.float('uRotation', s.camera.rotation);
    p.int('uKind', s.kind === 'julia' ? 1 : 0);
    p.float('uPower', e.power);
    p.vec2('uJuliaC', inputs.juliaC[0], inputs.juliaC[1]);
    p.int('uMaxIter', e.maxIter);
    p.float('uBailout2', e.bailout * e.bailout);
    p.int('uTrap', trapInt(s.coloring.trap));
  }

  private setShadeUniforms(p: Program, inputs: RenderInputs, fieldPixelSize: number): void {
    const c = inputs.scene.coloring;
    const pal = inputs.palette;
    p.vec3('uA', pal.a[0], pal.a[1], pal.a[2]);
    p.vec3('uB', pal.b[0], pal.b[1], pal.b[2]);
    p.vec3('uC', pal.c[0], pal.c[1], pal.c[2]);
    p.vec3('uD', pal.d[0], pal.d[1], pal.d[2]);
    p.float('uCycles', c.cycles);
    p.float('uPhase', inputs.phase);
    p.int('uRemap', remapInt(c.remap));
    p.float('uShade', c.shade);
    p.float('uGlow', c.glow);
    p.vec2('uLight', inputs.lightDir[0], inputs.lightDir[1]);
    p.vec3('uInterior', c.interior[0], c.interior[1], c.interior[2]);
    p.float('uFilmic', c.bloom);
    // shared uniforms (also live in the field section for single-pass)
    p.int('uMaxIter', inputs.scene.escape.maxIter);
    p.float('uPixelSize', fieldPixelSize);
    p.int('uTrap', trapInt(c.trap));
  }

  private renderEscape(inputs: RenderInputs): void {
    const gl = this.gl;
    const { width, height, fieldScale } = inputs;
    const wh = worldHeight(inputs.scene.camera);

    if (this.floatTargets && this.fieldProg && this.colorProg) {
      const fw = Math.max(1, Math.round(width * fieldScale));
      const fh = Math.max(1, Math.round(height * fieldScale));
      let recreated = false;
      if (!this.fieldTarget || this.fieldTarget.width !== fw || this.fieldTarget.height !== fh) {
        deleteTarget(gl, this.fieldTarget);
        this.fieldTarget = createTarget(gl, fw, fh);
        recreated = true;
      }
      const fieldPixelSize = wh / fh;
      if (inputs.geometryDirty || recreated) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.fieldTarget.fbo);
        gl.viewport(0, 0, fw, fh);
        this.fieldProg.use();
        this.setFieldUniforms(this.fieldProg, inputs, fw, fh, fieldPixelSize);
        this.drawFullscreen();
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      }
      gl.viewport(0, 0, width, height);
      this.colorProg.use();
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.fieldTarget.tex);
      this.colorProg.int('uField', 0);
      this.setShadeUniforms(this.colorProg, inputs, fieldPixelSize);
      this.drawFullscreen();
    } else {
      gl.viewport(0, 0, width, height);
      this.singleProg.use();
      const pixelSize = wh / height;
      this.setFieldUniforms(this.singleProg, inputs, width, height, pixelSize);
      this.setShadeUniforms(this.singleProg, inputs, pixelSize);
      this.drawFullscreen();
    }
  }

  private renderLines(inputs: RenderInputs): void {
    const gl = this.gl;
    const { width, height } = inputs;
    const cam = inputs.scene.camera;
    const pal = inputs.palette;
    gl.viewport(0, 0, width, height);
    gl.disable(gl.BLEND);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    if (this.lineVertexCount === 0) return;
    this.lineProg.use();
    this.lineProg.vec2('uCenter', cam.centerX, cam.centerY);
    this.lineProg.float('uPixelSize', worldHeight(cam) / height);
    this.lineProg.vec2('uResolution', width, height);
    this.lineProg.float('uRotation', cam.rotation);
    this.lineProg.float('uHalfWidthPx', 1.5);
    this.lineProg.vec3('uA', pal.a[0], pal.a[1], pal.a[2]);
    this.lineProg.vec3('uB', pal.b[0], pal.b[1], pal.b[2]);
    this.lineProg.vec3('uC', pal.c[0], pal.c[1], pal.c[2]);
    this.lineProg.vec3('uD', pal.d[0], pal.d[1], pal.d[2]);
    this.lineProg.float('uCycles', inputs.scene.coloring.cycles);
    this.lineProg.float('uPhase', inputs.phase);
    this.lineProg.float('uFilmic', 0);
    gl.bindVertexArray(this.lineVao);
    gl.drawArrays(gl.TRIANGLES, 0, this.lineVertexCount);
    gl.bindVertexArray(null);
  }

  private renderPoints(inputs: RenderInputs): void {
    const gl = this.gl;
    const { width, height } = inputs;
    const cam = inputs.scene.camera;
    const pal = inputs.palette;
    const internal = this.floatTargets ? gl.RGBA16F : gl.RGBA8;
    let recreated = false;
    if (!this.accTarget || this.accTarget.width !== width || this.accTarget.height !== height) {
      deleteTarget(gl, this.accTarget);
      this.accTarget = createTarget(gl, width, height, internal);
      recreated = true;
    }

    if ((inputs.geometryDirty || recreated) && this.pointCount > 0) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.accTarget.fbo);
      gl.viewport(0, 0, width, height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE);
      this.pointProg.use();
      this.pointProg.vec2('uCenter', cam.centerX, cam.centerY);
      this.pointProg.float('uPixelSize', worldHeight(cam) / height);
      this.pointProg.vec2('uResolution', width, height);
      this.pointProg.float('uRotation', cam.rotation);
      this.pointProg.float('uIntensity', 1.0);
      gl.bindVertexArray(this.pointVao);
      gl.drawArrays(gl.POINTS, 0, this.pointCount);
      gl.bindVertexArray(null);
      gl.disable(gl.BLEND);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    // resolve every frame (cheap; gives free color cycling over the cached cloud)
    gl.viewport(0, 0, width, height);
    this.resolveProg.use();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.accTarget.tex);
    this.resolveProg.int('uAcc', 0);
    this.resolveProg.float('uExposure', 0.06);
    this.resolveProg.float('uCycles', inputs.scene.coloring.cycles);
    this.resolveProg.float('uPhase', inputs.phase);
    this.resolveProg.float('uMapSpread', 0.3);
    this.resolveProg.vec3('uInterior', inputs.scene.coloring.interior[0], inputs.scene.coloring.interior[1], inputs.scene.coloring.interior[2]);
    this.resolveProg.vec3('uA', pal.a[0], pal.a[1], pal.a[2]);
    this.resolveProg.vec3('uB', pal.b[0], pal.b[1], pal.b[2]);
    this.resolveProg.vec3('uC', pal.c[0], pal.c[1], pal.c[2]);
    this.resolveProg.vec3('uD', pal.d[0], pal.d[1], pal.d[2]);
    this.resolveProg.float('uFilmic', 0);
    this.drawFullscreen();
  }

  dispose(): void {
    const gl = this.gl;
    this.fieldProg?.dispose();
    this.colorProg?.dispose();
    this.singleProg.dispose();
    this.lineProg.dispose();
    this.pointProg.dispose();
    this.resolveProg.dispose();
    deleteTarget(gl, this.fieldTarget);
    deleteTarget(gl, this.accTarget);
    gl.deleteVertexArray(this.emptyVao);
    gl.deleteVertexArray(this.lineVao);
    gl.deleteVertexArray(this.pointVao);
    gl.deleteBuffer(this.lineBuf);
    gl.deleteBuffer(this.pointBuf);
  }
}
