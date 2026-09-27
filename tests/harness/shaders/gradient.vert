uniform float uTime;
varying vec3 vNormal;

void main() {
  vNormal = normalMatrix * normal;
  vec3 p = position + normal * 0.04 * sin(uTime + position.y * 4.0);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
