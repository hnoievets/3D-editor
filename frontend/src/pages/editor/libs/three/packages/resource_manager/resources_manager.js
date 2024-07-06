import * as THREE from 'three';
import { GeometryType } from './constants';
import { Group } from '../group/group';
import { OperationConstructors } from '../constants';

class ResourcesManager {
  #geometries;
  #materialLoader;
  #geometryLoader;

  #defaultGeometryProperties = {
    [GeometryType.SPHERE]: [0.5],
  };

  constructor() {
    this.#materialLoader = new THREE.MaterialLoader();
    this.#geometryLoader = new THREE.BufferGeometryLoader();

    this.#geometries = new Map();
  }

  getGeometry(type) {
    // якщо тип не примітивного об'єкта
    if (!Object.values(GeometryType).includes(type)) {
      // нічого не повертається
      return;
    }
    //повернення геометрії зі збережених
    if (this.#geometries.has(type)) {
      return this.#geometries.get(type);
    }
    //створення нової геометрії та збереження її
    let geometry = new THREE[type](
      ...(this.#defaultGeometryProperties[type] ?? [])
    );

    this.#geometries.set(type, geometry);

    return geometry;
  }
  // звільнення пам'яті від геометрій та матеріалів
  dispose({ material, geometry }) {
    // видалення геометрії якщо її немає у збережених
    this.#geometries.has(geometry.type) || geometry.dispose();

    if (Array.isArray(material)) {
      material.forEach((material) => material.dispose());
    } else {
      material.dispose();
    }
  }

  loadObject(json, parse = true) {
    const data = parse ? JSON.parse(json) : json;
    console.log(data);
    let { object, materials, geometries } = data;

    materials = materials.map((material) =>
      this.#materialLoader.parse(material)
    );

    const group = new Group();

    object.children.forEach(
      ({
        material: materialUuid,
        geometry: geometryUuid,
        type,
        matrix,
        ancestor,
      }) => {
        let material, geometry;

        const geometryData = geometries.find(
          (item) => item.uuid === geometryUuid
        );
        const cashedGeometry = this.getGeometry(geometryData.type);
        console.log(geometryData);
        geometry =
          geometryUuid === cashedGeometry?.uuid
            ? cashedGeometry
            : this.#geometryLoader.parse(geometryData);

        if (!Array.isArray(materialUuid)) {
          material = materials.find(({ uuid }) => uuid === materialUuid);
        } else {
          material = materialUuid.map((uuid) =>
            materials.find((item) => item.uuid === uuid)
          );
        }

        const operation = new OperationConstructors[type](geometry, material);

        operation.setAncestor(ancestor);
        operation.applyMatrix4(new THREE.Matrix4().fromArray(matrix));

        group.add(operation);
      }
    );

    group.applyMatrix4(new THREE.Matrix4().fromArray(object.matrix));

    return group;
  }

  load(target, obj) {
    if (obj.object.type == 'Group') {
      return target.add(this.loadObject(obj, false));
    }
    let { object, materials, geometries } = obj;

    const { type, matrix, ancestor } = object;

    materials = materials.map((material) =>
      this.#materialLoader.parse(material)
    );
    let [geometry] = geometries;

    geometry =
      this.getGeometry(geometry.type) || this.#geometryLoader.parse(geometry);

    const operation = new OperationConstructors[type](
      geometry,
      materials.length == 1 ? materials[0] : materials
    );

    operation.setAncestor(ancestor);
    operation.applyMatrix4(new THREE.Matrix4().fromArray(matrix));

    target.add(operation);
  }
}

export const resourcesManager = new ResourcesManager();
