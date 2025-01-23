import * as THREE from "three";

export default function getStarfield({ numStars = 2000 } = {}) {
  function createRandomStar() {
    const radius = Math.random() * 25 + 25;
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    let x = radius * Math.sin(phi) * Math.cos(theta);
    let y = radius * Math.sin(phi) * Math.sin(theta);
    let z = radius * Math.cos(phi);

    return new THREE.Vector3(x, y, z);
  }

  const positions = [];
  const colors = [];
  const hue = 0.6;
  const sat = 0.2; //saturation
  const size = 0.2; //point size

  for (let i = 0; i < numStars; i += 1) {
    const star = createRandomStar();
    const col = new THREE.Color().setHSL(hue, sat, Math.random());
    positions.push(star.x, star.y, star.z);
    colors.push(col.r, col.g, col.b);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({
    size: size,
    vertexColors: true,
    map: new THREE.TextureLoader().load(
      "src/assets/textures/startScene/stars/circle.png"
    ),
  });

  const points = new THREE.Points(geo, mat);
  return points;
}
