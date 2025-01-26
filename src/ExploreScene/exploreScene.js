import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { drawGeoJSON } from "./drawGeoJSON";
import getStarfield from "../StartScene/getStarfield";

//controls source: https://github.com/tamani-coding/threejs-character-controls-example/blob/main/src/characterControls.ts

var camera, orbitControls, velocity;
let boost = { state: false, lastInput: false };
let clickMode = { state: false, lastInput: false };
const boostVelocity = 10;
const normalVelocity = 4;
const verticalVelocity = boost.state ? normalVelocity / 4 : boostVelocity / 4;
const minHeight = 1;
const maxHeight = 30;
const directions = ["w", "a", "s", "d"];

const airplane = new THREE.Object3D();
const flyDirection = new THREE.Vector3();
const rotateAngle = new THREE.Vector3(0, 1, 0);
const rotateQuaternion = new THREE.Quaternion();
const cameraTarget = new THREE.Vector3();

export default class ExploreScene extends THREE.Scene {
  constructor(canvas) {
    super();
    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / innerHeight,
      0.1,
      200
    );
    camera.position.set(0, 1, 2);
    this.add(camera);

    // const axesHelper = new THREE.AxesHelper(3);
    // this.add(axesHelper);

    orbitControls = new OrbitControls(camera, canvas);
    orbitControls.enableDamping = true;
    orbitControls.minDistance = 5;
    orbitControls.maxDistance = 10;
    orbitControls.enablePan = false;
    orbitControls.maxPolarAngle = Math.PI / 2 - 0.05;
    orbitControls.update();

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.add(ambientLight);
    const dirLight = new THREE.DirectionalLight();
    this.add(dirLight);

    const stars = getStarfield({ numStars: 5000, minRadius: 250 });
    this.add(stars);

    //dummy to showcase quiz functionality
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshStandardMaterial({
      color: 0xffff00,
      flatShading: true,
    });
    const dummyButton = new THREE.Mesh(geometry, material);
    dummyButton.name = "Germany"; //give name to build URL
    this.add(dummyButton);

    this.add(loadMap());
    const countryPolygons = loadCountryBorders();
    //this.add(countryPolygons);   //DRAWING NOT WORKING
    loadAirplane();
    this.add(airplane);
  }

  get camera() {
    return camera;
  }

  set camera(camera) {
    this._camera = camera;
  }

  get clickMode() {
    return clickMode;
  }

  toggleControls() {
    if (controls.enabled == true) {
      controls.enabled = false;
    } else {
      controls.enabled = true;
    }
  }

  animate(delta, keysPressed) {
    //handle toggles
    handleToggleInputs(keysPressed);

    if (clickMode.state == false) {
      orbitControls.enabled = true;
      orbitControls.update();
    }

    //handle vertical movement (y)
    if (keysPressed[" "] || keysPressed["capslock"]) {
      const moveY = verticalChange(delta, keysPressed);
      airplane.position.y = moveY;
      camera.position.y = moveY + 1;
      cameraTarget.x = airplane.position.x;
      cameraTarget.y = airplane.position.y + 1;
      cameraTarget.z = airplane.position.z;
      orbitControls.target = cameraTarget;
    }

    //handle horizontal movement (x, z)
    if (directions.some((key) => keysPressed[key] == true)) {
      //compute angle between camera and model
      const angleDiff = Math.atan2(
        camera.position.x - airplane.position.x,
        camera.position.z - airplane.position.z
      );

      //compute angle offset depending on pressed keys
      const offset = directionOffset(keysPressed);

      //rotate model
      rotateQuaternion.setFromAxisAngle(
        rotateAngle,
        angleDiff + offset + Math.PI / 2
      );
      airplane.quaternion.rotateTowards(rotateQuaternion, 0.2);

      //calculate direction
      camera.getWorldDirection(flyDirection);
      flyDirection.y = 0;
      flyDirection.normalize(); //so we can apply angleOffset
      flyDirection.applyAxisAngle(rotateAngle, offset);

      //move model + camera
      velocity = boost.state ? boostVelocity : normalVelocity;
      const moveX = flyDirection.x * velocity * delta;
      const moveZ = flyDirection.z * velocity * delta;
      airplane.position.x += moveX;
      airplane.position.z += moveZ;
      updateCameraTarget(moveX, moveZ);
    }
    orbitControls.update();
    const distCameraPlane = airplane.position.distanceTo(camera.position);
    return distCameraPlane;
  }
}

