// uniform mat4 projectionMatrix; // 矩阵将坐标转换为剪辑空间坐标
// uniform mat4 viewMatrix; // 应用相对于相机的转换(位置，旋转，视野，近，远)
// uniform mat4 modelMatrix; // 应用相对于网格的转换(位置，旋转，比例)
// attribute vec3 position;
// attribute vec2 uv;

// vscode 检测飘红不用管，这些用ShaderMaterial自动会引入

varying vec2 vUv;

void main() {

  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;

  vUv = uv;

}