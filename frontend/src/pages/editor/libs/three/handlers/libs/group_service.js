import { Box3, Group, Vector3 } from 'three';

import { scene } from '../../entities';

class GroupService {
  #scene;

  #box;
  #vector;

  constructor(scene) {
    this.#scene = scene;

    this.#box = new Box3();
    this.#vector = new Vector3();
  }

  group(children) {
    const group = new Group();

    this.#box.makeEmpty();

    children.forEach((child) => this.#box.expandByObject(child));

    group.position.copy(this.#box.getCenter(this.#vector));
    children.forEach((child) => group.attach(child));

    return group;
  }

  expandGroup(group, children) {
    children = group.children.concat(children);

    group.removeFromParent();

    return this.group(children);
  }

  ungroup(group) {
    group.removeFromParent();

    for (let i = group.children.length - 1; i >= 0; i--) {
      this.#scene.attach(group.children[i]);
    }
  }

  callbackForAllSimpleObjects(object, callback) {
    object.isGroup
      ? object.children.forEach((child) =>
          this.callbackForAllSimpleObjects(child, callback),
        )
      : callback(object);
  }
}

const groupService = new GroupService(scene);

export { groupService };
