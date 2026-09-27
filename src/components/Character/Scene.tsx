import { useEffect, useRef } from "react";
import * as THREE from "three";
import setCharacter from "./utils/character";
import setLighting from "./utils/lighting";
import { useLoading } from "../../context/LoadingProvider";
import handleResize from "./utils/resizeUtils";
import {
  handleMouseMove,
  handleTouchEnd,
  handleHeadRotation,
  handleTouchMove,
} from "./utils/mouseUtils";
import setAnimations from "./utils/animationUtils";
import { setProgress } from "../Loading";
import { setAllTimeline, setCharTimeline } from "../utils/GsapScroll";

const Scene = () => {
  const canvasDiv = useRef<HTMLDivElement | null>(null);
  const hoverDivRef = useRef<HTMLDivElement>(null);
  const { setLoading } = useLoading();

  useEffect(() => {
    const host = canvasDiv.current;
    if (!host) return;

    let disposed = false;
    let visible = false;
    let frameId: number | null = null;
    let character: THREE.Object3D | null = null;
    let mixer: THREE.AnimationMixer | undefined;
    let screenLight: THREE.Object3D | null = null;
    let touchTarget: HTMLElement | null = null;
      let cleanupTouchReset = () => {};
    let cleanupHover = () => {};
    let cleanupCharacterTimeline = () => {};
    let cleanupAllTimeline = () => {};
    let cleanupIntro = () => {};
    const scene = new THREE.Scene();
    const rect = host.getBoundingClientRect();
    const container = { width: rect.width, height: rect.height };
    const aspect = container.width / container.height;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: window.devicePixelRatio < 2,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.width, container.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    host.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(14.5, aspect, 0.1, 1000);
    camera.position.z = 10;
    camera.position.set(0, 13.1, 24.7);
    camera.zoom = 1.1;
    camera.updateProjectionMatrix();

    let headBone: THREE.Object3D | null = null;
    const clock = new THREE.Clock();
    const light = setLighting(scene);
    const progress = setProgress(setLoading);
    const { loadCharacter } = setCharacter(renderer, scene, camera);

    const resizeHandler = () => {
      if (character) handleResize(renderer, camera, canvasDiv);
    };
    const onMouseMove = (event: MouseEvent) => {
      handleMouseMove(event, (x, y) => (mouse = { x, y }));
    };
    let mouse = { x: 0, y: 0 };
    let interpolation = { x: 0.1, y: 0.2 };
    let touchTimer: number | undefined;
    const onTouchMove = (event: TouchEvent) => {
      handleTouchMove(event, (x, y) => (mouse = { x, y }));
    };
    const onTouchStart = (event: TouchEvent) => {
      touchTarget = event.target as HTMLElement;
      touchTimer = window.setTimeout(() => {
        touchTarget?.addEventListener("touchmove", onTouchMove, { passive: true });
      }, 200);
    };
    const onTouchEnd = () => {
      if (touchTimer !== undefined) window.clearTimeout(touchTimer);
      touchTarget?.removeEventListener("touchmove", onTouchMove);
      touchTarget = null;
      cleanupTouchReset();
      cleanupTouchReset = handleTouchEnd((x, y, interpolationX, interpolationY) => {
        mouse = { x, y };
        interpolation = { x: interpolationX, y: interpolationY };
      });
      cleanupTouchReset();
    };
    const landingDiv = document.getElementById("landingDiv");

    const render = () => {
      frameId = null;
      if (disposed || !visible) return;
      if (headBone) {
        handleHeadRotation(
          headBone,
          mouse.x,
          mouse.y,
          interpolation.x,
          interpolation.y,
          THREE.MathUtils.lerp
        );
        light.setPointLight(screenLight);
      }
      mixer?.update(clock.getDelta());
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(render);
    };
    const intersectionObserver = "IntersectionObserver" in window
      ? new IntersectionObserver(([entry]) => {
          visible = entry.isIntersecting;
          if (visible) {
            clock.start();
            if (frameId === null) frameId = requestAnimationFrame(render);
          } else if (frameId !== null) {
            cancelAnimationFrame(frameId);
            frameId = null;
          }
        })
      : null;
    intersectionObserver?.observe(host);
    if (!intersectionObserver) {
      visible = true;
      frameId = requestAnimationFrame(render);
    }

    document.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("resize", resizeHandler, { passive: true });
    landingDiv?.addEventListener("touchstart", onTouchStart, { passive: true });
    landingDiv?.addEventListener("touchend", onTouchEnd, { passive: true });

    const loadTimeout = window.setTimeout(() => progress.clear(), 20000);
    void loadCharacter()
      .then((gltf) => {
        if (!gltf) return;
        if (disposed) {
          disposeCharacter(gltf.scene);
          return;
        }
        const animations = setAnimations(gltf);
        if (hoverDivRef.current) {
          cleanupHover = animations.hover(gltf, hoverDivRef.current) ?? (() => {});
        }
        mixer = animations.mixer;
        character = gltf.scene;
        scene.add(character);
        headBone = character.getObjectByName("spine006") || null;
        screenLight = character.getObjectByName("screenlight") || null;
        cleanupCharacterTimeline = setCharTimeline(character, camera);
        cleanupAllTimeline = setAllTimeline();
        resizeHandler();
        if (loadTimeout !== undefined) window.clearTimeout(loadTimeout);
        progress.loaded().then(() => {
          if (!disposed) {
            light.turnOnLights();
            cleanupIntro = animations.startIntro() ?? (() => {});
          }
        });
      })
      .catch(() => {
        if (!disposed) progress.clear();
        if (loadTimeout !== undefined) window.clearTimeout(loadTimeout);
      });

    return () => {
      disposed = true;
      if (frameId !== null) cancelAnimationFrame(frameId);
      if (touchTimer !== undefined) window.clearTimeout(touchTimer);
      if (loadTimeout !== undefined) window.clearTimeout(loadTimeout);
      progress.cancel();
      intersectionObserver?.disconnect();
      document.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", resizeHandler);
      landingDiv?.removeEventListener("touchstart", onTouchStart);
      landingDiv?.removeEventListener("touchend", onTouchEnd);
      touchTarget?.removeEventListener("touchmove", onTouchMove);
      cleanupHover();
      cleanupIntro();
      cleanupCharacterTimeline();
      cleanupAllTimeline();
      mixer?.stopAllAction();
      if (character) disposeCharacter(character);
      scene.clear();
      renderer.dispose();
      host.removeChild(renderer.domElement);
    };
  }, [setLoading]);

  return (
    <>
      <div className="character-container">
        <div className="character-model" ref={canvasDiv}>
          <div className="character-rim"></div>
          <div className="character-hover" ref={hoverDivRef}></div>
        </div>
      </div>
    </>
  );
};

export default Scene;

function disposeCharacter(character: THREE.Object3D) {
  character.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;
    object.geometry.dispose();
    const materials = Array.isArray(object.material)
      ? object.material
      : [object.material];
    materials.forEach((material) => {
      Object.values(material).forEach((value) => {
        if (value instanceof THREE.Texture) value.dispose();
      });
      material.dispose();
    });
  });
}
