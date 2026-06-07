var Fe=Object.defineProperty;var Te=(o,e,t)=>e in o?Fe(o,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):o[e]=t;var u=(o,e,t)=>Te(o,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const i of r)if(i.type==="childList")for(const a of i.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function t(r){const i={};return r.integrity&&(i.integrity=r.integrity),r.referrerPolicy&&(i.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?i.credentials="include":r.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(r){if(r.ep)return;r.ep=!0;const i=t(r);fetch(r.href,i)}})();const ke=2.8,ue=()=>({kind:"mandelbrot",camera:{centerX:-.6,centerY:0,zoomLevel:0,rotation:0},escape:{maxIter:256,power:2,juliaC:[-.8,.156],bailout:256},coloring:{paletteId:"ember",custom:null,cycles:3,remap:"sqrt",phase:0,shade:.35,glow:0,bloom:.06,trap:"none",interior:[0,0,0]},anim:{cycleSpeed:.08,motionScale:1,juliaOrbit:!1,orbitSpeed:.15,lightOrbit:!0},quality:{renderScale:1,dprCap:2}}),Le=o=>({kind:o.kind,camera:{...o.camera},escape:{...o.escape,juliaC:[...o.escape.juliaC]},coloring:{...o.coloring,custom:o.coloring.custom?{...o.coloring.custom}:null,interior:[...o.coloring.interior]},anim:{...o.anim},quality:{...o.quality}}),he=Math.PI*2,R=(o,e,t)=>o<e?e:o>t?t:o,L=o=>Number.isFinite(o)?Number.isInteger(o)&&Math.abs(o)<1e6?String(o):o.toExponential(12):"0";class Ce{constructor(){u(this,"paletteShift",0);u(this,"t",0)}advance(e,t){const n=t.anim.motionScale;this.t+=e*n,this.paletteShift+=e*n*t.anim.cycleSpeed}juliaC(e){if(!e.anim.juliaOrbit)return e.escape.juliaC;const t=this.t*e.anim.orbitSpeed;return[-.5+.55*Math.sin(.7*t+Math.PI/2),0+.18*Math.sin(1.3*t)]}lightDir(e){if(!e.anim.lightOrbit)return[.7071,.7071];const t=this.t*.5*he*.08;return[Math.cos(t),Math.sin(t)]}reset(){this.paletteShift=0,this.t=0}}const oe=o=>{const e=R(o,0,1);return e*e*e*(e*(6*e-15)+10)},Ae=[{center:[-.743643887037151,.13182590420533],zoom:11,dwell:2.6},{center:[.2925755,.0149977],zoom:10,dwell:2.6},{center:[-.722,.2467],zoom:9.5,dwell:2.6},{center:[-1.2568,.3801],zoom:10.5,dwell:2.6},{center:[-.16070135,1.0375665],zoom:9,dwell:2.6}],Me={cx:-.6,cy:0,zoom:-.4,hold:.9},Re=1.6,Ie=1.2,ze=Ae.flatMap(o=>[{...Me},{cx:o.center[0],cy:o.center[1],zoom:o.zoom,hold:o.dwell}]),De=(o,e,t)=>{const n=oe(t),r=oe(Math.min(1,t/.7));return{cx:o.cx+(e.cx-o.cx)*r,cy:o.cy+(e.cy-o.cy)*r,zoom:o.zoom+(e.zoom-o.zoom)*n}},Be=(o,e)=>Math.max(Ie,Math.abs(e.zoom-o.zoom)/Re);class _e{constructor(){u(this,"active",!1);u(this,"kf",ze);u(this,"i",0);u(this,"t",0)}start(e){this.active=!0,this.i=0,this.t=0,this.apply(e,this.kf[0])}stop(){this.active=!1}apply(e,t){e.centerX=t.cx,e.centerY=t.cy,e.zoomLevel=t.zoom,e.rotation=0}update(e,t){if(!this.active)return;const n=this.kf.length,r=this.kf[this.i],i=this.kf[(this.i+1)%n],a=Be(r,i),c=a+i.hold;if(this.t+=e,this.t>=c){this.t-=c,this.i=(this.i+1)%n,this.apply(t,i);return}const l=Math.min(1,this.t/a),b=De(r,i,l);t.centerX=b.cx,t.centerY=b.cy,t.zoomLevel=b.zoom,t.rotation=0}}const O=o=>ke/Math.pow(2,o.zoomLevel),me=(o,e)=>O(o)/Math.max(1,e),fe=(o,e,t,n,r)=>{const i=me(o,r),a=(e-n/2)*i,c=-(t-r/2)*i,l=Math.cos(o.rotation),b=Math.sin(o.rotation);return[a*l-c*b,a*b+c*l]},Ne=(o,e,t,n,r)=>{const[i,a]=fe(o,e,t,n,r);return[o.centerX+i,o.centerY+a]},Y=(o,e,t,n,r,i)=>{const a=Ne(o,e,t,n,r);o.zoomLevel+=i;const[c,l]=fe(o,e,t,n,r);return o.centerX=a[0]-c,o.centerY=a[1]-l,o},Oe=(o,e,t,n)=>{const r=me(o,n),i=Math.cos(o.rotation),a=Math.sin(o.rotation),c=-e*r,l=t*r;return o.centerX+=c*i-l*a,o.centerY+=c*a+l*i,o},pe=[{kind:"mandelbrot",name:"Mandelbrot",mode:"escape",group:"Escape-time"},{kind:"julia",name:"Julia",mode:"escape",group:"Escape-time"},{kind:"multibrot",name:"Multibrot",mode:"escape",group:"Escape-time"},{kind:"koch",name:"Koch curve",mode:"lines",group:"L-system"},{kind:"snowflake",name:"Koch snowflake",mode:"lines",group:"L-system"},{kind:"sierpinski",name:"Sierpinski arrowhead",mode:"lines",group:"L-system"},{kind:"dragon",name:"Dragon curve",mode:"lines",group:"L-system"},{kind:"hilbert",name:"Hilbert curve",mode:"lines",group:"L-system"},{kind:"plant",name:"Fractal plant",mode:"lines",group:"L-system"},{kind:"fern",name:"Barnsley fern",mode:"points",group:"IFS"},{kind:"sierpinski-ifs",name:"Sierpinski (points)",mode:"points",group:"IFS"}],J=Object.fromEntries(pe.map(o=>[o.kind,o])),Z=o=>J[o].mode,Ve=o=>{let e=o.axiom;for(let t=0;t<o.depth;t++){const n=[];for(const r of e)n.push(o.rules[r]??r);e=n.join("")}return e},Ue=(o,e)=>{const t=e.angleDeg*Math.PI/180,n=new Set(e.draw),r=[];let i=0,a=0,c=Math.PI/2;const l=[],b=1;for(const f of o)if(n.has(f)){const s=i+b*Math.cos(c),v=a+b*Math.sin(c);r.push({a:[i,a],b:[s,v]}),i=s,a=v}else if(f==="+")c+=t;else if(f==="-")c-=t;else if(f==="[")l.push({x:i,y:a,h:c});else if(f==="]"){const s=l.pop();s&&(i=s.x,a=s.y,c=s.h)}return r},Xe=o=>{let e=1/0,t=1/0,n=-1/0,r=-1/0;for(const f of o)for(const s of[f.a,f.b])s[0]<e&&(e=s[0]),s[1]<t&&(t=s[1]),s[0]>n&&(n=s[0]),s[1]>r&&(r=s[1]);const i=(e+n)/2,a=(t+r)/2,l=2.6/(Math.max(n-e,r-t)||1),b=f=>[(f[0]-i)*l,(f[1]-a)*l];return o.map(f=>({a:b(f.a),b:b(f.b)}))},je=o=>{const e=[];let t=0;for(const c of o){const l=Math.hypot(c.b[0]-c.a[0],c.b[1]-c.a[1]);e.push(l),t+=l}t=t||1;const n=new Float32Array(o.length*6*5);let r=0,i=0;const a=(c,l,b)=>{n[r++]=c[0],n[r++]=c[1],n[r++]=l[0],n[r++]=l[1],n[r++]=b};for(let c=0;c<o.length;c++){const l=o[c],b=i/t;i+=e[c];const f=i/t,s=l.b[0]-l.a[0],v=l.b[1]-l.a[1],g=Math.hypot(s,v)||1,S=-v/g,F=s/g,p=[S,F],m=[-S,-F];a(l.a,p,b),a(l.a,m,b),a(l.b,p,f),a(l.b,p,f),a(l.a,m,b),a(l.b,m,f)}return{data:n,vertexCount:o.length*6,segmentCount:o.length}},K={koch:{axiom:"F",rules:{F:"F+F--F+F"},angleDeg:60,draw:"F",depth:4},snowflake:{axiom:"F--F--F",rules:{F:"F+F--F+F"},angleDeg:60,draw:"F",depth:4},sierpinski:{axiom:"A",rules:{A:"B-A-B",B:"A+B+A"},angleDeg:60,draw:"AB",depth:6},dragon:{axiom:"FX",rules:{X:"X+YF+",Y:"-FX-Y"},angleDeg:90,draw:"F",depth:11},hilbert:{axiom:"A",rules:{A:"+BF-AFA-FB+",B:"-AF+BFB+FA-"},angleDeg:90,draw:"F",depth:5},plant:{axiom:"X",rules:{X:"F+[[X]-X]-F[-FX]+X",F:"FF"},angleDeg:25,draw:"F",depth:5}},ne=new Map,Ge=(o,e)=>{const t=K[o];if(!t)throw new Error(`No L-system for kind: ${o}`);const n=e!=null?{...t,depth:e}:t,r=`${o}:${n.depth}`,i=ne.get(r);if(i)return i;const a=je(Xe(Ue(Ve(n),n)));return ne.set(r,a),a},He=o=>{switch(o){case"koch":case"snowflake":return 6;case"sierpinski":return 8;case"dragon":return 16;case"hilbert":return 7;case"plant":return 7;default:return 6}},$e=Math.sqrt(3)/4,Ye={fern:{maps:[{a:0,b:0,c:0,d:.16,e:0,f:0,p:.01},{a:.85,b:.04,c:-.04,d:.85,e:0,f:1.6,p:.85},{a:.2,b:-.26,c:.23,d:.22,e:0,f:1.6,p:.07},{a:-.15,b:.28,c:.26,d:.24,e:0,f:.44,p:.07}]},"sierpinski-ifs":{maps:[{a:.5,b:0,c:0,d:.5,e:0,f:0,p:1},{a:.5,b:0,c:0,d:.5,e:.5,f:0,p:1},{a:.5,b:0,c:0,d:.5,e:.25,f:$e,p:1}]}},We=(o,e,t=25)=>{const n=o.maps,r=[];let i=0;for(const d of n)i+=d.p,r.push(i);const a=new Float32Array(e*3);let c=0,l=0,b=0,f=1/0,s=1/0,v=-1/0,g=-1/0;const S=n.length>1?n.length-1:1;for(let d=0;d<e+t;d++){const P=Math.random()*i;let y=0;for(;y<r.length-1&&P>r[y];)y++;const w=n[y],A=w.a*c+w.b*l+w.e,M=w.c*c+w.d*l+w.f;c=A,l=M,d>=t&&(a[b++]=c,a[b++]=l,a[b++]=y/S,c<f&&(f=c),l<s&&(s=l),c>v&&(v=c),l>g&&(g=l))}const F=(f+v)/2,p=(s+g)/2,E=2.4/(Math.max(v-f,g-s)||1);for(let d=0;d<e;d++)a[d*3]=(a[d*3]-F)*E,a[d*3+1]=(a[d*3+1]-p)*E;return{data:a,count:e}},qe=(o,e)=>{const t=[0,0,0];for(let n=0;n<3;n++)t[n]=o.a[n]+o.b[n]*Math.cos(he*(o.c[n]*e+o.d[n]));return t},G=[{id:"rainbow",name:"Rainbow",palette:{a:[.5,.5,.5],b:[.5,.5,.5],c:[1,1,1],d:[0,.33,.67]}},{id:"ember",name:"Ember",palette:{a:[.5,.5,.5],b:[.5,.5,.5],c:[1,1,1],d:[0,.1,.2]}},{id:"ice",name:"Ice",palette:{a:[.5,.5,.5],b:[.5,.5,.5],c:[1,1,.5],d:[.8,.9,.3]}},{id:"gold",name:"Gold",palette:{a:[.5,.5,.5],b:[.5,.5,.5],c:[1,.7,.4],d:[0,.15,.2]}},{id:"candy",name:"Candy",palette:{a:[.5,.5,.5],b:[.5,.5,.5],c:[2,1,0],d:[.5,.2,.25]}},{id:"aurora",name:"Aurora",palette:{a:[.5,.5,.5],b:[.5,.5,.5],c:[1,1,1],d:[.3,.2,.2]}},{id:"magma",name:"Magma",palette:{a:[.8,.5,.4],b:[.2,.4,.2],c:[2,1,1],d:[0,.25,.25]}},{id:"twilight",name:"Twilight",palette:{a:[.5,.5,.55],b:[.45,.4,.5],c:[1,1,2],d:[.6,.55,.35]}}],Q=Object.fromEntries(G.map(o=>[o.id,o])),Ke=()=>G[1],re=(o,e,t)=>{const n=o.createShader(e);if(!n)throw new Error("createShader failed");if(o.shaderSource(n,t),o.compileShader(n),!o.getShaderParameter(n,o.COMPILE_STATUS)){const r=o.getShaderInfoLog(n)??"unknown";throw o.deleteShader(n),new Error(`Shader compile error:
${r}
--- source ---
${Je(t)}`)}return n},Je=o=>o.split(`
`).map((e,t)=>`${String(t+1).padStart(3," ")}  ${e}`).join(`
`);class _{constructor(e,t,n){u(this,"program");u(this,"locs",new Map);u(this,"attrs",new Map);this.gl=e;const r=re(e,e.VERTEX_SHADER,t),i=re(e,e.FRAGMENT_SHADER,n),a=e.createProgram();if(!a)throw new Error("createProgram failed");if(e.attachShader(a,r),e.attachShader(a,i),e.linkProgram(a),e.deleteShader(r),e.deleteShader(i),!e.getProgramParameter(a,e.LINK_STATUS)){const c=e.getProgramInfoLog(a)??"unknown";throw e.deleteProgram(a),new Error(`Program link error:
${c}`)}this.program=a}use(){this.gl.useProgram(this.program)}loc(e){return this.locs.has(e)||this.locs.set(e,this.gl.getUniformLocation(this.program,e)),this.locs.get(e)??null}attrib(e){return this.attrs.has(e)||this.attrs.set(e,this.gl.getAttribLocation(this.program,e)),this.attrs.get(e)}int(e,t){this.gl.uniform1i(this.loc(e),t)}float(e,t){this.gl.uniform1f(this.loc(e),t)}vec2(e,t,n){this.gl.uniform2f(this.loc(e),t,n)}vec3(e,t,n,r){this.gl.uniform3f(this.loc(e),t,n,r)}dispose(){this.gl.deleteProgram(this.program)}}const Ze=o=>!!o.getExtension("EXT_color_buffer_float"),ie=(o,e,t,n=o.RGBA16F)=>{const r=o.createTexture(),i=o.createFramebuffer();if(!r||!i)throw new Error("createTarget allocation failed");return o.bindTexture(o.TEXTURE_2D,r),o.texStorage2D(o.TEXTURE_2D,1,n,e,t),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MIN_FILTER,o.LINEAR),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MAG_FILTER,o.LINEAR),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_S,o.CLAMP_TO_EDGE),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_T,o.CLAMP_TO_EDGE),o.bindFramebuffer(o.FRAMEBUFFER,i),o.framebufferTexture2D(o.FRAMEBUFFER,o.COLOR_ATTACHMENT0,o.TEXTURE_2D,r,0),o.bindFramebuffer(o.FRAMEBUFFER,null),o.bindTexture(o.TEXTURE_2D,null),{tex:r,fbo:i,width:e,height:t}},V=(o,e)=>{e&&(o.deleteTexture(e.tex),o.deleteFramebuffer(e.fbo))},z=`#version 300 es
precision highp float;
precision highp int;
`,U=`${z}
out vec2 vUV;
void main() {
  vec2 p = vec2((gl_VertexID == 1) ? 3.0 : -1.0, (gl_VertexID == 2) ? 3.0 : -1.0);
  vUV = p * 0.5 + 0.5;
  gl_Position = vec4(p, 0.0, 1.0);
}
`,ge=`
vec2 cmul(vec2 a, vec2 b) { return vec2(a.x*b.x - a.y*b.y, a.x*b.y + a.y*b.x); }
vec2 cdiv(vec2 a, vec2 b) { float d = max(dot(b,b), 1e-30); return vec2(a.x*b.x + a.y*b.y, a.y*b.x - a.x*b.y) / d; }
vec2 cpow(vec2 z, float p) {
  float r = length(z);
  if (r < 1e-30) return vec2(0.0);
  float a = atan(z.y, z.x);
  float rp = pow(r, p);
  return rp * vec2(cos(p*a), sin(p*a));
}
`,H=`
uniform vec3 uA, uB, uC, uD;
vec3 cosPalette(float t) { return uA + uB * cos(6.28318530718 * (uC * t + uD)); }
`,$=`
uniform float uFilmic;   // 0 = linear clamp, 1 = full ACES filmic rolloff
vec3 acesFilmic(vec3 x) {
  const float a = 2.51, b = 0.03, c = 2.43, d = 0.59, e = 0.14;
  return clamp((x * (a*x + b)) / (x * (c*x + d) + e), 0.0, 1.0);
}
vec3 linearToSRGB(vec3 c) {
  c = clamp(c, 0.0, 1.0);
  return mix(c * 12.92, 1.055 * pow(c, vec3(1.0/2.4)) - 0.055, step(0.0031308, c));
}
float tpdfDither(vec2 p) {
  float n1 = fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  float n2 = fract(sin(dot(p + 1.0, vec2(12.9898, 78.233))) * 43758.5453);
  return (n1 + n2 - 1.0); // triangular PDF in [-1,1]
}
vec3 encodeColor(vec3 lin, vec2 frag) {
  vec3 tm = mix(lin, acesFilmic(lin), clamp(uFilmic, 0.0, 1.0));
  vec3 srgb = linearToSRGB(tm);
  srgb += tpdfDither(frag) * (1.0 / 255.0); // kill 8-bit banding in display space
  return srgb;
}
`,ee=`
uniform int   uMaxIter;
uniform float uPixelSize;
uniform int   uTrap;       // 0 none, 1 stalk, 2 point, 3 circle
`,be=`
uniform vec2  uResolution;
uniform vec2  uCenter;
uniform float uRotation;
uniform int   uKind;       // 0 mandelbrot, 1 julia, 2 multibrot
uniform float uPower;
uniform vec2  uJuliaC;
uniform float uBailout2;   // escape radius squared
`,ve=`
uniform float uCycles;
uniform float uPhase;
uniform int   uRemap;      // 0 sqrt, 1 log, 2 linear
uniform float uShade;
uniform float uGlow;
uniform vec2  uLight;
uniform vec3  uInterior;
`,ye=`
vec2 complexFromFrag() {
  vec2 off = (gl_FragCoord.xy - 0.5 * uResolution) * uPixelSize;
  float cr = cos(uRotation), sr = sin(uRotation);
  vec2 rw = vec2(off.x * cr - off.y * sr, off.x * sr + off.y * cr);
  return uCenter + rw;
}
`,we=`
const int ITER_CAP = 2048;
vec4 fractalField(vec2 c) {
  vec2 z, dz, cc;
  if (uKind == 1) { z = c; cc = uJuliaC; dz = vec2(1.0, 0.0); }   // Julia
  else            { z = vec2(0.0); cc = c; dz = vec2(0.0); }      // Mandelbrot/Multibrot
  float trap = 1e20;
  int n = 0;
  float m2 = 0.0;
  bool escaped = false;
  bool isP2 = (uPower == 2.0);
  for (int i = 0; i < ITER_CAP; i++) {
    if (i >= uMaxIter) break;
    if (isP2) {
      dz = 2.0 * cmul(z, dz) + vec2(1.0, 0.0);
      z  = vec2(z.x*z.x - z.y*z.y, 2.0*z.x*z.y) + cc;
    } else {
      dz = uPower * cmul(cpow(z, uPower - 1.0), dz) + vec2(1.0, 0.0);
      z  = cpow(z, uPower) + cc;
    }
    if      (uTrap == 1) trap = min(trap, min(abs(z.x), abs(z.y)));   // Pickover stalk
    else if (uTrap == 2) trap = min(trap, length(z));                // point
    else if (uTrap == 3) trap = min(trap, abs(length(z) - 1.0));     // unit circle
    m2 = dot(z, z);
    n = i;
    if (m2 > uBailout2) { escaped = true; break; }
  }
  if (!escaped) {
    float tr = (uTrap == 0) ? -1.0 : sqrt(max(trap, 0.0));
    return vec4(-1.0, 0.0, 0.0, tr);
  }
  float logz = 0.5 * log(m2);                       // log|z|
  float nu   = log2(logz / (0.5 * log(uBailout2))); // log2( log|z| / log R )
  float mu   = float(n) + 1.0 - nu;
  float adz  = max(length(dz), 1e-20);
  float de   = sqrt(m2) * logz / adz;               // |z|*log|z|/|dz|
  vec2  u    = cdiv(z, dz);
  float nAng = atan(u.y, u.x);
  float tr   = (uTrap == 0) ? 0.0 : sqrt(max(trap, 0.0));
  return vec4(mu, de, nAng, tr);
}
`,xe=`
float remapMu(float mu) {
  if (uRemap == 0) return sqrt(max(mu, 0.0)) * 0.1;
  if (uRemap == 1) return log(max(mu, 0.0) + 1.0) / log(float(uMaxIter) + 1.0);
  return mu / float(uMaxIter);
}
vec3 shadeField(vec4 f) {
  float mu = f.x;
  if (mu < 0.0) {                                   // interior
    if (uTrap != 0 && f.w >= 0.0) {
      float tt = pow(clamp(f.w * 3.0, 0.0, 1.0), 0.5);
      return cosPalette(fract(tt * uCycles + uPhase)) * 0.65;
    }
    return uInterior;
  }
  float t = remapMu(mu);
  vec3 col = cosPalette(fract(t * uCycles + uPhase));
  if (uTrap != 0) {
    float tt = pow(clamp(f.w * 3.0, 0.0, 1.0), 0.5);
    col = mix(col, cosPalette(fract(tt * uCycles + uPhase)), 0.5);
  }
  if (uShade > 0.0) {
    vec2 nrm = vec2(cos(f.z), sin(f.z));
    float diff = clamp(dot(nrm, normalize(uLight)) * 0.5 + 0.6, 0.0, 1.0);
    col = mix(col, col * diff, uShade);
  }
  if (uGlow > 0.0) {
    float d = f.y / max(uPixelSize, 1e-30);         // DE in pixels
    col += exp(-2.0 * d) * uGlow * (uA + uB);
  }
  return col;
}
`,Qe=()=>z+ge+ee+be+ye+we+`
in vec2 vUV;
out vec4 outField;
void main() { outField = fractalField(complexFromFrag()); }
`,et=()=>z+H+$+ee+ve+xe+`
in vec2 vUV;
out vec4 fragColor;
uniform sampler2D uField;
void main() {
  vec4 f = texture(uField, vUV);
  fragColor = vec4(encodeColor(shadeField(f), gl_FragCoord.xy), 1.0);
}
`,tt=()=>z+ge+H+$+ee+be+ve+ye+we+xe+`
in vec2 vUV;
out vec4 fragColor;
void main() {
  vec4 f = fractalField(complexFromFrag());
  fragColor = vec4(encodeColor(shadeField(f), gl_FragCoord.xy), 1.0);
}
`,ot=`${z}
in vec2  aPos;
in vec2  aNorm;
in float aT;
uniform vec2  uCenter;
uniform float uPixelSize;
uniform vec2  uResolution;
uniform float uRotation;
uniform float uHalfWidthPx;
out float vT;
void main() {
  // Offset in world units; dividing by uPixelSize below cancels it to a constant
  // pixel width at any zoom.
  vec2 world = aPos + aNorm * (uHalfWidthPx * uPixelSize);
  vec2 d = world - uCenter;
  float cr = cos(-uRotation), sr = sin(-uRotation);
  vec2 rd = vec2(d.x*cr - d.y*sr, d.x*sr + d.y*cr);
  vec2 px = rd / uPixelSize;            // pixel offset from center
  vec2 clip = px / (0.5 * uResolution); // -> clip space
  vT = aT;
  gl_Position = vec4(clip, 0.0, 1.0);
}
`,nt=`${z}
${H}
${$}
in float vT;
out vec4 fragColor;
uniform float uCycles;
uniform float uPhase;
void main() {
  vec3 col = cosPalette(fract(vT * uCycles + uPhase));
  fragColor = vec4(encodeColor(col, gl_FragCoord.xy), 1.0);
}
`,rt=`${z}
in vec2  aPos;
in float aMap;          // normalized map index 0..1
uniform vec2  uCenter;
uniform float uPixelSize;
uniform vec2  uResolution;
uniform float uRotation;
out float vMap;
void main() {
  vec2 d = aPos - uCenter;
  float cr = cos(-uRotation), sr = sin(-uRotation);
  vec2 rd = vec2(d.x*cr - d.y*sr, d.x*sr + d.y*cr);
  vec2 px = rd / uPixelSize;
  vec2 clip = px / (0.5 * uResolution);
  vMap = aMap;
  gl_PointSize = 1.0;
  gl_Position = vec4(clip, 0.0, 1.0);
}
`,it=`${z}
in float vMap;
out vec4 outAcc;
uniform float uIntensity;
void main() {
  outAcc = vec4(vMap * uIntensity, 0.0, 0.0, uIntensity);
}
`,at=`${z}
${H}
${$}
in vec2 vUV;
out vec4 fragColor;
uniform sampler2D uAcc;
uniform float uExposure;
uniform float uCycles;
uniform float uPhase;
uniform float uMapSpread;
uniform vec3  uInterior;
void main() {
  vec4 a = texture(uAcc, vUV);
  float dens = a.a;
  if (dens <= 0.0) {
    fragColor = vec4(encodeColor(uInterior, gl_FragCoord.xy), 1.0);
    return;
  }
  float lum = 1.0 - exp(-dens * uExposure);
  float mapAvg = a.r / dens;
  float coord = fract(lum * uCycles + mapAvg * uMapSpread + uPhase);
  vec3 col = cosPalette(coord) * (0.15 + 0.85 * lum);
  fragColor = vec4(encodeColor(col, gl_FragCoord.xy), 1.0);
}
`,ae=o=>o==="stalk"?1:o==="point"?2:o==="circle"?3:0,st=o=>o==="log"?1:o==="linear"?2:0;class ct{constructor(e){u(this,"kind","webgl2");u(this,"floatTargets");u(this,"gl");u(this,"fieldProg",null);u(this,"colorProg",null);u(this,"singleProg");u(this,"lineProg");u(this,"pointProg");u(this,"resolveProg");u(this,"emptyVao");u(this,"lineVao");u(this,"lineBuf");u(this,"lineVertexCount",0);u(this,"pointVao");u(this,"pointBuf");u(this,"pointCount",0);u(this,"fieldTarget",null);u(this,"accTarget",null);this.gl=e,this.floatTargets=Ze(e),this.singleProg=new _(e,U,tt()),this.lineProg=new _(e,ot,nt),this.pointProg=new _(e,rt,it),this.resolveProg=new _(e,U,at),this.floatTargets&&(this.fieldProg=new _(e,U,Qe()),this.colorProg=new _(e,U,et())),this.emptyVao=this.mustVao(),this.lineVao=this.mustVao(),this.lineBuf=this.mustBuf(),this.pointVao=this.mustVao(),this.pointBuf=this.mustBuf(),this.setupLineVao(),this.setupPointVao()}mustVao(){const e=this.gl.createVertexArray();if(!e)throw new Error("createVertexArray failed");return e}mustBuf(){const e=this.gl.createBuffer();if(!e)throw new Error("createBuffer failed");return e}setupLineVao(){const e=this.gl,t=5*4;e.bindVertexArray(this.lineVao),e.bindBuffer(e.ARRAY_BUFFER,this.lineBuf);const n=this.lineProg.attrib("aPos"),r=this.lineProg.attrib("aNorm"),i=this.lineProg.attrib("aT");n>=0&&(e.enableVertexAttribArray(n),e.vertexAttribPointer(n,2,e.FLOAT,!1,t,0)),r>=0&&(e.enableVertexAttribArray(r),e.vertexAttribPointer(r,2,e.FLOAT,!1,t,8)),i>=0&&(e.enableVertexAttribArray(i),e.vertexAttribPointer(i,1,e.FLOAT,!1,t,16)),e.bindVertexArray(null)}setupPointVao(){const e=this.gl,t=3*4;e.bindVertexArray(this.pointVao),e.bindBuffer(e.ARRAY_BUFFER,this.pointBuf);const n=this.pointProg.attrib("aPos"),r=this.pointProg.attrib("aMap");n>=0&&(e.enableVertexAttribArray(n),e.vertexAttribPointer(n,2,e.FLOAT,!1,t,0)),r>=0&&(e.enableVertexAttribArray(r),e.vertexAttribPointer(r,1,e.FLOAT,!1,t,8)),e.bindVertexArray(null)}resize(e,t){}setLineGeometry(e){const t=this.gl;t.bindBuffer(t.ARRAY_BUFFER,this.lineBuf),t.bufferData(t.ARRAY_BUFFER,e.data,t.DYNAMIC_DRAW),this.lineVertexCount=e.vertexCount}setPointGeometry(e){const t=this.gl;t.bindBuffer(t.ARRAY_BUFFER,this.pointBuf),t.bufferData(t.ARRAY_BUFFER,e.data,t.STATIC_DRAW),this.pointCount=e.count}render(e){const t=Z(e.scene.kind);t==="escape"?this.renderEscape(e):t==="lines"?this.renderLines(e):this.renderPoints(e)}drawFullscreen(){const e=this.gl;e.bindVertexArray(this.emptyVao),e.drawArrays(e.TRIANGLES,0,3),e.bindVertexArray(null)}setFieldUniforms(e,t,n,r,i){const a=t.scene,c=a.escape;e.vec2("uResolution",n,r),e.vec2("uCenter",a.camera.centerX,a.camera.centerY),e.float("uPixelSize",i),e.float("uRotation",a.camera.rotation),e.int("uKind",a.kind==="julia"?1:0),e.float("uPower",c.power),e.vec2("uJuliaC",t.juliaC[0],t.juliaC[1]),e.int("uMaxIter",c.maxIter),e.float("uBailout2",c.bailout*c.bailout),e.int("uTrap",ae(a.coloring.trap))}setShadeUniforms(e,t,n){const r=t.scene.coloring,i=t.palette;e.vec3("uA",i.a[0],i.a[1],i.a[2]),e.vec3("uB",i.b[0],i.b[1],i.b[2]),e.vec3("uC",i.c[0],i.c[1],i.c[2]),e.vec3("uD",i.d[0],i.d[1],i.d[2]),e.float("uCycles",r.cycles),e.float("uPhase",t.phase),e.int("uRemap",st(r.remap)),e.float("uShade",r.shade),e.float("uGlow",r.glow),e.vec2("uLight",t.lightDir[0],t.lightDir[1]),e.vec3("uInterior",r.interior[0],r.interior[1],r.interior[2]),e.float("uFilmic",r.bloom),e.int("uMaxIter",t.scene.escape.maxIter),e.float("uPixelSize",n),e.int("uTrap",ae(r.trap))}renderEscape(e){const t=this.gl,{width:n,height:r,fieldScale:i}=e,a=O(e.scene.camera);if(this.floatTargets&&this.fieldProg&&this.colorProg){const c=Math.max(1,Math.round(n*i)),l=Math.max(1,Math.round(r*i));let b=!1;(!this.fieldTarget||this.fieldTarget.width!==c||this.fieldTarget.height!==l)&&(V(t,this.fieldTarget),this.fieldTarget=ie(t,c,l),b=!0);const f=a/l;(e.geometryDirty||b)&&(t.bindFramebuffer(t.FRAMEBUFFER,this.fieldTarget.fbo),t.viewport(0,0,c,l),this.fieldProg.use(),this.setFieldUniforms(this.fieldProg,e,c,l,f),this.drawFullscreen(),t.bindFramebuffer(t.FRAMEBUFFER,null)),t.viewport(0,0,n,r),this.colorProg.use(),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,this.fieldTarget.tex),this.colorProg.int("uField",0),this.setShadeUniforms(this.colorProg,e,f),this.drawFullscreen()}else{t.viewport(0,0,n,r),this.singleProg.use();const c=a/r;this.setFieldUniforms(this.singleProg,e,n,r,c),this.setShadeUniforms(this.singleProg,e,c),this.drawFullscreen()}}renderLines(e){const t=this.gl,{width:n,height:r}=e,i=e.scene.camera,a=e.palette;t.viewport(0,0,n,r),t.disable(t.BLEND),t.clearColor(0,0,0,1),t.clear(t.COLOR_BUFFER_BIT),this.lineVertexCount!==0&&(this.lineProg.use(),this.lineProg.vec2("uCenter",i.centerX,i.centerY),this.lineProg.float("uPixelSize",O(i)/r),this.lineProg.vec2("uResolution",n,r),this.lineProg.float("uRotation",i.rotation),this.lineProg.float("uHalfWidthPx",1.5),this.lineProg.vec3("uA",a.a[0],a.a[1],a.a[2]),this.lineProg.vec3("uB",a.b[0],a.b[1],a.b[2]),this.lineProg.vec3("uC",a.c[0],a.c[1],a.c[2]),this.lineProg.vec3("uD",a.d[0],a.d[1],a.d[2]),this.lineProg.float("uCycles",e.scene.coloring.cycles),this.lineProg.float("uPhase",e.phase),this.lineProg.float("uFilmic",0),t.bindVertexArray(this.lineVao),t.drawArrays(t.TRIANGLES,0,this.lineVertexCount),t.bindVertexArray(null))}renderPoints(e){const t=this.gl,{width:n,height:r}=e,i=e.scene.camera,a=e.palette,c=this.floatTargets?t.RGBA16F:t.RGBA8;let l=!1;(!this.accTarget||this.accTarget.width!==n||this.accTarget.height!==r)&&(V(t,this.accTarget),this.accTarget=ie(t,n,r,c),l=!0),(e.geometryDirty||l)&&this.pointCount>0&&(t.bindFramebuffer(t.FRAMEBUFFER,this.accTarget.fbo),t.viewport(0,0,n,r),t.clearColor(0,0,0,0),t.clear(t.COLOR_BUFFER_BIT),t.enable(t.BLEND),t.blendFunc(t.ONE,t.ONE),this.pointProg.use(),this.pointProg.vec2("uCenter",i.centerX,i.centerY),this.pointProg.float("uPixelSize",O(i)/r),this.pointProg.vec2("uResolution",n,r),this.pointProg.float("uRotation",i.rotation),this.pointProg.float("uIntensity",1),t.bindVertexArray(this.pointVao),t.drawArrays(t.POINTS,0,this.pointCount),t.bindVertexArray(null),t.disable(t.BLEND),t.bindFramebuffer(t.FRAMEBUFFER,null)),t.viewport(0,0,n,r),this.resolveProg.use(),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,this.accTarget.tex),this.resolveProg.int("uAcc",0),this.resolveProg.float("uExposure",.06),this.resolveProg.float("uCycles",e.scene.coloring.cycles),this.resolveProg.float("uPhase",e.phase),this.resolveProg.float("uMapSpread",.3),this.resolveProg.vec3("uInterior",e.scene.coloring.interior[0],e.scene.coloring.interior[1],e.scene.coloring.interior[2]),this.resolveProg.vec3("uA",a.a[0],a.a[1],a.a[2]),this.resolveProg.vec3("uB",a.b[0],a.b[1],a.b[2]),this.resolveProg.vec3("uC",a.c[0],a.c[1],a.c[2]),this.resolveProg.vec3("uD",a.d[0],a.d[1],a.d[2]),this.resolveProg.float("uFilmic",0),this.drawFullscreen()}dispose(){const e=this.gl;this.fieldProg?.dispose(),this.colorProg?.dispose(),this.singleProg.dispose(),this.lineProg.dispose(),this.pointProg.dispose(),this.resolveProg.dispose(),V(e,this.fieldTarget),V(e,this.accTarget),e.deleteVertexArray(this.emptyVao),e.deleteVertexArray(this.lineVao),e.deleteVertexArray(this.pointVao),e.deleteBuffer(this.lineBuf),e.deleteBuffer(this.pointBuf)}}const lt=o=>{const e=o.getContext("webgl2",{antialias:!1,alpha:!1,depth:!1,stencil:!1,powerPreference:"high-performance",preserveDrawingBuffer:!1});if(e){const t=new ct(e);return{kind:"webgl2",renderer:t,note:t.floatTargets?"WebGL2":"WebGL2 (no float cache)"}}return{kind:"none",renderer:null,note:"WebGL2 unavailable"}},dt=20,ut=3e5,ht=.45,mt=.15,ft=o=>o.coloring.custom??(Q[o.coloring.paletteId]??Ke()).palette;class pt{constructor(e,t){u(this,"scene");u(this,"clock",new Ce);u(this,"cinematic",new _e);u(this,"backend");u(this,"backendNote");u(this,"renderer");u(this,"canvas");u(this,"backingW",1);u(this,"backingH",1);u(this,"geometryDirty",!0);u(this,"lastInputT",-1e9);u(this,"nowSec",0);u(this,"interacting",!1);u(this,"renderScale",1);u(this,"idleScaleCap",1);u(this,"emaFrameMs",16);u(this,"lineDepths",new Map);this.canvas=e,this.scene=t;const n=lt(e);this.renderer=n.renderer,this.backend=n.kind,this.backendNote=n.note,this.renderer&&this.loadGeometryFor(t.kind)}get ok(){return this.renderer!==null}get floatTargets(){return this.renderer?.floatTargets??!1}resize(e,t,n){const r=this.scene.quality.dprCap,i=Math.min(n,r);this.backingW=Math.max(1,Math.round(e*i)),this.backingH=Math.max(1,Math.round(t*i)),this.canvas.width=this.backingW,this.canvas.height=this.backingH,this.renderer?.resize(this.backingW,this.backingH),this.geometryDirty=!0}markFieldDirty(){this.geometryDirty=!0}notifyInteraction(){this.lastInputT=this.nowSec,this.geometryDirty=!0,this.cinematic.stop()}setKind(e){this.cinematic.stop(),this.scene.kind=e,this.resetCameraFor(e),this.loadGeometryFor(e),this.geometryDirty=!0}resetView(){this.resetCameraFor(this.scene.kind),this.geometryDirty=!0}adoptScene(e){this.cinematic.stop(),this.scene=e,this.loadGeometryFor(e.kind),this.geometryDirty=!0}startTour(){this.scene.kind!=="mandelbrot"&&this.setKind("mandelbrot"),this.cinematic.start(this.scene.camera),this.geometryDirty=!0}stopTour(){this.cinematic.stop()}get tourActive(){return this.cinematic.active}setLineDepth(e,t){this.lineDepths.set(e,t),this.scene.kind===e&&this.loadGeometryFor(e),this.geometryDirty=!0}lineDepth(e){return this.lineDepths.get(e)}loadGeometryFor(e){if(!this.renderer)return;const t=Z(e);if(t==="lines")this.renderer.setLineGeometry(Ge(e,this.lineDepths.get(e)));else if(t==="points"){const n=Ye[e];n&&this.renderer.setPointGeometry(We(n,ut))}}resetCameraFor(e){const t=this.scene.camera;switch(t.rotation=0,e){case"mandelbrot":t.centerX=-.6,t.centerY=0,t.zoomLevel=0;break;case"julia":case"multibrot":t.centerX=0,t.centerY=0,t.zoomLevel=-.15;break;default:t.centerX=0,t.centerY=0,t.zoomLevel=-.1}}beginFrame(e,t){this.nowSec=e,this.emaFrameMs+=(t-this.emaFrameMs)*.1,this.interacting=e-this.lastInputT<mt||this.cinematic.active,this.interacting||(this.emaFrameMs>22&&this.idleScaleCap>.5?this.idleScaleCap=Math.max(.5,this.idleScaleCap-.08):this.emaFrameMs<12&&this.idleScaleCap<1&&(this.idleScaleCap=Math.min(1,this.idleScaleCap+.04)));const n=this.interacting?Math.min(ht,this.idleScaleCap):this.idleScaleCap;Math.abs(n-this.renderScale)>.001&&(this.renderScale=n,this.geometryDirty=!0),this.scene.kind==="julia"&&this.scene.anim.juliaOrbit&&this.scene.anim.motionScale>0&&(this.geometryDirty=!0)}advance(e){this.clock.advance(e,this.scene),this.cinematic.active&&this.scene.anim.motionScale>0&&this.scene.kind==="mandelbrot"&&(this.cinematic.update(e,this.scene.camera),this.geometryDirty=!0)}render(){if(!this.renderer)return;const e={scene:this.scene,width:this.backingW,height:this.backingH,fieldScale:this.renderScale,palette:ft(this.scene),phase:this.scene.coloring.phase+this.clock.paletteShift,juliaC:this.clock.juliaC(this.scene),lightDir:this.clock.lightDir(this.scene),geometryDirty:this.geometryDirty};this.renderer.render(e),this.geometryDirty=!1}get fps(){return this.emaFrameMs>0?1e3/this.emaFrameMs:0}get magnification(){return Math.pow(2,this.scene.camera.zoomLevel)}get precisionWarn(){return this.scene.camera.zoomLevel>16}get worldHeightNow(){return O(this.scene.camera)}get backingSize(){return[this.backingW,this.backingH]}snapshot(){return Le(this.scene)}dispose(){this.renderer?.dispose()}}class gt{constructor(e){u(this,"last",0);u(this,"acc",0);u(this,"raf",0);u(this,"running",!1);u(this,"STEP",1/120);u(this,"onVisibility",()=>{document.hidden?cancelAnimationFrame(this.raf):this.running&&(this.last=0,this.raf=requestAnimationFrame(this.frame))});u(this,"frame",e=>{if(!this.running)return;this.last===0&&(this.last=e);let t=(e-this.last)/1e3;this.last=e,t=Math.min(t,.1),this.engine.beginFrame(e/1e3,t*1e3),this.acc+=t;let n=0;for(;this.acc>=this.STEP&&n<8;)this.engine.advance(this.STEP),this.acc-=this.STEP,n++;this.engine.render(),this.raf=requestAnimationFrame(this.frame)});this.engine=e}start(){this.running||(this.running=!0,this.last=0,this.raf=requestAnimationFrame(this.frame),document.addEventListener("visibilitychange",this.onVisibility))}stop(){this.running=!1,cancelAnimationFrame(this.raf),document.removeEventListener("visibilitychange",this.onVisibility)}}const bt=-3,vt=(o,e,t)=>{const n=new Map;let r=!1,i=0,a=0,c=0;const l=()=>o.getBoundingClientRect(),b=p=>{const m=l();return[p.clientX-m.left,p.clientY-m.top]},f=()=>{e.scene.camera.zoomLevel=R(e.scene.camera.zoomLevel,bt,dt)},s=p=>{o.setPointerCapture(p.pointerId);const[m,E]=b(p);if(n.set(p.pointerId,{x:m,y:E}),n.size===1)r=!0,i=m,a=E,o.classList.add("dragging");else if(n.size===2){const d=[...n.values()];c=Math.hypot(d[0].x-d[1].x,d[0].y-d[1].y)}},v=p=>{if(!n.has(p.pointerId))return;const[m,E]=b(p);n.set(p.pointerId,{x:m,y:E});const d=l();if(n.size>=2){const P=[...n.values()],y=Math.hypot(P[0].x-P[1].x,P[0].y-P[1].y),w=(P[0].x+P[1].x)/2,A=(P[0].y+P[1].y)/2;if(c>0&&y>0){const M=Math.log2(y/c);Y(e.scene.camera,w,A,d.width,d.height,M),f()}c=y,e.notifyInteraction(),t();return}r&&(Oe(e.scene.camera,m-i,E-a,d.height),i=m,a=E,e.notifyInteraction(),t())},g=p=>{n.delete(p.pointerId),n.size<2&&(c=0),n.size===0&&(r=!1,o.classList.remove("dragging"))},S=p=>{p.preventDefault();const m=l(),E=p.clientX-m.left,d=p.clientY-m.top,P=-Math.sign(p.deltaY)*.5;Y(e.scene.camera,E,d,m.width,m.height,P),f(),e.notifyInteraction(),t()},F=p=>{const m=l();Y(e.scene.camera,p.clientX-m.left,p.clientY-m.top,m.width,m.height,1),f(),e.notifyInteraction(),t()};return o.addEventListener("pointerdown",s),o.addEventListener("pointermove",v),o.addEventListener("pointerup",g),o.addEventListener("pointercancel",g),o.addEventListener("wheel",S,{passive:!1}),o.addEventListener("dblclick",F),()=>{o.removeEventListener("pointerdown",s),o.removeEventListener("pointermove",v),o.removeEventListener("pointerup",g),o.removeEventListener("pointercancel",g),o.removeEventListener("wheel",S),o.removeEventListener("dblclick",F)}},yt=o=>{const e=R(o,0,1);return e<=.0031308?e*12.92:1.055*Math.pow(e,1/2.4)-.055},wt=new Set(Object.keys(J)),xt=new Set(["sqrt","log","linear"]),Et=new Set(["none","stalk","point","circle"]),te=o=>{const e=new URLSearchParams;return e.set("k",o.kind),e.set("cx",L(o.camera.centerX)),e.set("cy",L(o.camera.centerY)),e.set("z",L(o.camera.zoomLevel)),o.camera.rotation&&e.set("rot",L(o.camera.rotation)),e.set("it",String(o.escape.maxIter)),o.escape.power!==2&&e.set("pw",L(o.escape.power)),e.set("jx",L(o.escape.juliaC[0])),e.set("jy",L(o.escape.juliaC[1])),e.set("bl",L(o.escape.bailout)),e.set("pal",o.coloring.paletteId),e.set("cyc",L(o.coloring.cycles)),e.set("rm",o.coloring.remap),e.set("ph",L(o.coloring.phase)),e.set("sh",L(o.coloring.shade)),e.set("gl",L(o.coloring.glow)),e.set("bm",L(o.coloring.bloom)),e.set("tr",o.coloring.trap),e.set("cs",L(o.anim.cycleSpeed)),e.set("jo",o.anim.juliaOrbit?"1":"0"),e.set("os",L(o.anim.orbitSpeed)),e.set("lo",o.anim.lightOrbit?"1":"0"),e.toString()},k=(o,e,t)=>{const n=o.get(e);if(n==null)return t;const r=Number(n);return Number.isFinite(r)?r:t},St=o=>{const e=o.startsWith("#")?o.slice(1):o;if(!e)return null;const t=new URLSearchParams(e);if(![...t.keys()].length)return null;const n=ue(),r=t.get("k");r&&wt.has(r)&&(n.kind=r),n.camera.centerX=k(t,"cx",n.camera.centerX),n.camera.centerY=k(t,"cy",n.camera.centerY),n.camera.zoomLevel=R(k(t,"z",n.camera.zoomLevel),-3,40),n.camera.rotation=k(t,"rot",0),n.escape.maxIter=R(Math.round(k(t,"it",n.escape.maxIter)),16,4e3),n.escape.power=k(t,"pw",n.escape.power),n.escape.juliaC=[k(t,"jx",n.escape.juliaC[0]),k(t,"jy",n.escape.juliaC[1])],n.escape.bailout=Math.max(4,k(t,"bl",n.escape.bailout));const i=t.get("pal");i&&Q[i]&&(n.coloring.paletteId=i),n.coloring.cycles=R(k(t,"cyc",n.coloring.cycles),.1,32);const a=t.get("rm");a&&xt.has(a)&&(n.coloring.remap=a),n.coloring.phase=k(t,"ph",n.coloring.phase),n.coloring.shade=R(k(t,"sh",n.coloring.shade),0,1),n.coloring.glow=R(k(t,"gl",n.coloring.glow),0,4),n.coloring.bloom=R(k(t,"bm",n.coloring.bloom),0,1);const c=t.get("tr");return c&&Et.has(c)&&(n.coloring.trap=c),n.anim.cycleSpeed=R(k(t,"cs",n.anim.cycleSpeed),0,2),n.anim.juliaOrbit=t.get("jo")==="1",n.anim.orbitSpeed=R(k(t,"os",n.anim.orbitSpeed),0,2),n.anim.lightOrbit=t.get("lo")!=="0",n},Ee=()=>{try{return St(window.location.hash)}catch{return null}},Pt=(o=220)=>{let e=0;return t=>{clearTimeout(e),e=window.setTimeout(()=>{const n="#"+te(t);history.replaceState(null,"",n)},o)}},B=(o,e=1800)=>{const t=document.getElementById("toast-root");if(!t)return;const n=document.createElement("div");n.className="toast",n.textContent=o,t.appendChild(n),window.setTimeout(()=>{n.classList.add("out"),window.setTimeout(()=>n.remove(),300)},e)},Ft={mandelbrot:"The map of every Julia set — z → z² + c.",julia:"A fixed c; the plane of starting points.",multibrot:"z → zⁿ + c — more lobes with higher power.",koch:"Infinite length, finite area (≈1.26 dimensions).",snowflake:"Three Koch curves closed into a flake.",sierpinski:"An arrowhead curve filling the gasket.",dragon:"The Heighway dragon — paper folded forever.",hilbert:"A space-filling curve visiting every cell.",plant:"Lindenmayer's branching botany.",fern:"Barnsley's four-map chaos game.","sierpinski-ifs":"The gasket drawn by random points."},se=o=>{const t=[];for(let n=0;n<16;n++){const r=n/15,i=qe(o,r).map(a=>Math.round(R(yt(a),0,1)*255));t.push(`rgb(${i[0]},${i[1]},${i[2]}) ${r*100|0}%`)}return`linear-gradient(90deg, ${t.join(",")})`},Tt=(o,e)=>{const t=document.getElementById("panel");let n=0;const r=(s,v=!0)=>{n++;const g=document.createElement("details");g.className="panel-section",g.open=v;const S=document.createElement("summary");return S.innerHTML=`<span class="sec-no">${String(n).padStart(2,"0")}</span><span class="sec-title">${s}</span>`,g.appendChild(S),t.appendChild(g),g},i=(s,v,g,S,F,p,m,E,d=P=>P.toFixed(2))=>{const P=document.createElement("div");P.className="row";const y=document.createElement("label");y.textContent=v;const w=document.createElement("input");w.type="range",w.min=String(F),w.max=String(p),w.step=String(m),w.value=String(g());const A=document.createElement("span");A.className="val",A.textContent=d(g());const M=document.createElement("div");M.className="slider-wrap";const h=document.createElement("span");h.className="bubble",h.textContent=d(g());const x=I=>{const C=p>F?(I-F)/(p-F)*100:0;w.style.setProperty("--fill",`${C}%`),h.style.left=`calc(${C}% + ${(50-C)*.13}px)`};x(g()),w.addEventListener("input",()=>{const I=Number(w.value);S(I),A.textContent=d(I),h.textContent=d(I),x(I),E&&o.markFieldDirty(),e()}),M.append(w,h),P.append(y,M,A),s.appendChild(P)},a=(s,v,g,S,F,p)=>{const m=document.createElement("div");m.className="row";const E=document.createElement("label");E.textContent=v;const d=document.createElement("div");d.className="segmented";const P=()=>d.querySelectorAll("button").forEach(y=>y.classList.toggle("active",y.dataset.value===S()));for(const y of g){const w=document.createElement("button");w.type="button",w.textContent=y.label,w.dataset.value=y.value,w.addEventListener("click",()=>{F(y.value),P(),e()}),d.appendChild(w)}P(),m.append(E,d),s.appendChild(m)},c=(s,v,g,S,F,p)=>{const m=document.createElement("div");m.className="row wide";const E=document.createElement("label");E.textContent=v;const d=document.createElement("select");for(const P of g){const y=document.createElement("option");y.value=P.value,y.textContent=P.label,d.appendChild(y)}d.value=S(),d.addEventListener("change",()=>{F(d.value),o.markFieldDirty(),e()}),m.append(E,d),s.appendChild(m)},l=(s,v,g,S)=>{const F=document.createElement("div");F.className="checkbox-row";const p=document.createElement("input");p.type="checkbox",p.checked=g();const m=document.createElement("label");m.textContent=v,p.addEventListener("change",()=>{S(p.checked),e()}),F.append(p,m),s.appendChild(F)},b=(s,v,g)=>{const S=document.createElement("button");S.className="btn",S.type="button",S.textContent=v,S.addEventListener("click",g),s.appendChild(S)},f=()=>{const s=o.scene,v=Z(s.kind);t.innerHTML="",n=0;const g=document.createElement("div");g.className="panel-context",g.innerHTML=`<span class="ctx-name">${J[s.kind].name}</span><span class="ctx-desc">${Ft[s.kind]}</span>`,t.appendChild(g);const S=r("Fractal"),F=["Escape-time","L-system","IFS"],p=document.createElement("div");p.className="row wide";const m=document.createElement("select");for(const h of F){const x=document.createElement("optgroup");x.label=h;for(const I of pe.filter(C=>C.group===h)){const C=document.createElement("option");C.value=I.kind,C.textContent=I.name,x.appendChild(C)}m.appendChild(x)}m.value=s.kind,m.addEventListener("change",()=>{o.setKind(m.value),e(),f()}),p.appendChild(m),S.appendChild(p);const E=r("Palette"),d=document.createElement("div");d.className="palette-strip";const P=s.coloring.custom??Q[s.coloring.paletteId]?.palette??G[0].palette;d.style.background=se(P),E.appendChild(d);const y=document.createElement("div");y.className="swatches";for(const h of G){const x=document.createElement("button");x.className="swatch"+(h.id===s.coloring.paletteId&&!s.coloring.custom?" active":""),x.style.background=se(h.palette),x.title=h.name,x.addEventListener("click",()=>{s.coloring.paletteId=h.id,s.coloring.custom=null,e(),f()}),y.appendChild(x)}if(E.appendChild(y),i(E,"Cycles",()=>s.coloring.cycles,h=>s.coloring.cycles=h,.25,16,.25,!1),a(E,"Density",[{value:"sqrt",label:"√"},{value:"log",label:"log"},{value:"linear",label:"lin"}],()=>s.coloring.remap,h=>s.coloring.remap=h),i(E,"Phase",()=>s.coloring.phase,h=>s.coloring.phase=h,0,1,.001,!1,h=>h.toFixed(3)),v==="escape"&&(i(E,"Shade",()=>s.coloring.shade,h=>s.coloring.shade=h,0,1,.01,!1),i(E,"Glow",()=>s.coloring.glow,h=>s.coloring.glow=h,0,4,.05,!1),i(E,"Filmic",()=>s.coloring.bloom,h=>s.coloring.bloom=h,0,1,.01,!1),c(E,"Orbit trap",[{value:"none",label:"None"},{value:"stalk",label:"Pickover stalk"},{value:"point",label:"Point"},{value:"circle",label:"Circle"}],()=>s.coloring.trap,h=>s.coloring.trap=h)),v==="escape"){const h=r("Parameters");i(h,"Iterations",()=>s.escape.maxIter,x=>s.escape.maxIter=Math.round(x),32,2e3,1,!0,x=>String(Math.round(x))),i(h,"Bailout",()=>s.escape.bailout,x=>s.escape.bailout=x,4,1024,4,!0,x=>String(Math.round(x))),s.kind==="multibrot"&&i(h,"Power",()=>s.escape.power,x=>s.escape.power=x,2,8,.01,!0),s.kind==="julia"&&(i(h,"Julia cₓ",()=>s.escape.juliaC[0],x=>s.escape.juliaC[0]=x,-1,1,.001,!0,x=>x.toFixed(3)),i(h,"Julia cᵧ",()=>s.escape.juliaC[1],x=>s.escape.juliaC[1]=x,-1,1,.001,!0,x=>x.toFixed(3)))}if(v==="lines"&&K[s.kind]){const h=r("Geometry"),x=K[s.kind],I=o.lineDepth(s.kind)??x.depth;i(h,"Depth",()=>I,C=>o.setLineDepth(s.kind,Math.round(C)),1,He(s.kind),1,!1,C=>String(Math.round(C)))}const w=r("Animation");i(w,"Cycle speed",()=>s.anim.cycleSpeed,h=>s.anim.cycleSpeed=h,0,1,.01,!1),i(w,"Motion",()=>s.anim.motionScale,h=>s.anim.motionScale=h,0,1,.01,!1),v==="escape"&&l(w,"Animate light",()=>s.anim.lightOrbit,h=>s.anim.lightOrbit=h),s.kind==="julia"&&(l(w,"Julia c-orbit",()=>s.anim.juliaOrbit,h=>s.anim.juliaOrbit=h),i(w,"Orbit speed",()=>s.anim.orbitSpeed,h=>s.anim.orbitSpeed=h,0,1,.01,!1));const A=r("View",!1),M=document.createElement("div");M.className="btn-row",b(M,"Reset",()=>{o.resetView(),e()}),b(M,"Copy link",()=>{const h=location.origin+location.pathname+"#"+te(o.scene);navigator.clipboard?navigator.clipboard.writeText(h).then(()=>B("Link copied")).catch(()=>B("Copy failed")):B("Copy not supported")}),A.appendChild(M)};return f(),{rebuild:f}},X=o=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${o}</svg>`,kt=(()=>{const o=[];for(let i=0;i<=130;i++){const a=i/130*3.4*2*Math.PI,c=.6*Math.exp(.13*a);o.push(`${(12+c*Math.cos(a)).toFixed(2)},${(12+c*Math.sin(a)).toFixed(2)}`)}return o.join(" ")})(),Lt=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="${kt}"/></svg>`,D={play:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.2v13.6L19 12 8 5.2z"/></svg>',pause:'<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6.5" y="5" width="3.6" height="14" rx="1.1"/><rect x="13.9" y="5" width="3.6" height="14" rx="1.1"/></svg>',info:X('<circle cx="12" cy="12" r="9"/><line x1="12" y1="11" x2="12" y2="16.5"/><circle cx="12" cy="7.6" r="0.9" fill="currentColor" stroke="none"/>'),save:X('<path d="M12 3.5v10.5"/><path d="M8 10.5l4 4 4-4"/><path d="M5 19.5h14"/>'),share:X('<circle cx="6.5" cy="12" r="2.3"/><circle cx="17.5" cy="6" r="2.3"/><circle cx="17.5" cy="18" r="2.3"/><line x1="8.5" y1="10.9" x2="15.5" y2="7"/><line x1="8.5" y1="13.1" x2="15.5" y2="17"/>'),fullscreen:X('<path d="M4 9V4.5h5"/><path d="M20 9V4.5h-5"/><path d="M4 15v4.5h5"/><path d="M20 15v4.5h-5"/>')},Ct=o=>{const e=document.getElementById("topbar-actions"),t=(r,i,a,c)=>{const l=document.createElement("button");return l.className="icon-btn",l.type="button",l.innerHTML=r,l.setAttribute("aria-label",i),l.title=a,l.addEventListener("click",c),e.appendChild(l),l},n=t(D.play,"Toggle tour","Tour (Space)",o.onTour);return t(D.info,"About fractals","About (?)",o.onAbout),t(D.save,"Save image","Save PNG (S)",o.onSave),typeof navigator<"u"&&"share"in navigator&&t(D.share,"Share","Share image",o.onShare),t(D.fullscreen,"Fullscreen","Fullscreen (F)",o.onFullscreen),{setTourActive(r){n.classList.toggle("active",r),n.innerHTML=r?D.pause:D.play,n.setAttribute("aria-pressed",String(r))}}};let W=!1,ce=null;const At=`
  <button class="modal-close" type="button" aria-label="Close">×</button>
  <h1>What is a <em>fractal?</em></h1>
  <p class="lede">Shapes that repeat their structure across scales. Zoom into a coastline, a fern,
  or the boundary of the Mandelbrot set and you keep finding detail — often echoes of the whole —
  no matter how far in you go. This explorer is built to let you feel that directly.</p>

  <h2>A short history</h2>
  <p>In the 1870s–1920s mathematicians kept meeting "monsters": <strong>Weierstrass'</strong>
  curve (1872) that is continuous everywhere yet smooth nowhere, <strong>Cantor's</strong> dust
  (1883), the <strong>Koch</strong> curve (1904) of infinite length around finite area, and
  <strong>Sierpiński's</strong> holey triangle (1915). <strong>Hausdorff</strong> (1918) gave them
  a language — a dimension that need not be a whole number — and <strong>Julia</strong> and
  <strong>Fatou</strong> (1917–19) studied what happens when you iterate <em>z → z² + c</em>,
  though they couldn't yet picture it.</p>
  <p>Working at IBM, <strong>Benoît Mandelbrot</strong> saw these scattered curiosities as one
  idea with vast reach. He asked <em>"How Long Is the Coast of Britain?"</em> (1967), coined the
  word <strong>fractal</strong> in 1975 (from Latin <em>fractus</em>, "broken"), and published
  <em>The Fractal Geometry of Nature</em> (1982). The emblem of the field — the
  <strong>Mandelbrot set</strong> — was first plotted around 1978–80, then proved connected and
  named by <strong>Douady</strong> and <strong>Hubbard</strong>.</p>

  <h2>Why they matter</h2>
  <p>Euclid's geometry describes smooth, ideal shapes; almost nothing in nature is smooth.
  Fractal dimension quantifies roughness — coastlines, mountains, lungs, lightning. Fractals
  are the <strong>shape of chaos</strong> (the boundaries of dynamical systems), the basis of
  <strong>image compression</strong> (Barnsley's IFS), of procedural <strong>plants and
  terrain</strong> in graphics (Lindenmayer's L-systems), of <strong>fractal antennas</strong>,
  and of models of <strong>rough markets</strong>. Simple recursive rules, iterated to the limit,
  generate unbounded complexity — and that is often exactly what reality looks like.</p>

  <h2>In this explorer</h2>
  <div class="fractal-list">
    <div><b>Mandelbrot / Julia</b><span>Iterate <em>z → z² + c</em>; color by how fast each point escapes. The Mandelbrot set is the map of every Julia set at once.</span></div>
    <div><b>Multibrot</b><span>The same idea with a higher power <em>zⁿ + c</em> — more lobes.</span></div>
    <div><b>Koch · Sierpiński · dragon · Hilbert · plant</b><span>L-systems: a string-rewriting rule drawn by a "turtle", producing curves of fractional dimension.</span></div>
    <div><b>Barnsley fern</b><span>An Iterated Function System — four random affine maps whose visit-density traces the fern.</span></div>
  </div>

  <h2>Controls</h2>
  <div class="keys-help">
    <div><kbd>drag</kbd> pan</div>
    <div><kbd>scroll</kbd> / <kbd>pinch</kbd> zoom</div>
    <div><kbd>Space</kbd> play / pause tour</div>
    <div><kbd>F</kbd> fullscreen</div>
    <div><kbd>R</kbd> reset view</div>
    <div><kbd>C</kbd> copy deep-link</div>
    <div><kbd>S</kbd> save PNG</div>
    <div><kbd>Tab</kbd> hide controls</div>
    <div><kbd>?</kbd> this panel</div>
  </div>

  <p class="credit">Built with TypeScript + WebGL2. Smooth coloring via the continuous (Douady–Hubbard)
  iteration count through Inigo Quilez cosine palettes. Full history & references in
  <em>docs/fractals.md</em>.</p>
`,Mt=o=>Array.from(o.querySelectorAll('a[href], button, [tabindex]:not([tabindex="-1"])')),le=()=>{if(W)return;W=!0,ce=document.activeElement;const o=document.getElementById("about-root"),e=document.createElement("div");e.className="modal-scrim";const t=document.createElement("div");t.className="modal",t.setAttribute("role","dialog"),t.setAttribute("aria-modal","true"),t.setAttribute("aria-label","About fractals"),t.innerHTML=At,e.appendChild(t),o.appendChild(e);const n=()=>{W=!1,e.remove(),document.removeEventListener("keydown",r,!0),ce?.focus?.()},r=a=>{if(a.key==="Escape"){a.preventDefault(),n();return}if(a.key==="Tab"){const c=Mt(t);if(c.length===0)return;const l=c[0],b=c[c.length-1],f=document.activeElement;a.shiftKey&&f===l?(a.preventDefault(),b.focus()):!a.shiftKey&&f===b&&(a.preventDefault(),l.focus())}};document.addEventListener("keydown",r,!0),e.addEventListener("mousedown",a=>{a.target===e&&n()});const i=t.querySelector(".modal-close");i?.addEventListener("click",n),i?.focus()},Se="fe.hint.seen.v1",Rt=()=>{try{return localStorage.getItem(Se)==="1"}catch{return!1}},It=()=>{try{localStorage.setItem(Se,"1")}catch{}},zt=o=>{const e=document.getElementById("hint"),n=window.matchMedia("(pointer: coarse)").matches?"Drag to pan · pinch to zoom":'Drag to pan · scroll to zoom · <span class="keys">Tab</span> hides controls';e.innerHTML=`
    <span>${n}</span>
    <button class="hint-tour" type="button">Take the tour →</button>
    <button class="hint-x" type="button" aria-label="Dismiss hint">×</button>`;const r=()=>{e.classList.remove("show"),It()};return e.querySelector(".hint-tour")?.addEventListener("click",()=>{o(),r()}),e.querySelector(".hint-x")?.addEventListener("click",r),{maybeShow:()=>{Rt()||(e.classList.add("show"),window.setTimeout(()=>{e.classList.contains("show")&&r()},13e3))},dismiss:r}},Dt=o=>{const e=t=>{const n=t.target;if(!(n&&(n.tagName==="INPUT"||n.tagName==="SELECT"||n.isContentEditable))&&!(t.metaKey||t.ctrlKey||t.altKey))switch(t.key){case" ":t.preventDefault(),o.tour();break;case"f":case"F":o.fullscreen();break;case"?":case"i":case"I":o.about();break;case"r":case"R":o.reset();break;case"c":case"C":o.copy();break;case"s":case"S":o.save();break}};return window.addEventListener("keydown",e),()=>window.removeEventListener("keydown",e)},Bt=(o,e,t="fractal-explorer.png")=>{e(),o.toBlob(n=>{if(!n)return;const r=URL.createObjectURL(n),i=document.createElement("a");i.href=r,i.download=t,document.body.appendChild(i),i.click(),i.remove(),window.setTimeout(()=>URL.revokeObjectURL(r),2e3)},"image/png")},_t=async(o,e)=>{e();const t=await new Promise(i=>o.toBlob(i,"image/png"));if(!t)return!1;const n=new File([t],"fractal-explorer.png",{type:"image/png"}),r=navigator;if(r.canShare?.({files:[n]})&&r.share)try{return await r.share({files:[n],title:"Fractal Explorer"}),!0}catch{return!1}return!1},N=document.getElementById("view"),de=document.getElementById("hud"),j=document.getElementById("panel"),q=document.getElementById("panel-toggle");document.querySelector(".brand")?.insertAdjacentHTML("afterbegin",`<span class="brand-logo" aria-hidden="true">${Lt}</span>`);const Pe=Ee(),Nt=Pe!==null,T=new pt(N,Pe??ue());if(!T.ok)j.innerHTML='<h1 style="font-family:var(--font-display);font-size:28px;margin:8px 0">Fractal Explorer</h1><p style="color:var(--ink-dim)">WebGL2 is unavailable in this browser, so the renderer could not start. Try a recent Chrome, Edge, Firefox, or Safari.</p>',de.style.display="none";else{const o=window.matchMedia("(prefers-reduced-motion: reduce)"),e=()=>{o.matches&&(T.scene.anim.motionScale=0,T.scene.anim.juliaOrbit=!1)};e(),o.addEventListener("change",e);const t=Pt(),n=()=>t(T.scene),r=()=>T.render(),i=()=>{const d=location.origin+location.pathname+"#"+te(T.scene);navigator.clipboard?navigator.clipboard.writeText(d).then(()=>B("Link copied")).catch(()=>B("Copy failed")):B("Copy not supported")},a=()=>{Bt(N,r),B("Image saved")},c=()=>{_t(N,r).then(d=>{d||a()})},l=()=>{document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen()},b=Tt(T,n);let f;const s=()=>{T.tourActive?T.stopTour():(T.startTour(),b.rebuild()),f.setTourActive(T.tourActive)};f=Ct({onTour:s,onAbout:le,onSave:a,onShare:c,onFullscreen:l}),vt(N,T,n);const v=zt(()=>{T.startTour(),b.rebuild(),f.setTourActive(!0)});Dt({tour:s,about:le,fullscreen:l,reset:()=>{T.resetView(),n()},copy:i,save:a});const g=()=>{const d=N.clientWidth||window.innerWidth,P=N.clientHeight||window.innerHeight;T.resize(d,P,window.devicePixelRatio||1)};let S=null;const F=()=>{g(),p()},p=()=>{S?.removeEventListener("change",F),S=window.matchMedia(`(resolution: ${window.devicePixelRatio||1}dppx)`),S.addEventListener("change",F)};window.addEventListener("resize",g),p(),g(),window.addEventListener("hashchange",()=>{const d=Ee();d&&(T.adoptScene(d),b.rebuild(),f.setTourActive(!1))});const m=d=>{j.classList.toggle("hidden",d),q.classList.toggle("show",d),q.setAttribute("aria-label",d?"Show controls":"Hide controls")};q.addEventListener("click",()=>m(!j.classList.contains("hidden"))),window.addEventListener("keydown",d=>{d.key==="Tab"&&!(d.target instanceof HTMLInputElement)&&!(d.target instanceof HTMLSelectElement)&&(d.preventDefault(),m(!j.classList.contains("hidden")))});const E=()=>{const[d,P]=T.backingSize,y=T.magnification,w=y>=1e4?y.toExponential(1):y.toFixed(y<10?2:0),A=T.precisionWarn?'   <span class="warn">⚠ precision limit</span>':"";de.innerHTML=`${T.fps.toFixed(0)} fps   ×${w}   ${d}×${P}${A}`,f.setTourActive(T.tourActive)};window.setInterval(E,200),!Nt&&!o.matches&&(T.startTour(),f.setTourActive(!0)),v.maybeShow(),new gt(T).start()}
//# sourceMappingURL=index-DbuepPsr.js.map