function handleToggleInputs(keysPressed) {
  //boost toggle
  if (keysPressed["shift"] && !boost.lastInput) {
    switchToggleState(boost);

    //switch button text and color
    let mode = boost.state ? "on" : "off";
    let color = boost.state ? "#84da81" : "#fa9d96";
    const boostDiv = document.getElementById("boost");
    boostDiv.innerText = "Boost: " + mode;
    boostDiv.style.background = color;
  }
  boost.lastInput = keysPressed["shift"];

  //clickMode toggle
  if (keysPressed["e"] && !clickMode.lastInput) {
    switchToggleState(clickMode);
    orbitControls.enabled = false;

    //switch button text and color
    let mode = clickMode.state ? "on" : "off";
    let color = clickMode.state ? "#84da81" : "#fa9d96";
    const clickModeDiv = document.getElementById("clickMode");
    clickModeDiv.innerText = "Click mode: " + mode;
    clickModeDiv.style.background = color;
  }
  clickMode.lastInput = keysPressed["e"];
}

function switchToggleState(toggle) {
  toggle.state = !toggle.state;
}

//load model
function loadAirplane() {
  const gltfLoader = new GLTFLoader();
  gltfLoader.load("src/assets/models/airplane_1.glb", (gltf) => {
    gltf.scene.scale.setScalar(0.8);
    airplane.add(gltf.scene);
    airplane.rotation.y = Math.PI / 2;
    airplane.position.y = 1;
    airplane.castShadow = true;
    airplane.receiveShadow = true;
  });
}

//earth map with height map as displacement map
function loadMap() {
  const loader = new THREE.TextureLoader();
  const mapGeo = new THREE.PlaneGeometry(400, 400, 1440, 720);
  const mapMat = new THREE.MeshStandardMaterial({
    map: loader.load("src/assets/textures/exploreScene/earth_color.jpg"),
  });
  const heightMap = loader.load(
    "src/assets/textures/exploreScene/earth_height.jpg"
  );
  mapMat.displacementMap = heightMap;
  mapMat.displacementScale = 4.5;
  const map = new THREE.Mesh(mapGeo, mapMat);
  map.rotation.x = -Math.PI / 2;
  map.position.y = -1;
  map.receiveShadow = true;
  return map;
}

//load polygons of country border to a plane
function loadCountryBorders() {
  let geometry = new THREE.PlaneGeometry(20, 20, 360, 360);
  let material = new THREE.MeshBasicMaterial({
    color: 0x111111,
    wireframe: false,
    side: THREE.DoubleSide,
  });
  let borderMap = new THREE.Mesh(geometry, material);

  fetch("src/assets/countries.json")
    .then((response) => response.text())
    .then((text) => {
      const data = JSON.parse(text);
      //json, materialOptions, container
      drawGeoJSON(
        data,
        {
          color: 0xffffff,
          side: THREE.DoubleSide,
        },
        borderMap
      );
    });
  console.log(borderMap);
  return borderMap;
}

function updateCameraTarget(moveX, moveZ) {
  // move camera
  camera.position.x += moveX;
  camera.position.z += moveZ;

  // update camera target
  cameraTarget.x = airplane.position.x;
  cameraTarget.y = airplane.position.y + 1;
  cameraTarget.z = airplane.position.z;
  orbitControls.target = cameraTarget;
}

function directionOffset(keysPressed) {
  var directionOffset = 0; // w

  if (keysPressed["w"]) {
    if (keysPressed["a"]) {
      directionOffset = Math.PI / 4; // w+a
    } else if (keysPressed["d"]) {
      directionOffset = -Math.PI / 4; // w+d
    }
  } else if (keysPressed["s"]) {
    if (keysPressed["a"]) {
      directionOffset = Math.PI / 4 + Math.PI / 2; // s+a
    } else if (keysPressed["d"]) {
      directionOffset = -Math.PI / 4 - Math.PI / 2; // s+d
    } else {
      directionOffset = Math.PI; // s
    }
  } else if (keysPressed["a"]) {
    directionOffset = Math.PI / 2; // a
  } else if (keysPressed["d"]) {
    directionOffset = -Math.PI / 2; // d
  }

  return directionOffset;
}

function verticalChange(delta, keysPressed) {
  let verticalChange = 0; // space + capslock
  const oldY = airplane.position.y;

  if (keysPressed[" "] && !keysPressed["capslock"]) {
    verticalChange = verticalVelocity; // space
  } else if (keysPressed["capslock"] && !keysPressed[" "]) {
    verticalChange = -verticalVelocity; // capslock
  }

  const newY = verticalChange * delta + oldY;
  if (newY < minHeight || newY > maxHeight) {
    return oldY;
  }

  return newY;
}
