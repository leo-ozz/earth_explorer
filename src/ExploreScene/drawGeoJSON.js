import * as THREE from "three";

export function drawGeoJSON(json, materialOptions, plane) {
  let { x_max, y_max } = getPlaneSize(plane);

  const countries = getData(json);

  let counter = 1;
  const max = 2;
  countries.forEach((country) => {
    if (counter >= max) {
      return;
    }
    counter += 1;
    if (country.geo.type == "MultiPolygon") {
      country.geo.coordinates.forEach((entry) => {
        addPolygon(country.name, entry[0]);
      });
    } else {
      //console.log(country.geo.coordinates[0]);
      // const temp_coords = [
      //   [80, 80],
      //   [80, 40],
      //   [40, 40],
      //   [40, 80],
      // ];
      // addPolygon(country.name, temp_coords);
      addPolygon(country.name, country.geo.coordinates[0]);
    }
  });

  //create mesh from polygon for each country
  function addPolygon(name, geoCoords) {
    const coords = convertCoordinates(geoCoords);
    console.log(coords);
    const polyShape = new THREE.Shape(
      coords.forEach((coord) => {
        new THREE.Vector2(coord.x, coord.y);
      })
    );
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

  function convertCoordinates(geoCoords) {
    const coords = [];
    geoCoords.forEach((coordPair) => {
      const x = (x_max * (180 + coordPair[0])) / 360; //lat
      const y = (y_max * (90 - coordPair[1])) / 180; //lon
      coords.push({ x, y, z: 1 });
    });
    return coords;
  }

  function drawLine(x_values, y_values, z_values, name, options) {
    const line_geom = new THREE.BufferGeometry();
    createVertexForEachPoint(line_geom, x_values, y_values, z_values);

    const line_material = new THREE.LineBasicMaterial(options);
    const line = new THREE.Line(line_geom, line_material);
    line.name = name;
    plane.add(line);

    clearArrays();
  }

  function createVertexForEachPoint(
    object_geometry,
    values_axis1,
    values_axis2,
    values_axis3
  ) {
    const verts = [];
    for (let i = 0; i < values_axis1.length; i++) {
      verts.push(values_axis1[i], values_axis2[i], values_axis3[i]);
    }
    object_geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(verts, 3)
    );
  }

  function needsInterpolation(point2, point1) {
    const lon1 = point1[0];
    const lat1 = point1[1];
    const lon2 = point2[0];
    const lat2 = point2[1];
    const lon_distance = Math.abs(lon1 - lon2);
    const lat_distance = Math.abs(lat1 - lat2);

    if (lon_distance > 5 || lat_distance > 5) {
      return true;
    } else {
      return false;
    }
  }

  function interpolatePoints(interpolation_array) {
    let temp_array = [];
    let point1, point2;

    for (
      let point_num = 0;
      point_num < interpolation_array.length - 1;
      point_num++
    ) {
      point1 = interpolation_array[point_num];
      point2 = interpolation_array[point_num + 1];

      if (needsInterpolation(point2, point1)) {
        temp_array.push(point1);
        temp_array.push(getMidpoint(point1, point2));
      } else {
        temp_array.push(point1);
      }
    }

    temp_array.push(interpolation_array[interpolation_array.length - 1]);

    if (temp_array.length > interpolation_array.length) {
      temp_array = interpolatePoints(temp_array);
    } else {
      return temp_array;
    }
    return temp_array;
  }

  function getMidpoint(point1, point2) {
    const midpoint_lon = (point1[0] + point2[0]) / 2;
    const midpoint_lat = (point1[1] + point2[1]) / 2;
    const midpoint = [midpoint_lon, midpoint_lat];

    return midpoint;
  }
}
