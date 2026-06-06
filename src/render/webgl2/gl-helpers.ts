// Thin WebGL2 helpers: shader compile/link, a uniform-location-caching Program
// wrapper, and float render-target creation with capability detection.

export const compileShader = (
  gl: WebGL2RenderingContext,
  type: number,
  src: string,
): WebGLShader => {
  const sh = gl.createShader(type);
  if (!sh) throw new Error('createShader failed');
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(sh) ?? 'unknown';
    gl.deleteShader(sh);
    throw new Error(`Shader compile error:\n${log}\n--- source ---\n${withLineNumbers(src)}`);
  }
  return sh;
};

const withLineNumbers = (src: string): string =>
  src
    .split('\n')
    .map((l, i) => `${String(i + 1).padStart(3, ' ')}  ${l}`)
    .join('\n');

/** Caches uniform locations; setters silently no-op on unused/optimized-out uniforms. */
export class Program {
  readonly program: WebGLProgram;
  private locs = new Map<string, WebGLUniformLocation | null>();
  private attrs = new Map<string, number>();

  constructor(
    private gl: WebGL2RenderingContext,
    vsSrc: string,
    fsSrc: string,
  ) {
    const vs = compileShader(gl, gl.VERTEX_SHADER, vsSrc);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, fsSrc);
    const p = gl.createProgram();
    if (!p) throw new Error('createProgram failed');
    gl.attachShader(p, vs);
    gl.attachShader(p, fs);
    gl.linkProgram(p);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
      const log = gl.getProgramInfoLog(p) ?? 'unknown';
      gl.deleteProgram(p);
      throw new Error(`Program link error:\n${log}`);
    }
    this.program = p;
  }

  use(): void {
    this.gl.useProgram(this.program);
  }

  private loc(name: string): WebGLUniformLocation | null {
    if (!this.locs.has(name)) this.locs.set(name, this.gl.getUniformLocation(this.program, name));
    return this.locs.get(name) ?? null;
  }

  attrib(name: string): number {
    if (!this.attrs.has(name)) this.attrs.set(name, this.gl.getAttribLocation(this.program, name));
    return this.attrs.get(name) as number;
  }

  int(name: string, v: number): void {
    this.gl.uniform1i(this.loc(name), v);
  }
  float(name: string, v: number): void {
    this.gl.uniform1f(this.loc(name), v);
  }
  vec2(name: string, x: number, y: number): void {
    this.gl.uniform2f(this.loc(name), x, y);
  }
  vec3(name: string, x: number, y: number, z: number): void {
    this.gl.uniform3f(this.loc(name), x, y, z);
  }

  dispose(): void {
    this.gl.deleteProgram(this.program);
  }
}

export interface RenderTarget {
  tex: WebGLTexture;
  fbo: WebGLFramebuffer;
  width: number;
  height: number;
}

/** True if RGBA16F textures are color-renderable (needed for the field/accum cache). */
export const detectFloatRenderable = (gl: WebGL2RenderingContext): boolean => {
  const ext = gl.getExtension('EXT_color_buffer_float');
  return !!ext;
};

/** Create (or recreate) a half-float render target. */
export const createTarget = (
  gl: WebGL2RenderingContext,
  width: number,
  height: number,
  internalFormat: number = gl.RGBA16F,
): RenderTarget => {
  const tex = gl.createTexture();
  const fbo = gl.createFramebuffer();
  if (!tex || !fbo) throw new Error('createTarget allocation failed');
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texStorage2D(gl.TEXTURE_2D, 1, internalFormat, width, height);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.bindTexture(gl.TEXTURE_2D, null);
  return { tex, fbo, width, height };
};

export const deleteTarget = (gl: WebGL2RenderingContext, t: RenderTarget | null): void => {
  if (!t) return;
  gl.deleteTexture(t.tex);
  gl.deleteFramebuffer(t.fbo);
};
