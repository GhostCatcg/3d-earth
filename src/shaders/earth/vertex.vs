
varying vec2 vUv;
varying vec3 ys_vNormal;
varying vec3 ys_vp;
varying vec3 ys_vPositionNormal;
void main(void){
  vUv = uv;
  ys_vNormal = normalize( normalMatrix * normal ); // 转换到视图空间
  ys_vp = position;
  ys_vPositionNormal = normalize(( modelViewMatrix * vec4(position, 1.0) ).xyz);
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}