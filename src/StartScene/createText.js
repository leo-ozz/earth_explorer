import * as THREE from "three";
import { FontLoader, TextGeometry } from "three/examples/jsm/Addons.js";

export default function createText({ font, message, size, depth } = {}) {
  const fontLoader = new FontLoader();
  const props = {
    font,
    size,
    depth,
  };
  const textGeo = new TextGeometry(message, props);
  textGeo.computeBoundingBox();
  const centerOffset =
    -0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);

  const textMat = new THREE.MeshNormalMaterial();
  const textMesh = new THREE.Mesh(textGeo, textMat);
  textMesh.position.x = centerOffset;
  return { textObj: textMesh, centerOffset };
}
