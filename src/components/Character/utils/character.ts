import * as THREE from "three";
import { DRACOLoader, GLTF, GLTFLoader } from "three-stdlib";
import { decryptFile } from "./decrypt";

const setCharacter = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) => {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  loader.setDRACOLoader(dracoLoader);

  const loadCharacter = () => {
    return new Promise<GLTF>((resolve, reject) => {
      void decryptFile("/models/character.enc", "Character3D#@").then(
        (encryptedBlob) => {
          const blobUrl = URL.createObjectURL(new Blob([encryptedBlob]));
          loader.load(
            blobUrl,
            async (gltf) => {
              try {
                const character = gltf.scene;
                await renderer.compileAsync(character, camera, scene);
                character.traverse((object) => {
                  if (!(object instanceof THREE.Mesh)) return;
                  object.castShadow = false;
                  object.receiveShadow = false;
                  object.frustumCulled = true;
                  if (!Array.isArray(object.material)) {
                    (object.material as THREE.ShaderMaterial).precision = "mediump";
                  }
                });
                const rightFoot = character.getObjectByName("footR");
                const leftFoot = character.getObjectByName("footL");
                if (rightFoot) rightFoot.position.y = 3.36;
                if (leftFoot) leftFoot.position.y = 3.36;
                resolve(gltf);
              } catch (error) {
                reject(error);
              } finally {
                URL.revokeObjectURL(blobUrl);
                dracoLoader.dispose();
              }
            },
            undefined,
            (error) => {
              URL.revokeObjectURL(blobUrl);
              dracoLoader.dispose();
              reject(error);
            }
          );
        },
        reject
      );
    });
  };

  return { loadCharacter };
};

export default setCharacter;
