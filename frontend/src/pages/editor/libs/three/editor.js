import * as THREE from 'three';
import { Evaluator, Operation } from 'three-bvh-csg';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { getEnableCanvasSize } from './helpers/get_enable_canvas_size';
import { DESK_MESH_NAME } from './constants';

class Editor {
  constructor() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });

    this.camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);

    this.scene = new THREE.Scene();

    this.orbit = new OrbitControls(this.camera, this.renderer.domElement);

    this.transform = new TransformControls(
      this.camera,
      this.renderer.domElement
    );

    this.csgEvaluator = new Evaluator();

    this.raycaster = new THREE.Raycaster();

    this.box = new THREE.Box3();
    this.boxHelper = new THREE.Box3Helper(this.box);

    this.vector3 = new THREE.Vector3();

    this.pointer = {
      lastMouseDown: null,
    };
  }
  // відрисовка сцени
  render() {
    this.renderer.render(this.scene, this.camera);
  }

  select(obj) {
    this.transform.attach(obj);
  }

  deselect() {
    this.transform.detach();
  }

  get selectedObject() {
    return this.transform.object;
  }

  getUserObjects() {
    return this.scene.children.filter((obj) => obj.isOperation || obj.isGroup);
  }
// ініціалізація
init(container) {
  // додавання canvs до переданого елементу
  container.append(this.renderer.domElement);

  console.log('inner init');

  // визначення доступних розмірів
  const { width: enableCanvasWidth, height: enableCanvasHeight } =
    getEnableCanvasSize();

  //налаштування видрисовщика
  this.renderer.setPixelRatio(window.devicePixelRatio);
  this.renderer.setSize(enableCanvasWidth, enableCanvasHeight);
  this.renderer.shadowMap.enabled = true;

  // налаштування камери
  this.camera.aspect = enableCanvasWidth / enableCanvasHeight;
  this.camera.position.set(0, 5, 10);
  this.camera.updateProjectionMatrix();

  // зміна кольору заднього плану сцеени
  this.scene.background = new THREE.Color(0xb0b0b0);

  // створення робочої повернхні
  const gridHelper = new THREE.GridHelper(10, 10, 0x888888, 0x444444);
  gridHelper.position.setY(0.01);
  this.scene.add(gridHelper);

  const planeGeometry = new THREE.PlaneGeometry(10, 10, 32, 32);
  const planeMaterial = new THREE.MeshStandardMaterial({
    color: 0xb0b0b0,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.3,
  });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.name = DESK_MESH_NAME;
  plane.receiveShadow = true;
  plane.rotateX(-THREE.MathUtils.degToRad(90));
  this.scene.add(plane);

  //створення полусферного світла
  const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0xcccccc, 2);
  this.scene.add(hemisphereLight);

  //створення нарпавленного світла
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(0, 20, 0);
  light.shadow.camera.far = 30;
  light.castShadow = true;
  this.scene.add(light);

  // оновлення елементу управління
  this.orbit.update();

  // налаштування управління для трансформації та додавання на сцену
  this.transform.setTranslationSnap(0.1);
  this.transform.setScaleSnap(0.1);
  this.scene.add(this.transform);
}

  getDataToSave() {
    return { scene: this.getUserObjects() };
  }

  destructor() {
    // видалення об'єкту з елементу керування
    this.deselect();
    // звільнення ресурсів кожного дочірньому елементу 
    this.scene.traverse((obj) => {
      if (obj instanceof Operation) {
        // виклик відповідного методу якщо це модель користувача
        obj.dispose();
        obj.clear();
      } else {
        //звільнення ресурсів якщо вони є
        obj.material?.dispose();
        obj.material?.dispose();
      }
    });
    // видалення усіх дочірніх елементів
    this.scene.clear();
  }
}

const editor = new Editor();

export { editor };
