import type { WebGLRenderer } from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

/**
 * A GLTFLoader wired for models produced by `pnpm optimize:3d`
 * (Meshopt or Draco geometry, KTX2 textures). Decoder files are copied to
 * /decoders by scripts/copy-decoders.mjs before dev and build.
 */
export function createGLTFLoader(renderer: WebGLRenderer): GLTFLoader {
  const draco = new DRACOLoader().setDecoderPath('/decoders/draco/');
  const ktx2 = new KTX2Loader().setTranscoderPath('/decoders/basis/').detectSupport(renderer);
  return new GLTFLoader()
    .setDRACOLoader(draco)
    .setKTX2Loader(ktx2)
    .setMeshoptDecoder(MeshoptDecoder);
}
