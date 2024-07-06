import { Operation } from 'three-bvh-csg';
import { resourcesManager } from '../resource_manager/resources_manager';
import { OperationConstructors } from '../constants';
import { MeshStandardMaterial } from 'three';
import { MaterialProperties } from './enum';

export class CsgOperation extends Operation {
  #ancestor;

  static createFromOpposite(opposite) {
    const operation = new this(opposite.geometry, opposite.material);

    if (Array.isArray(operation.material)) {
      operation.material.forEach((material) => {
        material.setValues(MaterialProperties[operation.type]);
        material.needsUpdate = true;
      });
    } else {
      operation.material.setValues(MaterialProperties[operation.type]);
    }

    operation.applyMatrix4(opposite.matrixWorld);

    operation.setAncestor(opposite.getAncestor());

    return operation;
  }

  get hasAncestor() {
    return Boolean(this.#ancestor);
  }

  setAncestor(json) {
    this.#ancestor = json;
  }

  getAncestor() {
    return this.#ancestor;
  }

  removeAncestor() {
    this.#ancestor = undefined;
  }

  undoOperation() {
    if (!this.hasAncestor) {
      return;
    }

    const group = resourcesManager.loadObject(this.#ancestor);

    group.position.copy(this.position);
    group.scale.copy(this.scale);
    group.rotation.copy(this.rotation);

    this.removeFromParent();
    this.dispose();

    return group;
  }

  dispose() {
    resourcesManager.dispose(this);
  }

  toJSON(meta) {
    const data = super.toJSON(meta);
    data.object.ancestor = this.#ancestor;
    return data;
  }

  setColor(color) {
    if (Array.isArray(this.material)) {
      this.material.forEach((material) => material.dispose());
      this.material = new MeshStandardMaterial(MaterialProperties[this.type]);
    }

    this.material.setValues({ color });
  }

  changeOperationTo(type) {
    if (type === this.type) {
      return this;
    }

    return OperationConstructors[type].createFromOpposite(this);
  }
}
