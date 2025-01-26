import * as THREE from "three";
import StartScene from "./StartScene/startScene";
import ExploreScene from "./ExploreScene/exploreScene";
import { getObjectName } from "./ExploreScene/getCountryByClick";

let currentScene, currentCamera;
let score = 0;

//html elements for eventlisteners
const contentDiv = document.getElementById("content");
const settingsDiv = document.getElementById("settings");
const soundToggle = document.getElementById("soundToggle");
const musicToggle = document.getElementById("musicToggle");
const soundSlider = document.getElementById("soundSlider");
const musicSlider = document.getElementById("musicSlider");
const confirmationDiv = document.getElementById("confirmation");
const infoDiv = document.getElementById("info");
const quizDiv = document.getElementById("quiz");
const dataDiv = document.getElementById("data");

const canvas = document.querySelector("canvas.threejs");
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);

//init scenes
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
  backgroundTrack.setVolume(0.2);
  backgroundTrack.play();
});

const planeSound = new THREE.PositionalAudio(listener);
audioLoader.load("src/assets/sounds/plane_sound.mp3", (buffer) => {
  planeSound.setBuffer(buffer);
  planeSound.setLoop(true);
  planeSound.setVolume(0.05);
  planeSound.setDistanceModel("exponential"); //for positional sound drop off
  planeSound.setRolloffFactor(100.0);
  //planeSound.play();
});

//to be called by settings apply button
function setVolume() {
  const soundVolume = soundSlider.value * 0.1;
  const musicVolume = musicSlider.value * 0.4;

  if (soundToggle.value == true) {
    console.log("here");
    planeSound.setVolume(0);
  } else {
    planeSound.setVolume(soundVolume);
  }
  if (musicToggle.value == true) {
    backgroundTrack.setVolume(0);
  } else {
    backgroundTrack.setVolume(musicVolume);
  }
}

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
      const country = getObjectName(event, window, currentCamera, currentScene);
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

const settingsButton = document.getElementById("settingsButton");
settingsButton.addEventListener("click", () => {
  toggleDisplay([contentDiv, settingsDiv]);
});

// needs FIX
// const settingsApply = document.getElementById("apply");
// settingsApply.addEventListener("click", setVolume);

const confirmationStart = document.getElementById("confirmationStart");
confirmationStart.addEventListener("click", () => {
  toggleDisplay([confirmationDiv, contentDiv, infoDiv]);
});
const infoStart = document.getElementById("infoStart");
infoStart.addEventListener("click", () => {
  toggleDisplay([infoDiv, quizDiv]);
});

const quizSubmit = document.getElementById("quizSubmit");
quizSubmit.addEventListener("click", () => {
  console.log("clicked");
  console.log(quizDiv.style.display, contentDiv.style.display);
  toggleDisplay([quizDiv, contentDiv]);
  score += 5;
  document.getElementById("score").innerText = "Points: " + score;
  alert("You won 5 points!");
});

// const quizBack = document.getElementById("quizBack");
// quizBack.addEventListener("click", () => {
//   quizDiv.setAttribute("hidden", "hidden");
//   infoDiv.removeAttribute("hidden");
// });

//swap to explore scene
function startExploring() {
  updateCurrentScene(exploreScene);
  toggleDisplay([startButton, exitButton]);
  dataDiv.style.display = "flex";
  contentDiv.style.display = "none";
  settingsDiv.style.display = "none";
}

//swap to start scene
function stopExploring() {
  updateCurrentScene(startScene);
  toggleDisplay([startButton, exitButton, dataDiv]);
  contentDiv.style.display = "none";
  settingsDiv.style.display = "none";
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
