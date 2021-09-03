
precision mediump float;
uniform float uTime;
varying vec2 vUv;

void main() {
  gl_FragColor = vec4((sin(uTime) + 1.0) * vUv.x, (sin(uTime) + 1.0) * vUv.y, 0.8, 1);
}