import * as THREE from 'three';
import { Evaluator } from 'three-bvh-csg';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';

let renderer = new THREE.WebGLRenderer({ antialias: true });

const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);

const scene = new THREE.Scene();

const orbit = new OrbitControls(camera, renderer.domElement);

const transform = new TransformControls(camera, renderer.domElement);

const raycaster = new THREE.Raycaster();

const box = new THREE.Box3();
const boxHelper = new THREE.Box3Helper(box);

const vector3 = new THREE.Vector3();

const pointer = {
  lastMouseDown: null,
};

const csgEvaluator = new Evaluator();
csgEvaluator.useGroups = false;

export {
  renderer,
  camera,
  scene,
  orbit,
  transform,
  raycaster,
  box,
  boxHelper,
  vector3,
  pointer,
  csgEvaluator,
};
