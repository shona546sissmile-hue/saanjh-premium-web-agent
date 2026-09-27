varying vec3 vNormal;

void main() {
  float light = dot(normalize(vNormal), normalize(vec3(0.4, 0.8, 0.6))) * 0.5 + 0.5;
  gl_FragColor = vec4(mix(vec3(0.12, 0.08, 0.2), vec3(0.95, 0.6, 0.35), light), 1.0);
}
