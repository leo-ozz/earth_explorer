import * as THREE from "three";
import { GLTFLoader, TTFLoader, Font } from "three/examples/jsm/Addons.js";
import getStarfield from "./getStarfield";
import createText from "./createText";
import { getFresnelMat } from "./getFresnelMat";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

let camera;
const cameraOffset = 3;
const earthGroup = new THREE.Group();
const aircraftOrbiter = new THREE.Object3D();
const aircraft = new THREE.Object3D();
const aircraftOffset = 1.1;

let controls;

export default class StartScene extends THREE.Scene {
  constructor(canvas) {
    super();
    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / innerHeight,
      0.1,
      200
    );

    controls = new OrbitControls(camera, canvas);
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.25;
    controls.enablePan = false;
    controls.maxDistance = 50;

    //======= EARTH COMPONENTS ========
    earthGroup.rotation.z = (-23.4 * Math.PI) / 180;

    const loader = new THREE.TextureLoader();
    const earthGeo = new THREE.IcosahedronGeometry(1, 12);
    const earthMat = new THREE.MeshStandardMaterial({
      map: loader.load("src/assets/textures/startScene/8081_earthmap4k.jpg"),
    });
    const earth = new THREE.Mesh(earthGeo, earthMat);
    earthGroup.add(earth);

    const cloudsMat = new THREE.MeshStandardMaterial({
      map: loader.load(
        "src/assets/textures/startScene/8081_earthhiresclouds4K.jpg"
      ),
      blending: THREE.AdditiveBlending,
    });
    const clouds = new THREE.Mesh(earthGeo, cloudsMat);
    clouds.scale.setScalar(1.002);
    clouds.name = "clouds";
    earthGroup.add(clouds);

    const fresnelMat = getFresnelMat({ rimHex: 0x00aaff });
    const atmosphere = new THREE.Mesh(earthGeo, fresnelMat);
    atmosphere.scale.setScalar(1.01);
    earthGroup.add(atmosphere);
    this.add(earthGroup);

    //======= OTHER COMPONENTS =======
    const stars = getStarfield({ numStars: 2000 });
    this.add(stars);

    const sunLight = new THREE.DirectionalLight(0xffffff, 0.8);
    sunLight.position.set(3, 0.5, 0.5);
    camera.add(sunLight);

    camera.position.z = cameraOffset;
    this.add(camera);

    //load text
    const ttfLoader = new TTFLoader();
    ttfLoader.load("src/assets/fonts/miso-bold.ttf", (json) => {
      const font = new Font(json);
      const { textObj, centerOffset } = createText({
        font,
        message: "Earth Explorer",
        size: 0.5,
        depth: 0.15,
      });
      textObj.position.set(centerOffset, 1.5, -cameraOffset);
      textObj.rotation.x = 0.15;
      camera.add(textObj);
    });

    //load airplane
    const gltfLoader = new GLTFLoader();
    gltfLoader.load("src/assets/models/airplane_1.glb", (gltf) => {
      aircraft.add(gltf.scene);
      aircraft.position.x = aircraftOffset;
      aircraft.scale.setScalar(0.08);
      aircraft.rotation.set(-(Math.PI / 2), 0, -(Math.PI / 2));
      aircraftOrbiter.add(aircraft);
      this.add(aircraftOrbiter);
    });
  }

  get camera() {
    return camera;
  }

  set camera(camera) {
    this._camera = camera;
  }

  set controls(controls) {
    this._controls = controls;
  }

  toggleControls() {
    if (controls.enabled == true) {
      controls.enabled = false;
    } else {
      controls.enabled = true;
    }
  }

  animate() {
    earthGroup.rotation.y += 0.002;
    earthGroup.children.find(
      (child) => (child.name = "clouds")
    ).rotation.y += 0.0005;

    aircraftOrbiter.rotation.y -= 0.013;
    //aircraftOrbiter.rotation.x -= 0.01;  NOT WORKING

    controls.update();

    const distCameraPlane = aircraft.position.distanceTo(camera.position);
    return distCameraPlane;
  }
}
