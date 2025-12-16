import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import GUI from "lil-gui";

function main() {
  const canvas = document.querySelector("canvas#canvas");

  if (!canvas || !(canvas instanceof HTMLElement)) {
    return;
  }

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Scene
  const scene = new THREE.Scene();

  // Camera
  const camera = new THREE.PerspectiveCamera(
    75,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    100
  );
  camera.position.set(1, 1, 2);

  /**
   * Objects
   */
  const material = new THREE.MeshStandardMaterial({
    roughness: 0.4,
  });

  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
  );
  sphere.position.x = -1.5;

  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    material
  );

  const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material
  );
  torus.position.x = 1.5;

  const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
  plane.rotation.x = Math.PI * -0.5;
  plane.position.y = -0.65;

  scene.add(sphere, cube, torus, plane);

  /**
   * Lights
   */
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffcc, 0.3);
  directionalLight.castShadow = true;
  renderer.shadowMap.enabled = true;
  sphere.castShadow = true;
  cube.castShadow = true;
  torus.castShadow = true;
  plane.receiveShadow = true;
  scene.add(directionalLight);

  const hemisphereLight = new THREE.HemisphereLight(0x0000ff, 0xff0000, 0.9);
  scene.add(hemisphereLight);

  const pointLight = new THREE.PointLight(0xff9000, 1.5);
  pointLight.distance = 3;
  scene.add(pointLight);

  const rectAreaLight = new THREE.RectAreaLight(0xffffff, 2, 1, 1);
  rectAreaLight.position.set(-1.5, 0, 1.5);
  rectAreaLight.lookAt(new THREE.Vector3());
  scene.add(rectAreaLight);

  const spotLight = new THREE.SpotLight(
    0xffffff,
    1.5,
    3,
    Math.PI * 0.25,
    0.25,
    0
  );
  scene.add(spotLight);
  scene.add(spotLight.target);

  // Controls
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;

  // Axes Helper
  const axesHelper = new THREE.AxesHelper();
  scene.add(axesHelper);

  // Debug
  const gui = new GUI();
  const ambientLightFolder = gui.addFolder("AmbientLight");
  ambientLightFolder.add(ambientLight, "intensity").min(0).max(3).step(0.01);

  const rectAreaLightFolder = gui.addFolder("RectAreaLight");
  rectAreaLightFolder.add(rectAreaLight.position, "x").step(0.02);
  rectAreaLightFolder.add(rectAreaLight.position, "y").step(0.02);
  rectAreaLightFolder.add(rectAreaLight.position, "z").step(0.02);

  const spotLightFolder = gui.addFolder("SpotLight");
  spotLightFolder.add(spotLight.position, "x").step(0.02);
  spotLightFolder.add(spotLight.position, "y").step(0.02);
  spotLightFolder.add(spotLight.position, "z").step(0.02);

  // Event
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  /**
   * Animate
   */
  const clock = new THREE.Clock();

  function render() {
    const elapsedTime = clock.getElapsedTime();

    // Update Objects
    sphere.rotation.x = 0.15 * elapsedTime;
    sphere.rotation.y = 0.1 * elapsedTime;

    cube.rotation.x = 0.15 * elapsedTime;
    cube.rotation.y = 0.1 * elapsedTime;

    torus.rotation.x = 0.15 * elapsedTime;
    torus.rotation.y = 0.1 * elapsedTime;

    controls.update();

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  render();
}

main();
