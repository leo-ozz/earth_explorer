import * as THREE from "three";

//raycaster to get name of first intersected object
export function getObjectName(event, window, camera, scene) {
  let mousePointer = new THREE.Vector2();
  mousePointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  mousePointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mousePointer, camera);

  const objectsWithName = [];
  let intersects = raycaster.intersectObjects(scene.children, false);
  intersects.forEach((entry) => {
    if (entry.object.name != "") {
      objectsWithName.push(entry.object);
    }
  });

  if (typeof objectsWithName[0] == "undefined") {
    return null;
  }

  return objectsWithName[0];
}
