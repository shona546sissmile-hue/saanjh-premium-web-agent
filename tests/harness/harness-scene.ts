import {
  IcosahedronGeometry,
  Mesh,
  PerspectiveCamera,
  Scene,
  ShaderMaterial,
  WebGLRenderer,
} from 'three';
import { configureRenderer, observeCanvasSize } from '@/lib/three/renderer';
import type { SceneContext } from '@/lib/three/lazy-scene';
import fragmentShader from './shaders/gradient.frag';
import vertexShader from './shaders/gradient.vert';

/** Test fixture: exercises the SceneModule contract. Not shipped in production. */
export function mount({
  canvas,
  reducedMotion,
  onReducedMotionChange,
  onVisibilityChange,
}: SceneContext) {
  const renderer = new WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });
  configureRenderer(renderer);

  const scene = new Scene();
  const camera = new PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.z = 4;

  const material = new ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: { uTime: { value: 0 } },
  });
  const mesh = new Mesh(new IcosahedronGeometry(1, 24), material);
  scene.add(mesh);

  let reduced = reducedMotion;
  let visible = false;
  const render = () => renderer.render(scene, camera);

  const loop = (time: number) => {
    const uTime = material.uniforms['uTime'];
    if (uTime) uTime.value = time / 1000;
    mesh.rotation.y = time / 4000;
    render();
  };
  const sync = () => {
    renderer.setAnimationLoop(visible && !reduced ? loop : null);
    if (reduced) render();
  };

  const stopResize = observeCanvasSize(canvas, (width, height) => {
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    render();
  });
  onReducedMotionChange((value) => {
    reduced = value;
    sync();
  });
  onVisibilityChange((value) => {
    visible = value;
    sync();
  });
  render();

  return () => {
    stopResize();
    renderer.setAnimationLoop(null);
    mesh.geometry.dispose();
    material.dispose();
    renderer.dispose();
  };
}
