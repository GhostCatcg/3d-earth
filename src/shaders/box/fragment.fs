
precision mediump float;
uniform float uTime;
varying vec2 vUv;

void main() {
  gl_FragColor = vec4(sin(uTime) * vUv.x * 0.5, cos(uTime) * 0.5 + 0.2, 0.8, 1);
}