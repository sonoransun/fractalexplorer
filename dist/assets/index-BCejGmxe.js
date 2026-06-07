var Re=Object.defineProperty;var Ie=(t,e,o)=>e in t?Re(t,e,{enumerable:!0,configurable:!0,writable:!0,value:o}):t[e]=o;var d=(t,e,o)=>Ie(t,typeof e!="symbol"?e+"":e,o);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const a of r)if(a.type==="childList")for(const i of a.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&n(i)}).observe(document,{childList:!0,subtree:!0});function o(r){const a={};return r.integrity&&(a.integrity=r.integrity),r.referrerPolicy&&(a.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?a.credentials="include":r.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(r){if(r.ep)return;r.ep=!0;const a=o(r);fetch(r.href,a)}})();const Be=2.8,J=()=>({kind:"mandelbrot",camera:{centerX:-.6,centerY:0,zoomLevel:0,rotation:0},escape:{maxIter:256,power:2,juliaC:[-.8,.156],bailout:256},coloring:{paletteId:"ember",custom:null,cycles:3,remap:"sqrt",phase:0,shade:.35,glow:0,bloom:.06,trap:"none",interior:[0,0,0]},anim:{cycleSpeed:.08,motionScale:1,juliaOrbit:!1,orbitSpeed:.15,lightOrbit:!0},quality:{renderScale:1,dprCap:2}}),De=t=>({kind:t.kind,camera:{...t.camera},escape:{...t.escape,juliaC:[...t.escape.juliaC]},coloring:{...t.coloring,custom:t.coloring.custom?{...t.coloring.custom}:null,interior:[...t.coloring.interior]},anim:{...t.anim},quality:{...t.quality}}),Fe=Math.PI*2,L=(t,e,o)=>t<e?e:t>o?o:t,M=t=>Number.isFinite(t)?Number.isInteger(t)&&Math.abs(t)<1e6?String(t):t.toExponential(12):"0";class _e{constructor(){d(this,"paletteShift",0);d(this,"t",0)}advance(e,o){const n=o.anim.motionScale;this.t+=e*n,this.paletteShift+=e*n*o.anim.cycleSpeed}juliaC(e){if(!e.anim.juliaOrbit)return e.escape.juliaC;const o=this.t*e.anim.orbitSpeed;return[-.5+.55*Math.sin(.7*o+Math.PI/2),0+.18*Math.sin(1.3*o)]}lightDir(e){if(!e.anim.lightOrbit)return[.7071,.7071];const o=this.t*.5*Fe*.08;return[Math.cos(o),Math.sin(o)]}reset(){this.paletteShift=0,this.t=0}}const fe=t=>{const e=L(t,0,1);return e*e*e*(e*(6*e-15)+10)},Ne=[{center:[-.743643887037151,.13182590420533],zoom:11,dwell:2.6},{center:[.2925755,.0149977],zoom:10,dwell:2.6},{center:[-.722,.2467],zoom:9.5,dwell:2.6},{center:[-1.2568,.3801],zoom:10.5,dwell:2.6},{center:[-.16070135,1.0375665],zoom:9,dwell:2.6}],je={cx:-.6,cy:0,zoom:-.4,hold:.9},Oe=1.6,$e=1.2,Ve=Ne.flatMap(t=>[{...je},{cx:t.center[0],cy:t.center[1],zoom:t.zoom,hold:t.dwell}]),Xe=(t,e,o)=>{const n=fe(o),r=fe(Math.min(1,o/.7));return{cx:t.cx+(e.cx-t.cx)*r,cy:t.cy+(e.cy-t.cy)*r,zoom:t.zoom+(e.zoom-t.zoom)*n}},Ue=(t,e)=>Math.max($e,Math.abs(e.zoom-t.zoom)/Oe);class He{constructor(){d(this,"active",!1);d(this,"kf",Ve);d(this,"i",0);d(this,"t",0)}start(e){this.active=!0,this.i=0,this.t=0,this.apply(e,this.kf[0])}stop(){this.active=!1}apply(e,o){e.centerX=o.cx,e.centerY=o.cy,e.zoomLevel=o.zoom,e.rotation=0}update(e,o){if(!this.active)return;const n=this.kf.length,r=this.kf[this.i],a=this.kf[(this.i+1)%n],i=Ue(r,a),c=i+a.hold;if(this.t+=e,this.t>=c){this.t-=c,this.i=(this.i+1)%n,this.apply(o,a);return}const l=Math.min(1,this.t/i),b=Xe(r,a,l);o.centerX=b.cx,o.centerY=b.cy,o.zoomLevel=b.zoom,o.rotation=0}}const $=t=>Be/Math.pow(2,t.zoomLevel),Se=(t,e)=>$(t)/Math.max(1,e),ke=(t,e,o,n,r)=>{const a=Se(t,r),i=(e-n/2)*a,c=-(o-r/2)*a,l=Math.cos(t.rotation),b=Math.sin(t.rotation);return[i*l-c*b,i*b+c*l]},Ge=(t,e,o,n,r)=>{const[a,i]=ke(t,e,o,n,r);return[t.centerX+a,t.centerY+i]},ee=(t,e,o,n,r,a)=>{const i=Ge(t,e,o,n,r);t.zoomLevel+=a;const[c,l]=ke(t,e,o,n,r);return t.centerX=i[0]-c,t.centerY=i[1]-l,t},Ye=(t,e,o,n)=>{const r=Se(t,n),a=Math.cos(t.rotation),i=Math.sin(t.rotation),c=-e*r,l=o*r;return t.centerX+=c*a-l*i,t.centerY+=c*i+l*a,t},le=[{kind:"mandelbrot",name:"Mandelbrot",mode:"escape",group:"Escape-time"},{kind:"julia",name:"Julia",mode:"escape",group:"Escape-time"},{kind:"multibrot",name:"Multibrot",mode:"escape",group:"Escape-time"},{kind:"koch",name:"Koch curve",mode:"lines",group:"L-system"},{kind:"snowflake",name:"Koch snowflake",mode:"lines",group:"L-system"},{kind:"sierpinski",name:"Sierpinski arrowhead",mode:"lines",group:"L-system"},{kind:"dragon",name:"Dragon curve",mode:"lines",group:"L-system"},{kind:"hilbert",name:"Hilbert curve",mode:"lines",group:"L-system"},{kind:"plant",name:"Fractal plant",mode:"lines",group:"L-system"},{kind:"fern",name:"Barnsley fern",mode:"points",group:"IFS"},{kind:"sierpinski-ifs",name:"Sierpinski (points)",mode:"points",group:"IFS"}],ue=Object.fromEntries(le.map(t=>[t.kind,t])),de=t=>ue[t].mode,qe=t=>{let e=t.axiom;for(let o=0;o<t.depth;o++){const n=[];for(const r of e)n.push(t.rules[r]??r);e=n.join("")}return e},We=(t,e)=>{const o=e.angleDeg*Math.PI/180,n=new Set(e.draw),r=[];let a=0,i=0,c=Math.PI/2;const l=[],b=1;for(const p of t)if(n.has(p)){const s=a+b*Math.cos(c),y=i+b*Math.sin(c);r.push({a:[a,i],b:[s,y]}),a=s,i=y}else if(p==="+")c+=o;else if(p==="-")c-=o;else if(p==="[")l.push({x:a,y:i,h:c});else if(p==="]"){const s=l.pop();s&&(a=s.x,i=s.y,c=s.h)}return r},Ke=t=>{let e=1/0,o=1/0,n=-1/0,r=-1/0;for(const p of t)for(const s of[p.a,p.b])s[0]<e&&(e=s[0]),s[1]<o&&(o=s[1]),s[0]>n&&(n=s[0]),s[1]>r&&(r=s[1]);const a=(e+n)/2,i=(o+r)/2,l=2.6/(Math.max(n-e,r-o)||1),b=p=>[(p[0]-a)*l,(p[1]-i)*l];return t.map(p=>({a:b(p.a),b:b(p.b)}))},Je=t=>{const e=[];let o=0;for(const c of t){const l=Math.hypot(c.b[0]-c.a[0],c.b[1]-c.a[1]);e.push(l),o+=l}o=o||1;const n=new Float32Array(t.length*6*5);let r=0,a=0;const i=(c,l,b)=>{n[r++]=c[0],n[r++]=c[1],n[r++]=l[0],n[r++]=l[1],n[r++]=b};for(let c=0;c<t.length;c++){const l=t[c],b=a/o;a+=e[c];const p=a/o,s=l.b[0]-l.a[0],y=l.b[1]-l.a[1],g=Math.hypot(s,y)||1,E=-y/g,P=s/g,u=[E,P],h=[-E,-P];i(l.a,u,b),i(l.a,h,b),i(l.b,u,p),i(l.b,u,p),i(l.a,h,b),i(l.b,h,p)}return{data:n,vertexCount:t.length*6,segmentCount:t.length}},ne={koch:{axiom:"F",rules:{F:"F+F--F+F"},angleDeg:60,draw:"F",depth:4},snowflake:{axiom:"F--F--F",rules:{F:"F+F--F+F"},angleDeg:60,draw:"F",depth:4},sierpinski:{axiom:"A",rules:{A:"B-A-B",B:"A+B+A"},angleDeg:60,draw:"AB",depth:6},dragon:{axiom:"FX",rules:{X:"X+YF+",Y:"-FX-Y"},angleDeg:90,draw:"F",depth:11},hilbert:{axiom:"A",rules:{A:"+BF-AFA-FB+",B:"-AF+BFB+FA-"},angleDeg:90,draw:"F",depth:5},plant:{axiom:"X",rules:{X:"F+[[X]-X]-F[-FX]+X",F:"FF"},angleDeg:25,draw:"F",depth:5}},pe=new Map,Ze=(t,e)=>{const o=ne[t];if(!o)throw new Error(`No L-system for kind: ${t}`);const n=e!=null?{...o,depth:e}:o,r=`${t}:${n.depth}`,a=pe.get(r);if(a)return a;const i=Je(Ke(We(qe(n),n)));return pe.set(r,i),i},Qe=t=>{switch(t){case"koch":case"snowflake":return 6;case"sierpinski":return 8;case"dragon":return 16;case"hilbert":return 7;case"plant":return 7;default:return 6}},et=Math.sqrt(3)/4,tt={fern:{maps:[{a:0,b:0,c:0,d:.16,e:0,f:0,p:.01},{a:.85,b:.04,c:-.04,d:.85,e:0,f:1.6,p:.85},{a:.2,b:-.26,c:.23,d:.22,e:0,f:1.6,p:.07},{a:-.15,b:.28,c:.26,d:.24,e:0,f:.44,p:.07}]},"sierpinski-ifs":{maps:[{a:.5,b:0,c:0,d:.5,e:0,f:0,p:1},{a:.5,b:0,c:0,d:.5,e:.5,f:0,p:1},{a:.5,b:0,c:0,d:.5,e:.25,f:et,p:1}]}},ot=(t,e,o=25)=>{const n=t.maps,r=[];let a=0;for(const f of n)a+=f.p,r.push(a);const i=new Float32Array(e*3);let c=0,l=0,b=0,p=1/0,s=1/0,y=-1/0,g=-1/0;const E=n.length>1?n.length-1:1;for(let f=0;f<e+o;f++){const F=Math.random()*a;let S=0;for(;S<r.length-1&&F>r[S];)S++;const x=n[S],R=x.a*c+x.b*l+x.e,C=x.c*c+x.d*l+x.f;c=R,l=C,f>=o&&(i[b++]=c,i[b++]=l,i[b++]=S/E,c<p&&(p=c),l<s&&(s=l),c>y&&(y=c),l>g&&(g=l))}const P=(p+y)/2,u=(s+g)/2,v=2.4/(Math.max(y-p,g-s)||1);for(let f=0;f<e;f++)i[f*3]=(i[f*3]-P)*v,i[f*3+1]=(i[f*3+1]-u)*v;return{data:i,count:e}},nt=(t,e)=>{const o=[0,0,0];for(let n=0;n<3;n++)o[n]=t.a[n]+t.b[n]*Math.cos(Fe*(t.c[n]*e+t.d[n]));return o},W=[{id:"rainbow",name:"Rainbow",palette:{a:[.5,.5,.5],b:[.5,.5,.5],c:[1,1,1],d:[0,.33,.67]}},{id:"ember",name:"Ember",palette:{a:[.5,.5,.5],b:[.5,.5,.5],c:[1,1,1],d:[0,.1,.2]}},{id:"ice",name:"Ice",palette:{a:[.5,.5,.5],b:[.5,.5,.5],c:[1,1,.5],d:[.8,.9,.3]}},{id:"gold",name:"Gold",palette:{a:[.5,.5,.5],b:[.5,.5,.5],c:[1,.7,.4],d:[0,.15,.2]}},{id:"candy",name:"Candy",palette:{a:[.5,.5,.5],b:[.5,.5,.5],c:[2,1,0],d:[.5,.2,.25]}},{id:"aurora",name:"Aurora",palette:{a:[.5,.5,.5],b:[.5,.5,.5],c:[1,1,1],d:[.3,.2,.2]}},{id:"magma",name:"Magma",palette:{a:[.8,.5,.4],b:[.2,.4,.2],c:[2,1,1],d:[0,.25,.25]}},{id:"twilight",name:"Twilight",palette:{a:[.5,.5,.55],b:[.45,.4,.5],c:[1,1,2],d:[.6,.55,.35]}}],me=Object.fromEntries(W.map(t=>[t.id,t])),rt=()=>W[1],ge=(t,e,o)=>{const n=t.createShader(e);if(!n)throw new Error("createShader failed");if(t.shaderSource(n,o),t.compileShader(n),!t.getShaderParameter(n,t.COMPILE_STATUS)){const r=t.getShaderInfoLog(n)??"unknown";throw t.deleteShader(n),new Error(`Shader compile error:
${r}
--- source ---
${at(o)}`)}return n},at=t=>t.split(`
`).map((e,o)=>`${String(o+1).padStart(3," ")}  ${e}`).join(`
`);class j{constructor(e,o,n){d(this,"program");d(this,"locs",new Map);d(this,"attrs",new Map);this.gl=e;const r=ge(e,e.VERTEX_SHADER,o),a=ge(e,e.FRAGMENT_SHADER,n),i=e.createProgram();if(!i)throw new Error("createProgram failed");if(e.attachShader(i,r),e.attachShader(i,a),e.linkProgram(i),e.deleteShader(r),e.deleteShader(a),!e.getProgramParameter(i,e.LINK_STATUS)){const c=e.getProgramInfoLog(i)??"unknown";throw e.deleteProgram(i),new Error(`Program link error:
${c}`)}this.program=i}use(){this.gl.useProgram(this.program)}loc(e){return this.locs.has(e)||this.locs.set(e,this.gl.getUniformLocation(this.program,e)),this.locs.get(e)??null}attrib(e){return this.attrs.has(e)||this.attrs.set(e,this.gl.getAttribLocation(this.program,e)),this.attrs.get(e)}int(e,o){this.gl.uniform1i(this.loc(e),o)}float(e,o){this.gl.uniform1f(this.loc(e),o)}vec2(e,o,n){this.gl.uniform2f(this.loc(e),o,n)}vec3(e,o,n,r){this.gl.uniform3f(this.loc(e),o,n,r)}dispose(){this.gl.deleteProgram(this.program)}}const it=t=>!!t.getExtension("EXT_color_buffer_float"),be=(t,e,o,n=t.RGBA16F)=>{const r=t.createTexture(),a=t.createFramebuffer();if(!r||!a)throw new Error("createTarget allocation failed");return t.bindTexture(t.TEXTURE_2D,r),t.texStorage2D(t.TEXTURE_2D,1,n,e,o),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.bindFramebuffer(t.FRAMEBUFFER,a),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,r,0),t.bindFramebuffer(t.FRAMEBUFFER,null),t.bindTexture(t.TEXTURE_2D,null),{tex:r,fbo:a,width:e,height:o}},H=(t,e)=>{e&&(t.deleteTexture(e.tex),t.deleteFramebuffer(e.fbo))},B=`#version 300 es
precision highp float;
precision highp int;
`,G=`${B}
out vec2 vUV;
void main() {
  vec2 p = vec2((gl_VertexID == 1) ? 3.0 : -1.0, (gl_VertexID == 2) ? 3.0 : -1.0);
  vUV = p * 0.5 + 0.5;
  gl_Position = vec4(p, 0.0, 1.0);
}
`,Pe=`
vec2 cmul(vec2 a, vec2 b) { return vec2(a.x*b.x - a.y*b.y, a.x*b.y + a.y*b.x); }
vec2 cdiv(vec2 a, vec2 b) { float d = max(dot(b,b), 1e-30); return vec2(a.x*b.x + a.y*b.y, a.y*b.x - a.x*b.y) / d; }
vec2 cpow(vec2 z, float p) {
  float r = length(z);
  if (r < 1e-30) return vec2(0.0);
  float a = atan(z.y, z.x);
  float rp = pow(r, p);
  return rp * vec2(cos(p*a), sin(p*a));
}
`,Z=`
uniform vec3 uA, uB, uC, uD;
vec3 cosPalette(float t) { return uA + uB * cos(6.28318530718 * (uC * t + uD)); }
`,Q=`
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
`,he=`
uniform int   uMaxIter;
uniform float uPixelSize;
uniform int   uTrap;       // 0 none, 1 stalk, 2 point, 3 circle
`,Te=`
uniform vec2  uResolution;
uniform vec2  uCenter;
uniform float uRotation;
uniform int   uKind;       // 0 mandelbrot, 1 julia, 2 multibrot
uniform float uPower;
uniform vec2  uJuliaC;
uniform float uBailout2;   // escape radius squared
`,Me=`
uniform float uCycles;
uniform float uPhase;
uniform int   uRemap;      // 0 sqrt, 1 log, 2 linear
uniform float uShade;
uniform float uGlow;
uniform vec2  uLight;
uniform vec3  uInterior;
`,Ae=`
vec2 complexFromFrag() {
  vec2 off = (gl_FragCoord.xy - 0.5 * uResolution) * uPixelSize;
  float cr = cos(uRotation), sr = sin(uRotation);
  vec2 rw = vec2(off.x * cr - off.y * sr, off.x * sr + off.y * cr);
  return uCenter + rw;
}
`,Ce=`
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
`,Le=`
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
`,st=()=>B+Pe+he+Te+Ae+Ce+`
in vec2 vUV;
out vec4 outField;
void main() { outField = fractalField(complexFromFrag()); }
`,ct=()=>B+Z+Q+he+Me+Le+`
in vec2 vUV;
out vec4 fragColor;
uniform sampler2D uField;
void main() {
  vec4 f = texture(uField, vUV);
  fragColor = vec4(encodeColor(shadeField(f), gl_FragCoord.xy), 1.0);
}
`,lt=()=>B+Pe+Z+Q+he+Te+Me+Ae+Ce+Le+`
in vec2 vUV;
out vec4 fragColor;
void main() {
  vec4 f = fractalField(complexFromFrag());
  fragColor = vec4(encodeColor(shadeField(f), gl_FragCoord.xy), 1.0);
}
`,ut=`${B}
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
`,dt=`${B}
${Z}
${Q}
in float vT;
out vec4 fragColor;
uniform float uCycles;
uniform float uPhase;
void main() {
  vec3 col = cosPalette(fract(vT * uCycles + uPhase));
  fragColor = vec4(encodeColor(col, gl_FragCoord.xy), 1.0);
}
`,mt=`${B}
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
`,ht=`${B}
in float vMap;
out vec4 outAcc;
uniform float uIntensity;
void main() {
  outAcc = vec4(vMap * uIntensity, 0.0, 0.0, uIntensity);
}
`,ft=`${B}
${Z}
${Q}
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
`,ve=t=>t==="stalk"?1:t==="point"?2:t==="circle"?3:0,pt=t=>t==="log"?1:t==="linear"?2:0;class gt{constructor(e){d(this,"kind","webgl2");d(this,"floatTargets");d(this,"gl");d(this,"fieldProg",null);d(this,"colorProg",null);d(this,"singleProg");d(this,"lineProg");d(this,"pointProg");d(this,"resolveProg");d(this,"emptyVao");d(this,"lineVao");d(this,"lineBuf");d(this,"lineVertexCount",0);d(this,"pointVao");d(this,"pointBuf");d(this,"pointCount",0);d(this,"fieldTarget",null);d(this,"accTarget",null);this.gl=e,this.floatTargets=it(e),this.singleProg=new j(e,G,lt()),this.lineProg=new j(e,ut,dt),this.pointProg=new j(e,mt,ht),this.resolveProg=new j(e,G,ft),this.floatTargets&&(this.fieldProg=new j(e,G,st()),this.colorProg=new j(e,G,ct())),this.emptyVao=this.mustVao(),this.lineVao=this.mustVao(),this.lineBuf=this.mustBuf(),this.pointVao=this.mustVao(),this.pointBuf=this.mustBuf(),this.setupLineVao(),this.setupPointVao()}mustVao(){const e=this.gl.createVertexArray();if(!e)throw new Error("createVertexArray failed");return e}mustBuf(){const e=this.gl.createBuffer();if(!e)throw new Error("createBuffer failed");return e}setupLineVao(){const e=this.gl,o=5*4;e.bindVertexArray(this.lineVao),e.bindBuffer(e.ARRAY_BUFFER,this.lineBuf);const n=this.lineProg.attrib("aPos"),r=this.lineProg.attrib("aNorm"),a=this.lineProg.attrib("aT");n>=0&&(e.enableVertexAttribArray(n),e.vertexAttribPointer(n,2,e.FLOAT,!1,o,0)),r>=0&&(e.enableVertexAttribArray(r),e.vertexAttribPointer(r,2,e.FLOAT,!1,o,8)),a>=0&&(e.enableVertexAttribArray(a),e.vertexAttribPointer(a,1,e.FLOAT,!1,o,16)),e.bindVertexArray(null)}setupPointVao(){const e=this.gl,o=3*4;e.bindVertexArray(this.pointVao),e.bindBuffer(e.ARRAY_BUFFER,this.pointBuf);const n=this.pointProg.attrib("aPos"),r=this.pointProg.attrib("aMap");n>=0&&(e.enableVertexAttribArray(n),e.vertexAttribPointer(n,2,e.FLOAT,!1,o,0)),r>=0&&(e.enableVertexAttribArray(r),e.vertexAttribPointer(r,1,e.FLOAT,!1,o,8)),e.bindVertexArray(null)}resize(e,o){}setLineGeometry(e){const o=this.gl;o.bindBuffer(o.ARRAY_BUFFER,this.lineBuf),o.bufferData(o.ARRAY_BUFFER,e.data,o.DYNAMIC_DRAW),this.lineVertexCount=e.vertexCount}setPointGeometry(e){const o=this.gl;o.bindBuffer(o.ARRAY_BUFFER,this.pointBuf),o.bufferData(o.ARRAY_BUFFER,e.data,o.STATIC_DRAW),this.pointCount=e.count}render(e){const o=de(e.scene.kind);o==="escape"?this.renderEscape(e):o==="lines"?this.renderLines(e):this.renderPoints(e)}drawFullscreen(){const e=this.gl;e.bindVertexArray(this.emptyVao),e.drawArrays(e.TRIANGLES,0,3),e.bindVertexArray(null)}setFieldUniforms(e,o,n,r,a){const i=o.scene,c=i.escape;e.vec2("uResolution",n,r),e.vec2("uCenter",i.camera.centerX,i.camera.centerY),e.float("uPixelSize",a),e.float("uRotation",i.camera.rotation),e.int("uKind",i.kind==="julia"?1:0),e.float("uPower",c.power),e.vec2("uJuliaC",o.juliaC[0],o.juliaC[1]),e.int("uMaxIter",c.maxIter),e.float("uBailout2",c.bailout*c.bailout),e.int("uTrap",ve(i.coloring.trap))}setShadeUniforms(e,o,n){const r=o.scene.coloring,a=o.palette;e.vec3("uA",a.a[0],a.a[1],a.a[2]),e.vec3("uB",a.b[0],a.b[1],a.b[2]),e.vec3("uC",a.c[0],a.c[1],a.c[2]),e.vec3("uD",a.d[0],a.d[1],a.d[2]),e.float("uCycles",r.cycles),e.float("uPhase",o.phase),e.int("uRemap",pt(r.remap)),e.float("uShade",r.shade),e.float("uGlow",r.glow),e.vec2("uLight",o.lightDir[0],o.lightDir[1]),e.vec3("uInterior",r.interior[0],r.interior[1],r.interior[2]),e.float("uFilmic",r.bloom),e.int("uMaxIter",o.scene.escape.maxIter),e.float("uPixelSize",n),e.int("uTrap",ve(r.trap))}renderEscape(e){const o=this.gl,{width:n,height:r,fieldScale:a}=e,i=$(e.scene.camera);if(this.floatTargets&&this.fieldProg&&this.colorProg){const c=Math.max(1,Math.round(n*a)),l=Math.max(1,Math.round(r*a));let b=!1;(!this.fieldTarget||this.fieldTarget.width!==c||this.fieldTarget.height!==l)&&(H(o,this.fieldTarget),this.fieldTarget=be(o,c,l),b=!0);const p=i/l;(e.geometryDirty||b)&&(o.bindFramebuffer(o.FRAMEBUFFER,this.fieldTarget.fbo),o.viewport(0,0,c,l),this.fieldProg.use(),this.setFieldUniforms(this.fieldProg,e,c,l,p),this.drawFullscreen(),o.bindFramebuffer(o.FRAMEBUFFER,null)),o.viewport(0,0,n,r),this.colorProg.use(),o.activeTexture(o.TEXTURE0),o.bindTexture(o.TEXTURE_2D,this.fieldTarget.tex),this.colorProg.int("uField",0),this.setShadeUniforms(this.colorProg,e,p),this.drawFullscreen()}else{o.viewport(0,0,n,r),this.singleProg.use();const c=i/r;this.setFieldUniforms(this.singleProg,e,n,r,c),this.setShadeUniforms(this.singleProg,e,c),this.drawFullscreen()}}renderLines(e){const o=this.gl,{width:n,height:r}=e,a=e.scene.camera,i=e.palette;o.viewport(0,0,n,r),o.disable(o.BLEND),o.clearColor(0,0,0,1),o.clear(o.COLOR_BUFFER_BIT),this.lineVertexCount!==0&&(this.lineProg.use(),this.lineProg.vec2("uCenter",a.centerX,a.centerY),this.lineProg.float("uPixelSize",$(a)/r),this.lineProg.vec2("uResolution",n,r),this.lineProg.float("uRotation",a.rotation),this.lineProg.float("uHalfWidthPx",1.5),this.lineProg.vec3("uA",i.a[0],i.a[1],i.a[2]),this.lineProg.vec3("uB",i.b[0],i.b[1],i.b[2]),this.lineProg.vec3("uC",i.c[0],i.c[1],i.c[2]),this.lineProg.vec3("uD",i.d[0],i.d[1],i.d[2]),this.lineProg.float("uCycles",e.scene.coloring.cycles),this.lineProg.float("uPhase",e.phase),this.lineProg.float("uFilmic",0),o.bindVertexArray(this.lineVao),o.drawArrays(o.TRIANGLES,0,this.lineVertexCount),o.bindVertexArray(null))}renderPoints(e){const o=this.gl,{width:n,height:r}=e,a=e.scene.camera,i=e.palette,c=this.floatTargets?o.RGBA16F:o.RGBA8;let l=!1;(!this.accTarget||this.accTarget.width!==n||this.accTarget.height!==r)&&(H(o,this.accTarget),this.accTarget=be(o,n,r,c),l=!0),(e.geometryDirty||l)&&this.pointCount>0&&(o.bindFramebuffer(o.FRAMEBUFFER,this.accTarget.fbo),o.viewport(0,0,n,r),o.clearColor(0,0,0,0),o.clear(o.COLOR_BUFFER_BIT),o.enable(o.BLEND),o.blendFunc(o.ONE,o.ONE),this.pointProg.use(),this.pointProg.vec2("uCenter",a.centerX,a.centerY),this.pointProg.float("uPixelSize",$(a)/r),this.pointProg.vec2("uResolution",n,r),this.pointProg.float("uRotation",a.rotation),this.pointProg.float("uIntensity",1),o.bindVertexArray(this.pointVao),o.drawArrays(o.POINTS,0,this.pointCount),o.bindVertexArray(null),o.disable(o.BLEND),o.bindFramebuffer(o.FRAMEBUFFER,null)),o.viewport(0,0,n,r),this.resolveProg.use(),o.activeTexture(o.TEXTURE0),o.bindTexture(o.TEXTURE_2D,this.accTarget.tex),this.resolveProg.int("uAcc",0),this.resolveProg.float("uExposure",.06),this.resolveProg.float("uCycles",e.scene.coloring.cycles),this.resolveProg.float("uPhase",e.phase),this.resolveProg.float("uMapSpread",.3),this.resolveProg.vec3("uInterior",e.scene.coloring.interior[0],e.scene.coloring.interior[1],e.scene.coloring.interior[2]),this.resolveProg.vec3("uA",i.a[0],i.a[1],i.a[2]),this.resolveProg.vec3("uB",i.b[0],i.b[1],i.b[2]),this.resolveProg.vec3("uC",i.c[0],i.c[1],i.c[2]),this.resolveProg.vec3("uD",i.d[0],i.d[1],i.d[2]),this.resolveProg.float("uFilmic",0),this.drawFullscreen()}dispose(){const e=this.gl;this.fieldProg?.dispose(),this.colorProg?.dispose(),this.singleProg.dispose(),this.lineProg.dispose(),this.pointProg.dispose(),this.resolveProg.dispose(),H(e,this.fieldTarget),H(e,this.accTarget),e.deleteVertexArray(this.emptyVao),e.deleteVertexArray(this.lineVao),e.deleteVertexArray(this.pointVao),e.deleteBuffer(this.lineBuf),e.deleteBuffer(this.pointBuf)}}const bt=t=>{const e=t.getContext("webgl2",{antialias:!1,alpha:!1,depth:!1,stencil:!1,powerPreference:"high-performance",preserveDrawingBuffer:!1});if(e){const o=new gt(e);return{kind:"webgl2",renderer:o,note:o.floatTargets?"WebGL2":"WebGL2 (no float cache)"}}return{kind:"none",renderer:null,note:"WebGL2 unavailable"}},vt=20,yt=3e5,wt=.45,xt=.15,Et=t=>t.coloring.custom??(me[t.coloring.paletteId]??rt()).palette;class Ft{constructor(e,o){d(this,"scene");d(this,"clock",new _e);d(this,"cinematic",new He);d(this,"backend");d(this,"backendNote");d(this,"renderer");d(this,"canvas");d(this,"backingW",1);d(this,"backingH",1);d(this,"geometryDirty",!0);d(this,"lastInputT",-1e9);d(this,"nowSec",0);d(this,"interacting",!1);d(this,"renderScale",1);d(this,"idleScaleCap",1);d(this,"emaFrameMs",16);d(this,"lineDepths",new Map);this.canvas=e,this.scene=o;const n=bt(e);this.renderer=n.renderer,this.backend=n.kind,this.backendNote=n.note,this.renderer&&this.loadGeometryFor(o.kind)}get ok(){return this.renderer!==null}get floatTargets(){return this.renderer?.floatTargets??!1}resize(e,o,n){const r=this.scene.quality.dprCap,a=Math.min(n,r);this.backingW=Math.max(1,Math.round(e*a)),this.backingH=Math.max(1,Math.round(o*a)),this.canvas.width=this.backingW,this.canvas.height=this.backingH,this.renderer?.resize(this.backingW,this.backingH),this.geometryDirty=!0}markFieldDirty(){this.geometryDirty=!0}notifyInteraction(){this.lastInputT=this.nowSec,this.geometryDirty=!0,this.cinematic.stop()}setKind(e){this.cinematic.stop(),this.scene.kind=e,this.resetCameraFor(e),this.loadGeometryFor(e),this.geometryDirty=!0}resetView(){this.resetCameraFor(this.scene.kind),this.geometryDirty=!0}adoptScene(e){this.cinematic.stop(),this.scene=e,this.loadGeometryFor(e.kind),this.geometryDirty=!0}startTour(){this.scene.kind!=="mandelbrot"&&this.setKind("mandelbrot"),this.cinematic.start(this.scene.camera),this.geometryDirty=!0}stopTour(){this.cinematic.stop()}get tourActive(){return this.cinematic.active}setLineDepth(e,o){this.lineDepths.set(e,o),this.scene.kind===e&&this.loadGeometryFor(e),this.geometryDirty=!0}lineDepth(e){return this.lineDepths.get(e)}loadGeometryFor(e){if(!this.renderer)return;const o=de(e);if(o==="lines")this.renderer.setLineGeometry(Ze(e,this.lineDepths.get(e)));else if(o==="points"){const n=tt[e];n&&this.renderer.setPointGeometry(ot(n,yt))}}resetCameraFor(e){const o=this.scene.camera;switch(o.rotation=0,e){case"mandelbrot":o.centerX=-.6,o.centerY=0,o.zoomLevel=0;break;case"julia":case"multibrot":o.centerX=0,o.centerY=0,o.zoomLevel=-.15;break;default:o.centerX=0,o.centerY=0,o.zoomLevel=-.1}}beginFrame(e,o){this.nowSec=e,this.emaFrameMs+=(o-this.emaFrameMs)*.1,this.interacting=e-this.lastInputT<xt||this.cinematic.active,this.interacting||(this.emaFrameMs>22&&this.idleScaleCap>.5?this.idleScaleCap=Math.max(.5,this.idleScaleCap-.08):this.emaFrameMs<12&&this.idleScaleCap<1&&(this.idleScaleCap=Math.min(1,this.idleScaleCap+.04)));const n=this.interacting?Math.min(wt,this.idleScaleCap):this.idleScaleCap;Math.abs(n-this.renderScale)>.001&&(this.renderScale=n,this.geometryDirty=!0),this.scene.kind==="julia"&&this.scene.anim.juliaOrbit&&this.scene.anim.motionScale>0&&(this.geometryDirty=!0)}advance(e){this.clock.advance(e,this.scene),this.cinematic.active&&this.scene.anim.motionScale>0&&this.scene.kind==="mandelbrot"&&(this.cinematic.update(e,this.scene.camera),this.geometryDirty=!0)}render(){if(!this.renderer)return;const e={scene:this.scene,width:this.backingW,height:this.backingH,fieldScale:this.renderScale,palette:Et(this.scene),phase:this.scene.coloring.phase+this.clock.paletteShift,juliaC:this.clock.juliaC(this.scene),lightDir:this.clock.lightDir(this.scene),geometryDirty:this.geometryDirty};this.renderer.render(e),this.geometryDirty=!1}get fps(){return this.emaFrameMs>0?1e3/this.emaFrameMs:0}get magnification(){return Math.pow(2,this.scene.camera.zoomLevel)}get precisionWarn(){return this.scene.camera.zoomLevel>16}get worldHeightNow(){return $(this.scene.camera)}get backingSize(){return[this.backingW,this.backingH]}snapshot(){return De(this.scene)}dispose(){this.renderer?.dispose()}}class St{constructor(e){d(this,"last",0);d(this,"acc",0);d(this,"raf",0);d(this,"running",!1);d(this,"STEP",1/120);d(this,"onVisibility",()=>{document.hidden?cancelAnimationFrame(this.raf):this.running&&(this.last=0,this.raf=requestAnimationFrame(this.frame))});d(this,"frame",e=>{if(!this.running)return;this.last===0&&(this.last=e);let o=(e-this.last)/1e3;this.last=e,o=Math.min(o,.1),this.engine.beginFrame(e/1e3,o*1e3),this.acc+=o;let n=0;for(;this.acc>=this.STEP&&n<8;)this.engine.advance(this.STEP),this.acc-=this.STEP,n++;this.engine.render(),this.raf=requestAnimationFrame(this.frame)});this.engine=e}start(){this.running||(this.running=!0,this.last=0,this.raf=requestAnimationFrame(this.frame),document.addEventListener("visibilitychange",this.onVisibility))}stop(){this.running=!1,cancelAnimationFrame(this.raf),document.removeEventListener("visibilitychange",this.onVisibility)}}const kt=-3,Pt=(t,e,o)=>{const n=new Map;let r=!1,a=0,i=0,c=0;const l=()=>t.getBoundingClientRect(),b=u=>{const h=l();return[u.clientX-h.left,u.clientY-h.top]},p=()=>{e.scene.camera.zoomLevel=L(e.scene.camera.zoomLevel,kt,vt)},s=u=>{t.setPointerCapture(u.pointerId);const[h,v]=b(u);if(n.set(u.pointerId,{x:h,y:v}),n.size===1)r=!0,a=h,i=v,t.classList.add("dragging");else if(n.size===2){const f=[...n.values()];c=Math.hypot(f[0].x-f[1].x,f[0].y-f[1].y)}},y=u=>{if(!n.has(u.pointerId))return;const[h,v]=b(u);n.set(u.pointerId,{x:h,y:v});const f=l();if(n.size>=2){const F=[...n.values()],S=Math.hypot(F[0].x-F[1].x,F[0].y-F[1].y),x=(F[0].x+F[1].x)/2,R=(F[0].y+F[1].y)/2;if(c>0&&S>0){const C=Math.log2(S/c);ee(e.scene.camera,x,R,f.width,f.height,C),p()}c=S,e.notifyInteraction(),o();return}r&&(Ye(e.scene.camera,h-a,v-i,f.height),a=h,i=v,e.notifyInteraction(),o())},g=u=>{n.delete(u.pointerId),n.size<2&&(c=0),n.size===0&&(r=!1,t.classList.remove("dragging"))},E=u=>{u.preventDefault();const h=l(),v=u.clientX-h.left,f=u.clientY-h.top,F=-Math.sign(u.deltaY)*.5;ee(e.scene.camera,v,f,h.width,h.height,F),p(),e.notifyInteraction(),o()},P=u=>{const h=l();ee(e.scene.camera,u.clientX-h.left,u.clientY-h.top,h.width,h.height,1),p(),e.notifyInteraction(),o()};return t.addEventListener("pointerdown",s),t.addEventListener("pointermove",y),t.addEventListener("pointerup",g),t.addEventListener("pointercancel",g),t.addEventListener("wheel",E,{passive:!1}),t.addEventListener("dblclick",P),()=>{t.removeEventListener("pointerdown",s),t.removeEventListener("pointermove",y),t.removeEventListener("pointerup",g),t.removeEventListener("pointercancel",g),t.removeEventListener("wheel",E),t.removeEventListener("dblclick",P)}},Tt=t=>{const e=L(t,0,1);return e<=.0031308?e*12.92:1.055*Math.pow(e,1/2.4)-.055},Mt=new Set(Object.keys(ue)),At=new Set(["sqrt","log","linear"]),Ct=new Set(["none","stalk","point","circle"]),U=t=>{const e=new URLSearchParams;return e.set("k",t.kind),e.set("cx",M(t.camera.centerX)),e.set("cy",M(t.camera.centerY)),e.set("z",M(t.camera.zoomLevel)),t.camera.rotation&&e.set("rot",M(t.camera.rotation)),e.set("it",String(t.escape.maxIter)),t.escape.power!==2&&e.set("pw",M(t.escape.power)),e.set("jx",M(t.escape.juliaC[0])),e.set("jy",M(t.escape.juliaC[1])),e.set("bl",M(t.escape.bailout)),e.set("pal",t.coloring.paletteId),e.set("cyc",M(t.coloring.cycles)),e.set("rm",t.coloring.remap),e.set("ph",M(t.coloring.phase)),e.set("sh",M(t.coloring.shade)),e.set("gl",M(t.coloring.glow)),e.set("bm",M(t.coloring.bloom)),e.set("tr",t.coloring.trap),e.set("cs",M(t.anim.cycleSpeed)),e.set("jo",t.anim.juliaOrbit?"1":"0"),e.set("os",M(t.anim.orbitSpeed)),e.set("lo",t.anim.lightOrbit?"1":"0"),e.toString()},T=(t,e,o)=>{const n=t.get(e);if(n==null)return o;const r=Number(n);return Number.isFinite(r)?r:o},Lt=t=>{let e=t.startsWith("#")?t.slice(1):t;const o=e.indexOf("?");if(o>=0)e=e.slice(o+1);else if(e.startsWith("/"))return null;if(!e)return null;const n=new URLSearchParams(e);if(![...n.keys()].length)return null;const r=J(),a=n.get("k");a&&Mt.has(a)&&(r.kind=a),r.camera.centerX=T(n,"cx",r.camera.centerX),r.camera.centerY=T(n,"cy",r.camera.centerY),r.camera.zoomLevel=L(T(n,"z",r.camera.zoomLevel),-3,40),r.camera.rotation=T(n,"rot",0),r.escape.maxIter=L(Math.round(T(n,"it",r.escape.maxIter)),16,4e3),r.escape.power=T(n,"pw",r.escape.power),r.escape.juliaC=[T(n,"jx",r.escape.juliaC[0]),T(n,"jy",r.escape.juliaC[1])],r.escape.bailout=Math.max(4,T(n,"bl",r.escape.bailout));const i=n.get("pal");i&&me[i]&&(r.coloring.paletteId=i),r.coloring.cycles=L(T(n,"cyc",r.coloring.cycles),.1,32);const c=n.get("rm");c&&At.has(c)&&(r.coloring.remap=c),r.coloring.phase=T(n,"ph",r.coloring.phase),r.coloring.shade=L(T(n,"sh",r.coloring.shade),0,1),r.coloring.glow=L(T(n,"gl",r.coloring.glow),0,4),r.coloring.bloom=L(T(n,"bm",r.coloring.bloom),0,1);const l=n.get("tr");return l&&Ct.has(l)&&(r.coloring.trap=l),r.anim.cycleSpeed=L(T(n,"cs",r.anim.cycleSpeed),0,2),r.anim.juliaOrbit=n.get("jo")==="1",r.anim.orbitSpeed=L(T(n,"os",r.anim.orbitSpeed),0,2),r.anim.lightOrbit=n.get("lo")!=="0",r},zt=(t=220)=>{let e=0;return o=>{clearTimeout(e),e=window.setTimeout(()=>{history.replaceState(null,"","#/explore?"+U(o))},t)}},D=(t,e=1800)=>{const o=document.getElementById("toast-root");if(!o)return;const n=document.createElement("div");n.className="toast",n.textContent=t,o.appendChild(n),window.setTimeout(()=>{n.classList.add("out"),window.setTimeout(()=>n.remove(),300)},e)},Rt={mandelbrot:"The map of every Julia set — z → z² + c.",julia:"A fixed c; the plane of starting points.",multibrot:"z → zⁿ + c — more lobes with higher power.",koch:"Infinite length, finite area (≈1.26 dimensions).",snowflake:"Three Koch curves closed into a flake.",sierpinski:"An arrowhead curve filling the gasket.",dragon:"The Heighway dragon — paper folded forever.",hilbert:"A space-filling curve visiting every cell.",plant:"Lindenmayer's branching botany.",fern:"Barnsley's four-map chaos game.","sierpinski-ifs":"The gasket drawn by random points."},ye=t=>{const o=[];for(let n=0;n<16;n++){const r=n/15,a=nt(t,r).map(i=>Math.round(L(Tt(i),0,1)*255));o.push(`rgb(${a[0]},${a[1]},${a[2]}) ${r*100|0}%`)}return`linear-gradient(90deg, ${o.join(",")})`},It=(t,e)=>{const o=document.getElementById("panel");let n=0;const r=(s,y=!0)=>{n++;const g=document.createElement("details");g.className="panel-section",g.open=y;const E=document.createElement("summary");return E.innerHTML=`<span class="sec-no">${String(n).padStart(2,"0")}</span><span class="sec-title">${s}</span>`,g.appendChild(E),o.appendChild(g),g},a=(s,y,g,E,P,u,h,v,f=F=>F.toFixed(2))=>{const F=document.createElement("div");F.className="row";const S=document.createElement("label");S.textContent=y;const x=document.createElement("input");x.type="range",x.min=String(P),x.max=String(u),x.step=String(h),x.value=String(g());const R=document.createElement("span");R.className="val",R.textContent=f(g());const C=document.createElement("div");C.className="slider-wrap";const m=document.createElement("span");m.className="bubble",m.textContent=f(g());const w=z=>{const A=u>P?(z-P)/(u-P)*100:0;x.style.setProperty("--fill",`${A}%`),m.style.left=`calc(${A}% + ${(50-A)*.13}px)`};w(g()),x.addEventListener("input",()=>{const z=Number(x.value);E(z),R.textContent=f(z),m.textContent=f(z),w(z),v&&t.markFieldDirty(),e()}),C.append(x,m),F.append(S,C,R),s.appendChild(F)},i=(s,y,g,E,P,u)=>{const h=document.createElement("div");h.className="row";const v=document.createElement("label");v.textContent=y;const f=document.createElement("div");f.className="segmented";const F=()=>f.querySelectorAll("button").forEach(S=>S.classList.toggle("active",S.dataset.value===E()));for(const S of g){const x=document.createElement("button");x.type="button",x.textContent=S.label,x.dataset.value=S.value,x.addEventListener("click",()=>{P(S.value),F(),e()}),f.appendChild(x)}F(),h.append(v,f),s.appendChild(h)},c=(s,y,g,E,P,u)=>{const h=document.createElement("div");h.className="row wide";const v=document.createElement("label");v.textContent=y;const f=document.createElement("select");for(const F of g){const S=document.createElement("option");S.value=F.value,S.textContent=F.label,f.appendChild(S)}f.value=E(),f.addEventListener("change",()=>{P(f.value),t.markFieldDirty(),e()}),h.append(v,f),s.appendChild(h)},l=(s,y,g,E)=>{const P=document.createElement("div");P.className="checkbox-row";const u=document.createElement("input");u.type="checkbox",u.checked=g();const h=document.createElement("label");h.textContent=y,u.addEventListener("change",()=>{E(u.checked),e()}),P.append(u,h),s.appendChild(P)},b=(s,y,g)=>{const E=document.createElement("button");E.className="btn",E.type="button",E.textContent=y,E.addEventListener("click",g),s.appendChild(E)},p=()=>{const s=t.scene,y=de(s.kind);o.innerHTML="",n=0;const g=document.createElement("div");g.className="panel-context",g.innerHTML=`<span class="ctx-name">${ue[s.kind].name}</span><span class="ctx-desc">${Rt[s.kind]}</span>`,o.appendChild(g);const E=r("Fractal"),P=["Escape-time","L-system","IFS"],u=document.createElement("div");u.className="row wide";const h=document.createElement("select");for(const m of P){const w=document.createElement("optgroup");w.label=m;for(const z of le.filter(A=>A.group===m)){const A=document.createElement("option");A.value=z.kind,A.textContent=z.name,w.appendChild(A)}h.appendChild(w)}h.value=s.kind,h.addEventListener("change",()=>{t.setKind(h.value),e(),p()}),u.appendChild(h),E.appendChild(u);const v=r("Palette"),f=document.createElement("div");f.className="palette-strip";const F=s.coloring.custom??me[s.coloring.paletteId]?.palette??W[0].palette;f.style.background=ye(F),v.appendChild(f);const S=document.createElement("div");S.className="swatches";for(const m of W){const w=document.createElement("button");w.className="swatch"+(m.id===s.coloring.paletteId&&!s.coloring.custom?" active":""),w.style.background=ye(m.palette),w.title=m.name,w.addEventListener("click",()=>{s.coloring.paletteId=m.id,s.coloring.custom=null,e(),p()}),S.appendChild(w)}if(v.appendChild(S),a(v,"Cycles",()=>s.coloring.cycles,m=>s.coloring.cycles=m,.25,16,.25,!1),i(v,"Density",[{value:"sqrt",label:"√"},{value:"log",label:"log"},{value:"linear",label:"lin"}],()=>s.coloring.remap,m=>s.coloring.remap=m),a(v,"Phase",()=>s.coloring.phase,m=>s.coloring.phase=m,0,1,.001,!1,m=>m.toFixed(3)),y==="escape"&&(a(v,"Shade",()=>s.coloring.shade,m=>s.coloring.shade=m,0,1,.01,!1),a(v,"Glow",()=>s.coloring.glow,m=>s.coloring.glow=m,0,4,.05,!1),a(v,"Filmic",()=>s.coloring.bloom,m=>s.coloring.bloom=m,0,1,.01,!1),c(v,"Orbit trap",[{value:"none",label:"None"},{value:"stalk",label:"Pickover stalk"},{value:"point",label:"Point"},{value:"circle",label:"Circle"}],()=>s.coloring.trap,m=>s.coloring.trap=m)),y==="escape"){const m=r("Parameters");a(m,"Iterations",()=>s.escape.maxIter,w=>s.escape.maxIter=Math.round(w),32,2e3,1,!0,w=>String(Math.round(w))),a(m,"Bailout",()=>s.escape.bailout,w=>s.escape.bailout=w,4,1024,4,!0,w=>String(Math.round(w))),s.kind==="multibrot"&&a(m,"Power",()=>s.escape.power,w=>s.escape.power=w,2,8,.01,!0),s.kind==="julia"&&(a(m,"Julia cₓ",()=>s.escape.juliaC[0],w=>s.escape.juliaC[0]=w,-1,1,.001,!0,w=>w.toFixed(3)),a(m,"Julia cᵧ",()=>s.escape.juliaC[1],w=>s.escape.juliaC[1]=w,-1,1,.001,!0,w=>w.toFixed(3)))}if(y==="lines"&&ne[s.kind]){const m=r("Geometry"),w=ne[s.kind],z=t.lineDepth(s.kind)??w.depth;a(m,"Depth",()=>z,A=>t.setLineDepth(s.kind,Math.round(A)),1,Qe(s.kind),1,!1,A=>String(Math.round(A)))}const x=r("Animation");a(x,"Cycle speed",()=>s.anim.cycleSpeed,m=>s.anim.cycleSpeed=m,0,1,.01,!1),a(x,"Motion",()=>s.anim.motionScale,m=>s.anim.motionScale=m,0,1,.01,!1),y==="escape"&&l(x,"Animate light",()=>s.anim.lightOrbit,m=>s.anim.lightOrbit=m),s.kind==="julia"&&(l(x,"Julia c-orbit",()=>s.anim.juliaOrbit,m=>s.anim.juliaOrbit=m),a(x,"Orbit speed",()=>s.anim.orbitSpeed,m=>s.anim.orbitSpeed=m,0,1,.01,!1));const R=r("View",!1),C=document.createElement("div");C.className="btn-row",b(C,"Reset",()=>{t.resetView(),e()}),b(C,"Copy link",()=>{const m=location.origin+location.pathname+"#"+U(t.scene);navigator.clipboard?navigator.clipboard.writeText(m).then(()=>D("Link copied")).catch(()=>D("Copy failed")):D("Copy not supported")}),R.appendChild(C)};return p(),{rebuild:p}},Y=t=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${t}</svg>`,Bt=(()=>{const t=[];for(let a=0;a<=130;a++){const i=a/130*3.4*2*Math.PI,c=.6*Math.exp(.13*i);t.push(`${(12+c*Math.cos(i)).toFixed(2)},${(12+c*Math.sin(i)).toFixed(2)}`)}return t.join(" ")})(),re=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="${Bt}"/></svg>`,_={play:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.2v13.6L19 12 8 5.2z"/></svg>',pause:'<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6.5" y="5" width="3.6" height="14" rx="1.1"/><rect x="13.9" y="5" width="3.6" height="14" rx="1.1"/></svg>',info:Y('<circle cx="12" cy="12" r="9"/><line x1="12" y1="11" x2="12" y2="16.5"/><circle cx="12" cy="7.6" r="0.9" fill="currentColor" stroke="none"/>'),save:Y('<path d="M12 3.5v10.5"/><path d="M8 10.5l4 4 4-4"/><path d="M5 19.5h14"/>'),share:Y('<circle cx="6.5" cy="12" r="2.3"/><circle cx="17.5" cy="6" r="2.3"/><circle cx="17.5" cy="18" r="2.3"/><line x1="8.5" y1="10.9" x2="15.5" y2="7"/><line x1="8.5" y1="13.1" x2="15.5" y2="17"/>'),fullscreen:Y('<path d="M4 9V4.5h5"/><path d="M20 9V4.5h-5"/><path d="M4 15v4.5h5"/><path d="M20 15v4.5h-5"/>')},Dt=t=>{const e=document.getElementById("topbar-actions"),o=(r,a,i,c)=>{const l=document.createElement("button");return l.className="icon-btn",l.type="button",l.innerHTML=r,l.setAttribute("aria-label",a),l.title=i,l.addEventListener("click",c),e.appendChild(l),l},n=o(_.play,"Toggle tour","Tour (Space)",t.onTour);return o(_.info,"History of fractals","History (?)",t.onAbout),o(_.save,"Save image","Save PNG (S)",t.onSave),typeof navigator<"u"&&"share"in navigator&&o(_.share,"Share","Share image",t.onShare),o(_.fullscreen,"Fullscreen","Fullscreen (F)",t.onFullscreen),{setTourActive(r){n.classList.toggle("active",r),n.innerHTML=r?_.pause:_.play,n.setAttribute("aria-pressed",String(r))}}},_t=t=>{const e=o=>{const n=o.target;if(!(n&&(n.tagName==="INPUT"||n.tagName==="SELECT"||n.isContentEditable))&&!(o.metaKey||o.ctrlKey||o.altKey))switch(o.key){case" ":o.preventDefault(),t.tour();break;case"f":case"F":t.fullscreen();break;case"?":case"i":case"I":t.about();break;case"r":case"R":t.reset();break;case"c":case"C":t.copy();break;case"s":case"S":t.save();break}};return window.addEventListener("keydown",e),()=>window.removeEventListener("keydown",e)},Nt=(t,e,o="fractal-explorer.png")=>{e(),t.toBlob(n=>{if(!n)return;const r=URL.createObjectURL(n),a=document.createElement("a");a.href=r,a.download=o,document.body.appendChild(a),a.click(),a.remove(),window.setTimeout(()=>URL.revokeObjectURL(r),2e3)},"image/png")},jt=async(t,e)=>{e();const o=await new Promise(a=>t.toBlob(a,"image/png"));if(!o)return!1;const n=new File([o],"fractal-explorer.png",{type:"image/png"}),r=navigator;if(r.canShare?.({files:[n]})&&r.share)try{return await r.share({files:[n],title:"Fractal Explorer"}),!0}catch{return!1}return!1},Ot=t=>{const e=t.startsWith("#")?t.slice(1):t;if(e===""||e==="/")return{name:"home",query:""};const o=e.indexOf("?"),n=o>=0?e.slice(0,o):e,r=o>=0?e.slice(o+1):"";return n==="/history"?{name:"history",query:""}:n==="/explore"?{name:"explore",query:r}:/(^|&)(k|cx|cy|z)=/.test(e)?{name:"explore",query:e}:{name:"home",query:""}},K="#/",ae="#/history",X=t=>t?`#/explore?${t}`:"#/explore",ie=t=>{location.hash===t?window.dispatchEvent(new HashChangeEvent("hashchange")):location.hash=t},$t=[{name:"Seahorse Valley",group:"Mandelbrot",kind:"mandelbrot",formula:"z → z² + c",center:[-.75,.1],magnification:250,blurb:"The pinched neck between the cardioid and the period-2 bulb, where filaments coil into seahorse tails."},{name:"Elephant Valley",group:"Mandelbrot",kind:"mandelbrot",formula:"z → z² + c",center:[.2825,.01],magnification:250,blurb:"The cardioid's eastern flank, where bulbs trail spiralling trunks nose-to-tail."},{name:"Triple Spiral Valley",group:"Mandelbrot",kind:"mandelbrot",formula:"z → z² + c",center:[-.088,.654],magnification:600,blurb:"A three-armed pinwheel braiding filaments into nested spirals around a hidden minibrot."},{name:"Scepter Valley",group:"Mandelbrot",kind:"mandelbrot",formula:"z → z² + c",center:[-1.36,0],magnification:800,blurb:"A cusp on the western antenna where spiked scepters fuse to seahorses and double spirals."},{name:"Satellite Minibrot",group:"Mandelbrot",kind:"mandelbrot",formula:"z → z² + c",center:[-1.75,0],magnification:4e3,blurb:"The largest mini-Mandelbrot on the western needle — a self-similar copy of the whole set."},{name:"Misiurewicz Point",group:"Mandelbrot",kind:"mandelbrot",formula:"z → z² + c",center:[-.77568377,.13646737],magnification:3e4,blurb:"A pre-periodic branch point — the exact center of a two-armed spiral in the seahorse valley."},{name:"Feigenbaum Point",group:"Mandelbrot",kind:"mandelbrot",formula:"z → z² + c",center:[-1.401155,0],magnification:5e3,blurb:"The period-doubling accumulation point where the cascade converges toward the needle."},{name:"Double Spiral",group:"Mandelbrot",kind:"mandelbrot",formula:"z → z² + c",center:[-.745428,.113009],magnification:9e4,blurb:"A deep-zoom whirlpool of counter-rotating arms spinning out of the seahorse valley."},{name:"Douady Rabbit",group:"Julia",kind:"julia",formula:"z → z² + c",juliaC:[-.123,.745],center:[0,0],magnification:1.4,blurb:"A period-3 set whose every junction sprouts a fresh pair of ears — rabbits within rabbits."},{name:"Basilica (San Marco)",group:"Julia",kind:"julia",formula:"z → z² + c",juliaC:[-1,0],center:[0,0],magnification:1.2,blurb:"The period-2 set: a chain of pinched disks like the domes and reflections of San Marco."},{name:"Dendrite",group:"Julia",kind:"julia",formula:"z → z² + c",juliaC:[0,1],center:[0,0],magnification:1.2,blurb:"An interior-free filigree of nerve-like branches at the Misiurewicz point c = i."},{name:"Siegel Disk",group:"Julia",kind:"julia",formula:"z → z² + c",juliaC:[-.390541,-.586788],center:[0,0],magnification:2,blurb:"A neutral rotation domain with golden-mean rotation number, self-similar about its center."},{name:"Spiral",group:"Julia",kind:"julia",formula:"z → z² + c",juliaC:[-.7269,.1889],center:[0,0],magnification:3,blurb:"A near-parabolic value whose orbits wind into delicate logarithmic spiral arms."},{name:"Airplane",group:"Julia",kind:"julia",formula:"z → z² + c",juliaC:[-1.7549,0],center:[0,0],magnification:1.1,blurb:"A real period-3 set whose symmetric fuselage and swept-back wings read like an aircraft."},{name:"Multibrot ³",group:"Multibrot",kind:"multibrot",formula:"z → z³ + c",power:3,center:[0,0],magnification:1,blurb:"The cubic generalization — twofold symmetry, two main bulbs instead of one cardioid."},{name:"Multibrot ⁵",group:"Multibrot",kind:"multibrot",formula:"z → z⁵ + c",power:5,center:[0,0],magnification:1,blurb:"The quintic multibrot — a four-lobed snowflake of ever finer decorative buds."}],Vt=t=>{const e=J();return e.kind=t.kind,e.camera.centerX=t.center[0],e.camera.centerY=t.center[1],e.camera.zoomLevel=Math.log2(t.magnification),t.juliaC&&(e.escape.juliaC=[t.juliaC[0],t.juliaC[1]]),t.power!=null&&(e.escape.power=t.power),e.escape.maxIter=Math.max(e.escape.maxIter,Math.round(150+90*Math.max(0,e.camera.zoomLevel))),e},Xt=t=>X(U(Vt(t))),Ut=t=>{const e=J();return e.kind=t,t==="mandelbrot"?(e.camera.centerX=-.6,e.camera.centerY=0,e.camera.zoomLevel=0):t==="julia"||t==="multibrot"?(e.camera.centerX=0,e.camera.centerY=0,e.camera.zoomLevel=-.15):(e.camera.centerX=0,e.camera.centerY=0,e.camera.zoomLevel=-.1),e},Ht=t=>X(U(Ut(t))),Gt=[{name:"Mandelbrot",formula:"zₙ₊₁ = zₙ² + c,  z₀ = 0;  c = pixel.  Escape when |z| > 2",note:"Per-pixel escape-time set; points of c that never escape form the black interior."},{name:"Julia",formula:"zₙ₊₁ = zₙ² + c,  c fixed;  z₀ = pixel",note:"Same map, but c is constant and the start point varies — each c gives a different set."},{name:"Multibrot",formula:"zₙ₊₁ = zₙⁿ + c,  z₀ = 0  (n = power)",note:"Generalized exponent; an integer power n yields n − 1 lobes (n = 2 is the Mandelbrot set)."},{name:"Koch curve",formula:"F → F+F−−F+F   (axiom F, angle 60°)",note:"Replaces each segment with a four-segment bump; dimension ≈ 1.262."},{name:"Koch snowflake",formula:"F → F+F−−F+F   (axiom F−−F−−F, 60°)",note:"Three Koch curves on a triangle — infinite perimeter, finite area."},{name:"Sierpiński arrowhead",formula:"A → B−A−B,  B → A+B+A   (60°)",note:"A space-traversing curve whose limit is the Sierpiński triangle."},{name:"Heighway dragon",formula:"X → X+YF+,  Y → −FX−Y   (axiom FX, 90°)",note:"The paper-folding curve — fold a strip repeatedly, unfold to right angles."},{name:"Hilbert curve",formula:"A → +BF−AFA−FB+,  B → −AF+BFB+FA−   (90°)",note:"A space-filling curve visiting every cell of a grid; preserves locality."},{name:"Fractal plant",formula:"X → F+[[X]−X]−F[−FX]+X,  F → FF   (25°)",note:"Lindenmayer's branching L-system; the [ ] stack creates self-similar branches."},{name:"Barnsley fern",formula:"4 affine maps wᵢ(x,y) chosen by probability (chaos game)",note:"Visit density of the random orbit traces out the fern."}];let we=!1;const q=t=>t.toFixed(Math.abs(t)<1?4:3).replace(/\.?0+$/,"")||"0",Yt=t=>{if(t.kind==="julia"){const o=t.juliaC?t.juliaC[1]:0;return`c = ${q(t.juliaC?t.juliaC[0]:0)} ${o>=0?"+":"−"} ${q(Math.abs(o))}i`}if(t.kind==="multibrot")return`power ${t.power}`;const e=t.magnification>=1e3?`${(t.magnification/1e3).toFixed(t.magnification%1e3?1:0)}k`:`${t.magnification}`;return`(${q(t.center[0])}, ${q(t.center[1])}) · ×${e}`},qt=()=>{if(we)return;we=!0;const t=document.getElementById("home"),e=le.map(a=>`
      <a class="gcard" href="${Ht(a.kind)}" aria-label="${a.name}">
        <span class="gthumb" style="background-image:url('thumbnails/${a.kind}.jpg')"></span>
        <span class="gmeta"><span class="gname">${a.name}</span><span class="ggroup">${a.group}</span></span>
      </a>`).join(""),n=["Mandelbrot","Julia","Multibrot"].map(a=>{const i=$t.filter(c=>c.group===a).map(c=>`
          <a class="formula-link" href="${Xt(c)}">
            <span class="fl-head"><span class="fl-name">${c.name}</span><span class="fl-coord">${Yt(c)}</span></span>
            <span class="fl-formula">${c.formula}</span>
            <span class="fl-blurb">${c.blurb}</span>
          </a>`).join("");return`<div class="formula-group"><h3>${a}</h3><div class="formula-list">${i}</div></div>`}).join(""),r=Gt.map(a=>`<div class="fref"><b>${a.name}</b><code>${a.formula}</code><span>${a.note}</span></div>`).join("");t.innerHTML=`
    <section class="hero">
      <div class="hero-inner">
        <div class="hero-logo">${re}</div>
        <h1 class="hero-title">Fractal <em>Explorer</em></h1>
        <p class="hero-tag">An interactive journey into the Mandelbrot set, Julia sets, and the
          geometry of infinite detail — animated and color-cycled in your browser.</p>
        <div class="hero-actions">
          <a class="hero-cta" href="${X("")}">Enter the explorer</a>
          <a class="hero-link" href="${ae}">Read the history →</a>
        </div>
      </div>
      <div class="scroll-cue" aria-hidden="true"><span>scroll</span></div>
    </section>

    <div class="home-content">
      <section class="home-section" id="home-history">
        <p class="eyebrow">History</p>
        <blockquote class="pullquote">"Clouds are not spheres, mountains are not cones, coastlines are
          not circles … nature exhibits not simply a higher degree but an altogether different level of
          complexity."<cite>— Benoît Mandelbrot</cite></blockquote>
        <p class="section-lede">From the 19th-century "monsters" of Weierstrass, Koch and Sierpiński,
          through Julia and Fatou, to Mandelbrot at IBM — fractals became a language for the irregular
          and the very shape of chaos.</p>
        <a class="section-more" href="${ae}">Read the full history →</a>
      </section>

      <section class="home-section" id="home-gallery">
        <p class="eyebrow">Gallery</p>
        <h2 class="section-title">Common fractal types</h2>
        <p class="section-lede">Eleven families, from escape-time sets to L-systems and the chaos game.
          Open any of them live.</p>
        <div class="gallery-grid">${e}</div>
      </section>

      <section class="home-section" id="home-formulas">
        <p class="eyebrow">Formulas</p>
        <h2 class="section-title">Famous coordinates &amp; formulas</h2>
        <p class="section-lede">Each link opens the explorer at a known formula, coordinate, and zoom
          depth — landmarks named and charted over a century of fractal cartography.</p>
        ${n}
        <h3 class="ref-title">Formula reference</h3>
        <div class="formula-ref">${r}</div>
      </section>

      <footer class="home-footer">
        <span>${re}</span>
        <p>Built with TypeScript &amp; WebGL2. <a href="${X("")}">Open the explorer →</a></p>
      </footer>
    </div>`};let xe=!1;const Wt=()=>{if(xe)return;xe=!0;const t=document.getElementById("history");t.innerHTML=`
    <div class="history-page">
      <a class="history-back" href="${K}">← Back</a>
      <article class="history-article">
        <p class="eyebrow">A short history</p>
        <h1>Fractals — <em>the geometry of roughness</em></h1>
        <p class="lede">Fractals are shapes that repeat their structure across scales. Zoom into a
          coastline, a fern, or the boundary of the Mandelbrot set and you keep finding detail —
          often echoes of the whole — no matter how far in you go. That single idea, self-similarity
          across scale, became one of the most quietly revolutionary concepts in modern mathematics.</p>

        <h2>Before the word existed <span class="years">1870s – 1920s</span></h2>
        <p>Long before anyone said "fractal," mathematicians kept meeting objects that broke their
          intuitions — curves with no tangents, sets with no length, dimensions that weren't whole
          numbers. They were called "monsters."</p>
        <p><strong>Weierstrass</strong> (1872) exhibited a function continuous <em>everywhere</em> yet
          differentiable <em>nowhere</em> — wrinkled at every scale. <strong>Cantor</strong> (1883)
          described a dust of zero length but uncountably many points. <strong>Peano</strong> and
          <strong>Hilbert</strong> (1890–91) built space-filling curves. <strong>von Koch</strong>
          (1904) drew an infinitely long boundary around a finite area. <strong>Sierpiński</strong>
          (1915–16) riddled triangles and carpets with holes at every scale. <strong>Hausdorff</strong>
          (1918) gave them the decisive tool — a dimension that need not be a whole number (the Koch
          curve's is ≈ 1.262). And <strong>Julia</strong> and <strong>Fatou</strong> (1917–19) studied
          iterating <em>z → z² + c</em>, finding sets too intricate to picture without computers.</p>

        <h2>Mandelbrot names it <span class="years">1960s – 1980s</span></h2>
        <p><strong>Benoît Mandelbrot</strong>, at IBM, saw these scattered "pathologies" as facets of
          one idea with enormous reach. His 1967 paper <em>"How Long Is the Coast of Britain?"</em> made
          the point unforgettable: a coastline has no single length — the closer you measure, the longer
          it gets — and its roughness has a fractional dimension. In 1975 he coined the word
          <strong>fractal</strong> (Latin <em>fractus</em>, "broken"), and <em>The Fractal Geometry of
          Nature</em> (1982) reframed fractals as a language for the irregular.</p>
        <p>The emblem of the field, the <strong>Mandelbrot set</strong>, emerged with the computers that
          could draw it: an early plot by <strong>Brooks and Matelski</strong> (1978), detailed images by
          Mandelbrot (~1980), and the deep theory of <strong>Douady and Hubbard</strong>, who proved it
          connected and gave it Mandelbrot's name.</p>

        <h2>Why fractals matter</h2>
        <p>Euclid's geometry describes smooth, ideal shapes; almost nothing in nature is smooth. Fractal
          dimension quantifies roughness — coastlines, mountains, lungs, lightning, river networks.
          Fractals are the <strong>shape of chaos</strong> (the strange attractors of dynamical systems
          such as <strong>Lorenz's</strong> 1963 weather model), the basis of <strong>image
          compression</strong> (Barnsley's IFS and his collage theorem, <em>Fractals Everywhere</em>,
          1988), of procedural <strong>plants and terrain</strong> in graphics (Lindenmayer's L-systems,
          1968), of <strong>fractal antennas</strong>, and of models of <strong>rough markets</strong>.
          Simple recursive rules, iterated to the limit, generate unbounded complexity — and that is
          often exactly what reality looks like.</p>

        <h2>The fractals in this explorer</h2>
        <div class="history-table">
          <div><b>Mandelbrot / Julia</b><span>Iterate z → z² + c; color by how fast each point escapes. The Mandelbrot set is the map of every Julia set at once.</span></div>
          <div><b>Multibrot</b><span>The same idea with a higher power, z → zⁿ + c — more lobes.</span></div>
          <div><b>Koch · Sierpiński · dragon · Hilbert · plant</b><span>L-systems: a string-rewriting rule drawn by a "turtle," producing curves of fractional dimension.</span></div>
          <div><b>Barnsley fern</b><span>An Iterated Function System — four random affine maps whose visit-density traces the fern.</span></div>
        </div>

        <p class="credit">Smooth coloring uses the continuous (Douady–Hubbard) iteration count through
          Inigo Quilez cosine palettes. Further reading: Mandelbrot, <em>The Fractal Geometry of
          Nature</em> (1982); Barnsley, <em>Fractals Everywhere</em> (1988); Peitgen, Jürgens &amp;
          Saupe, <em>Chaos and Fractals</em> (1992); Prusinkiewicz &amp; Lindenmayer, <em>The
          Algorithmic Beauty of Plants</em> (1990).</p>

        <a class="history-back bottom" href="${K}">← Back to the explorer</a>
      </article>
    </div>`};document.getElementById("boot-fallback")?.remove();const O=document.getElementById("view"),Ee=document.getElementById("hud"),te=document.getElementById("panel"),oe=document.getElementById("panel-toggle"),N=document.querySelector(".brand");N&&(N.insertAdjacentHTML("afterbegin",`<span class="brand-logo" aria-hidden="true">${re}</span>`),N.setAttribute("role","button"),N.setAttribute("tabindex","0"),N.setAttribute("aria-label","Home"),N.addEventListener("click",()=>ie(K)),N.addEventListener("keydown",t=>{(t.key==="Enter"||t.key===" ")&&(t.preventDefault(),ie(K))}));qt();Wt();const k=new Ft(O,J()),se=window.matchMedia("(prefers-reduced-motion: reduce)");let I="home",ce=null,V=null;if(!k.ok)Ee.style.display="none",D("WebGL2 is unavailable — the live explorer is disabled, but you can still browse.",5e3);else{const t=()=>{se.matches&&(k.scene.anim.motionScale=0,k.scene.anim.juliaOrbit=!1)};t(),se.addEventListener("change",t);const e=zt(),o=()=>{I==="explore"&&e(k.scene)},n=()=>k.render(),r=()=>ie(ae),a=()=>{const u=location.origin+location.pathname+X(U(k.scene));navigator.clipboard?navigator.clipboard.writeText(u).then(()=>D("Link copied")).catch(()=>D("Copy failed")):D("Copy not supported")},i=()=>{Nt(O,n),D("Image saved")},c=()=>{jt(O,n).then(u=>{u||i()})},l=()=>{document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen()};ce=It(k,o);const b=()=>{k.tourActive?k.stopTour():(k.startTour(),ce?.rebuild()),V?.setTourActive(k.tourActive)};V=Dt({onTour:b,onAbout:r,onSave:i,onShare:c,onFullscreen:l}),Pt(O,k,o),_t({tour:()=>{I==="explore"&&b()},about:r,fullscreen:()=>{I==="explore"&&l()},reset:()=>{I==="explore"&&(k.resetView(),o())},copy:()=>{I==="explore"&&a()},save:()=>{I==="explore"&&i()}});const p=()=>{const u=O.clientWidth||window.innerWidth,h=O.clientHeight||window.innerHeight;k.resize(u,h,window.devicePixelRatio||1)};let s=null;const y=()=>{p(),g()},g=()=>{s?.removeEventListener("change",y),s=window.matchMedia(`(resolution: ${window.devicePixelRatio||1}dppx)`),s.addEventListener("change",y)};window.addEventListener("resize",p),g(),p();const E=u=>{te.classList.toggle("hidden",u),oe.classList.toggle("show",u),oe.setAttribute("aria-label",u?"Show controls":"Hide controls")};oe.addEventListener("click",()=>E(!te.classList.contains("hidden"))),window.addEventListener("keydown",u=>{u.key==="Tab"&&I==="explore"&&!(u.target instanceof HTMLInputElement)&&!(u.target instanceof HTMLSelectElement)&&(u.preventDefault(),E(!te.classList.contains("hidden")))});const P=()=>{if(I!=="explore")return;const[u,h]=k.backingSize,v=k.magnification,f=v>=1e4?v.toExponential(1):v.toFixed(v<10?2:0),F=k.precisionWarn?'   <span class="warn">⚠ precision limit</span>':"";Ee.innerHTML=`${k.fps.toFixed(0)} fps   ×${f}   ${u}×${h}${F}`,V?.setTourActive(k.tourActive)};window.setInterval(P,200),new St(k).start()}const ze=()=>{const t=Ot(location.hash);if(I=t.name,document.body.classList.toggle("route-home",t.name==="home"),document.body.classList.toggle("route-explore",t.name==="explore"),document.body.classList.toggle("route-history",t.name==="history"),k.ok)if(t.name==="explore"){if(t.query){const e=Lt(t.query);e&&k.adoptScene(e)}ce?.rebuild(),V?.setTourActive(k.tourActive)}else t.name==="home"&&!k.tourActive&&!se.matches&&(k.startTour(),V?.setTourActive(!0));t.name==="home"&&document.getElementById("home")?.scrollTo({top:0}),t.name==="history"&&document.getElementById("history")?.scrollTo({top:0})};window.addEventListener("hashchange",ze);ze();
//# sourceMappingURL=index-BCejGmxe.js.map
