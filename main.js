import * as Three from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";

let textMaterial;
let donutMaterial;

let sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const materialLoader = new Three.TextureLoader();
const matcapTexture = materialLoader.load("/5.png");
const scene = new Three.Scene();
const camera = new Three.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
);
const renderer = new Three.WebGLRenderer();

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// const geometry = new Three.BoxGeometry();
// const material = new Three.MeshBasicMaterial({ color: 0x00ff00 });
// const cube = new Three.Mesh(geometry, material);
// scene.add(cube);

camera.position.z = 5;

const fontLoader = new FontLoader();

fontLoader.load(
  "/helvetiker_regular.typeface.json",
  (font) => {
    console.log("font", font);
    const textGeometry = new TextGeometry("Moghariya Rahul", {
      font: font,
      size: 0.4,
      height: 0.1,
      curveSegments: 6,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 5,
    });
    textGeometry.center();

    textMaterial = new Three.MeshMatcapMaterial({
      matcap: matcapTexture,
    });

    const text = new Three.Mesh(textGeometry, textMaterial);
    scene.add(text);

    const donutGeometry = new Three.TorusGeometry(0.3, 0.2, 20, 45);
    donutMaterial = new Three.MeshMatcapMaterial({
      matcap: matcapTexture,
    });

    for (let i = 0; i < 200; i++) {
      const donut = new Three.Mesh(donutGeometry, donutMaterial);
      donut.position.x = (Math.random() - 0.5) * 50;
      donut.position.y = (Math.random() - 0.5) * 10;
      donut.position.z = (Math.random() - 0.5) * 10;

      donut.rotation.x = Math.random() * Math.PI;
      donut.rotation.y = Math.random() * Math.PI;

      const scale = Math.random();
      donut.scale.set(scale, scale, scale);

      scene.add(donut);
    }
  },
  (err) => {
    console.log("prr", err);
  },
  (err) => {
    console.log("err", err);
  }
);

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const clock = new Three.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  if (textMaterial) {
  }

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
});

function updateTextures(newTexture) {
  if (textMaterial) {
    textMaterial.matcap = newTexture;
    textMaterial.needsUpdate = true;
  }

  if (donutMaterial) {
    donutMaterial.matcap = newTexture;
    donutMaterial.needsUpdate = true;
  }

  renderer.render(scene, camera); // Re-render the scene
}

document.getElementById("swiper").addEventListener("click", function (event) {
  // Check if the clicked element is a swiper-slide or an img within a swiper-slide
  if (event.target.tagName === "IMG") {
    const imgSrc = event.target.getAttribute("src");
    const newTexture = materialLoader.load(imgSrc);
    updateTextures(newTexture);
  }
});

tick();
