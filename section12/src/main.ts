import * as THREE from "three";
import {
  FontLoader,
  OrbitControls,
  TextGeometry,
} from "three/examples/jsm/Addons.js";

function main() {
  // Canvas
  const canvas = document.querySelector("canvas#canvas");

  if (!canvas || !(canvas instanceof HTMLElement)) {
    return;
  }

  // Renderer
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Scene
  const scene = new THREE.Scene();

  // Camera
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(0, 0, 3);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // Texture
  const textureLoader = new THREE.TextureLoader();
  const matcap = textureLoader.load("/matcap.png");

  /**
   * Text
   */
  // Load Font
  const loader = new FontLoader();
  loader.load("/pretendard_regular.json", (font) => {
    {
      const geometry = new TextGeometry("안녕하세요.", {
        font,
        size: 0.2,
        depth: 0.1,
      });
      geometry.center();
      const material = new THREE.MeshMatcapMaterial({
        matcap,
      });
      const text = new THREE.Mesh(geometry, material);

      scene.add(text);

      // objects
      const donutGeometry = new THREE.TorusGeometry(0.2, 0.2, 20, 45);
      const donutMaterial = new THREE.MeshMatcapMaterial({
        matcap,
      });
      for (let i = 0; i < 1000; i++) {
        const donut = new THREE.Mesh(donutGeometry, donutMaterial);
        donut.position.set(
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10
        );

        donut.rotation.x = Math.PI * Math.random();
        donut.rotation.y = Math.PI * Math.random();

        const randomScale = Math.random();
        donut.scale.set(randomScale, randomScale, randomScale);

        scene.add(donut);
      }
    }
  });

  // Event
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  function render() {
    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  render();
}

main();
