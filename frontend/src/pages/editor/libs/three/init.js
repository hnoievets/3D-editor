import * as THREE from 'three';
import { SUBTRACTION, Brush, Evaluator, Operation } from 'three-bvh-csg';

import {
  renderer,
  camera,
  scene,
  orbit,
  transform,
  boxHelper,
  box,
} from './entities';
import { render, getEnableCanvasSize } from './helpers/helpers';
import {
  handleWindowResize,
  handleDraggingChanged,
  handleKeyDown,
  handleClick as handleMeshSelecting,
  handleDblclick as handleMeshFocus,
  handleMousedown as handleLastMousedownPosition,
} from './handlers/handlers';
import { DESK_MESH_NAME } from './constants';

function init(container) {
  console.log('inner init');

  container.append(renderer.domElement);
  const { width: enableCanvasWidth, height: enableCanvasHeight } =
    getEnableCanvasSize();

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(enableCanvasWidth, enableCanvasHeight);
  renderer.shadowMap.enabled = true;

  camera.aspect = enableCanvasWidth / enableCanvasHeight;
  camera.position.set(0, 5, 10);
  camera.updateProjectionMatrix();

  scene.background = new THREE.Color(0xb0b0b0);

  const gridHelper = new THREE.GridHelper(10, 10, 0x888888, 0x444444);
  gridHelper.position.setY(0.01);
  scene.add(gridHelper);

  const planeGeometry = new THREE.PlaneGeometry(10, 10, 32, 32);
  const planeMaterial = new THREE.MeshStandardMaterial({
    color: 0xb0b0b0,
    side: THREE.DoubleSide,
  });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.name = DESK_MESH_NAME;
  plane.receiveShadow = true;
  plane.material.transparent = true;
  plane.material.opacity = 0.3;
  plane.rotateX(-THREE.MathUtils.degToRad(90));
  scene.add(plane);

  const ambient = new THREE.AmbientLight(undefined, 2);
  scene.add(ambient);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(0, 20, 0);
  light.shadow.camera.far = 30;
  light.castShadow = true;
  scene.add(light);

  orbit.update();

  orbit.addEventListener('change', render);

  transform.setTranslationSnap(0.1);
  transform.setScaleSnap(0.1);

  transform.addEventListener('change', () => {
    scene.remove(boxHelper);

    if (transform.object) {
      box.setFromObject(transform.object);
      scene.add(boxHelper);
    }

    render();
  });
  transform.addEventListener('dragging-changed', handleDraggingChanged);

  scene.add(transform);

  window.addEventListener('resize', handleWindowResize);
  window.addEventListener('keydown', handleKeyDown);

  renderer.domElement.addEventListener('click', handleMeshSelecting);
  renderer.domElement.addEventListener('dblclick', handleMeshFocus);
  renderer.domElement.addEventListener(
    'mousedown',
    handleLastMousedownPosition,
  );

  // const geometry = new THREE.BoxGeometry();
  // const material = new THREE.MeshStandardMaterial();
  // const mesh = new THREE.Mesh(geometry, material);
  // mesh.position.set(-5, 2.5, 0);
  // const mesh2 = new THREE.Mesh(geometry, material);
  // mesh2.position.set(5, 2.5, 0);
  // mesh.castShadow = true;
  // mesh2.castShadow = true;

  // scene.add(mesh, mesh2);

  // const group = new THREE.Group();

  // const box = new THREE.Box3();
  // box.expandByObject(mesh);
  // box.expandByObject(mesh2);
  // const center = box.getCenter(new THREE.Vector3());
  // scene.add(new THREE.Box3Helper(box));

  // const negativeCenter = center.clone().multiplyScalar(-1);

  // group.translateX(negativeCenter.x);
  // group.translateY(negativeCenter.y);
  // group.translateZ(negativeCenter.z);

  // group.position.copy(center);
  // group.attach(mesh).attach(mesh2);

  // scene.add(group);

  //Pivot
  // var pivot = new THREE.Group();
  // group.position.set(-2, 1, 0)
  // transform.attach(group);

  // pivot.add( group );
  // console.log({
  //   mesh,
  //   mesh2
  // });
  // pivot.add(group);
  // console.log('pivot',pivot);

  // group.position.copy(box.getCenter(new THREE.Vector3()).multiplyScalar(-1));

  // scene.add(pivot);

  // transform.attach(pivot);

  // CSG
  // const brushMat = new THREE.MeshStandardMaterial({ color: THREE.Color.NAMES.aqua, transparent: false, depthWrite: true });

  // const brush1 = new Operation(new THREE.SphereGeometry(), brushMat );
  // brush1.position.x = -3;
  // brush1.updateMatrixWorld();

  // const brush2 = new Operation( new THREE.BoxGeometry(8, 3, 2), brushMat );
  // brush2.position.z = 1;
  // brush2.updateMatrixWorld();
  // brush2.operation = SUBTRACTION;

  // brush1.add(brush2);

  // const csgEvaluator = new Evaluator();
  // csgEvaluator.useGroups = false;

  // const result = csgEvaluator.evaluateHierarchy(brush1);

  // box.setFromObject(result);
  // scene.add(boxHelper);

  // result.geometry.computeBoundingBox();
  // const center = result.geometry.boundingBox.getCenter(new THREE.Vector3());
  // result.geometry.center();
  // result.position.copy(center);

  // scene.add(result);
}

export { init };
