import * as THREE from "three";
import StartScene from "./StartScene/startScene";
import ExploreScene from "./ExploreScene/exploreScene";
import { getCountryByClick } from "./ExploreScene/getCountryByClick";

let currentScene, currentCamera;
let score = 0;

const canvas = document.querySelector("canvas.threejs");
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);

//init scene
const startScene = new StartScene(renderer.domElement);
const exploreScene = new ExploreScene(renderer.domElement);
updateCurrentScene(startScene);

//add audio to current camera
const listener = new THREE.AudioListener();
currentCamera.add(listener);

const audioLoader = new THREE.AudioLoader();
const backgroundTrack = new THREE.Audio(listener);
audioLoader.load("src/assets/sounds/search_the_world.mp3", (buffer) => {
  backgroundTrack.setBuffer(buffer);
  backgroundTrack.setLoop(true);
  backgroundTrack.setVolume(0.1);
  //backgroundTrack.play();
});

const planeSound = new THREE.PositionalAudio(listener);
audioLoader.load("src/assets/sounds/plane_sound.mp3", (buffer) => {
  planeSound.setBuffer(buffer);
  planeSound.setLoop(true);
  planeSound.setVolume(0.015);
  planeSound.setDistanceModel("exponential");
  planeSound.setRolloffFactor(100.0);
  //planeSound.play();
});

function updateCurrentScene(scene) {
  currentScene = scene;
  currentCamera = scene.camera;
  handleResize();
}

function handleResize() {
  currentCamera.aspect = window.innerWidth / window.innerHeight;
  currentScene.camera = currentCamera;
  currentCamera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function setVolume() {}

// ======= EVENT LISTENER =======
window.addEventListener("resize", handleResize);

//key listener
const keysPressed = {};
document.addEventListener(
  "keydown",
  (event) => {
    keysPressed[event.key.toLowerCase()] = true;
  },
  false
);

document.addEventListener(
  "keyup",
  (event) => {
    keysPressed[event.key.toLowerCase()] = false;
  },
  false
);

//Begin quiz logic
const contentDiv = document.getElementById("content");
const confirmationDiv = document.getElementById("confirmation");
const infoDiv = document.getElementById("info");
const quizDiv = document.getElementById("quiz");
const dataDiv = document.getElementById("data");

document.addEventListener(
  "click",
  (event) => {
    if (currentScene.id == startScene.id) {
      return;
    }
    if (currentScene.clickMode.state == false) {
      return;
    }
    if (
      contentDiv.style.display == "none" &&
      confirmationDiv.style.display == "none"
    ) {
      const country = getCountryByClick(
        event,
        window,
        currentCamera,
        currentScene
      );
      if (country != null) {
        const url = "https://en.wikipedia.org/wiki/" + country.name;
        console.log("opening page with url: " + url);

        const infoFrame = document.getElementById("infoIFrame");
        infoFrame.src = url;
        toggleDisplay([confirmationDiv]);
      }
    }
  },
  false
);

//buttons
const startButton = document.getElementById("start");
startButton.addEventListener("click", startExploring);

const exitButton = document.getElementById("exit");
exitButton.addEventListener("click", stopExploring);

const confirmationStart = document.getElementById("confirmationStart");
confirmationStart.addEventListener("click", () => {
  toggleDisplay([confirmationDiv, contentDiv, infoDiv]);
});

const infoStart = document.getElementById("infoStart");
infoStart.addEventListener("click", () => {
  toggleDisplay([infoDiv, quiz]);
});

const quizSubmit = document.getElementById("quizSubmit");
quizSubmit.addEventListener("click", () => {
  toggleDisplay([quizDiv, contentDiv]);
  score += 5;
  document.getElementById("score").innerText = "Points: " + score;
  alert("You won 5 points!");
});

const quizBack = document.getElementById("quizBack");
quizBack.addEventListener("click", () => {
  quizDiv.setAttribute("hidden", "hidden");
  infoDiv.removeAttribute("hidden");
});

function startExploring() {
  updateCurrentScene(exploreScene);
  toggleDisplay([startButton, exitButton, dataDiv]);
}
function stopExploring() {
  updateCurrentScene(startScene);
  toggleDisplay([startButton, exitButton, dataDiv]);
  contentDiv.style.display = "none";
  confirmationDiv.style.display = "none";
  infoDiv.style.display = "none";
  quizDiv.style.display = "none";
}

function toggleDisplay(objArray) {
  objArray.forEach((obj) => {
    if (obj.style.display == "" || obj.style.display == "none") {
      obj.style.display = "block";
    } else {
      obj.style.display = "none";
    }
  });
}

// =========== RENDER ================
const clock = new THREE.Clock();
function render() {
  let delta = clock.getDelta();
  const distCameraPlane = currentScene.animate(delta, keysPressed);
  planeSound.setRefDistance(distCameraPlane * 100);
  renderer.render(currentScene, currentCamera);

  requestAnimationFrame(render);
}

render();
