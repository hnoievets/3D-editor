import * as THREE from 'three';
import { scene } from '../entities';
import { render } from '../helpers/helpers';

// @todo constants
const Geometry = {
  CUBE: 'cube',
  SPHERE: 'sphere',
  CYLINDER: 'cylinder',
  CONUS: 'conus',
};

const DEFAULT_Y_POSITION = 0.5;

function handleCreateGeometryClick(event) {
  let geometry;

  switch (event.target.dataset.geometry) {
    case Geometry.CUBE:
      geometry = new THREE.BoxGeometry();
      break;

    case Geometry.CONUS:
      geometry = new THREE.ConeGeometry();
      break;

    case Geometry.CYLINDER:
      geometry = new THREE.CylinderGeometry();
      break;

    case Geometry.SPHERE:
      geometry = new THREE.SphereGeometry(DEFAULT_Y_POSITION);
      break;
  }

  const material = new THREE.MeshStandardMaterial({ flatShading: true });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.setY(DEFAULT_Y_POSITION);
  mesh.castShadow = true;
  scene.add(mesh);
  render();
}

export { handleCreateGeometryClick };
