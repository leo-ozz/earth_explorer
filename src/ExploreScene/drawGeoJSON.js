import * as THREE from "three";

export function drawGeoJSON(json, materialOptions, plane) {
  let { x_max, y_max } = getPlaneSize(plane);

  //parse Json
  const countries = getData(json);

  //iterate over countries
  countries.forEach((country) => {
    if (country.geo.type == "MultiPolygon") {
      country.geo.coordinates.forEach((entry) => {
        addPolygon(country.name, entry[0]);
      });
    } else {
      addPolygon(country.name, country.geo.coordinates[0]); //country only has 1 Polygon
    }
  });

  //create mesh from coordinates for each country
  function addPolygon(name, geoCoords) {
    const coords = convertCoordinates(geoCoords);
    //create 2d
    const polyShape = new THREE.Shape(
      coords.forEach((coord) => {
        new THREE.Vector2(coord.x, coord.y);
      })
    );

    //create 3d
    const polyGeometry = new THREE.ShapeGeometry(polyShape);
    const polyMaterial = new THREE.MeshBasicMaterial(materialOptions);
    polyGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(
        coords.map((coord) => [coord.x, coord.y, coord.z]).flat(),
        3
      )
    );
    const polygon = new THREE.Mesh(polyGeometry, polyMaterial);
    polygon.name = name;
    plane.add(polygon);
  }

  //extract country name and geoData
  function getData(json) {
    const data = [];
    json.features.forEach((entry) => {
      data.push({
        name: entry.properties.name,
        geo: entry.geometry,
      });
    });

    return data;
  }

  function getPlaneSize(plane) {
    plane.geometry.computeBoundingBox();
    const x_max =
      plane.geometry.boundingBox.max.x - plane.geometry.boundingBox.min.x;
    const y_max =
      plane.geometry.boundingBox.max.y - plane.geometry.boundingBox.min.y;
    return { x_max, y_max };
  }

  //lat and long -> x and y
  function convertCoordinates(geoCoords) {
    const coords = [];
    geoCoords.forEach((coordPair) => {
      const x = (x_max * (180 + coordPair[0])) / 360; //lat
      const y = (y_max * (90 - coordPair[1])) / 180; //lon
      coords.push({ x, y, z: 1 });
    });
    return coords;
  }
}
