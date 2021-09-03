
precision mediump float;
uniform float uTime;
varying vec2 vUv;

void main() {
  vec3 col = 0.5 + 0.5*cos(uTime + vUv.xyx + vec3(0,2,4));
  gl_FragColor = vec4(col, 1);
}