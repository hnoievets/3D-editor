import { Mesh, MeshNormalMaterial, Vector2 } from 'three';

import {
  transform,
  camera,
  raycaster,
  pointer,
  scene,
  csgEvaluator,
  vector3,
} from '../entities';
import {
  render,
  getNormalizedPointer,
  getUserObjects,
  getLastParentGroupOrOneself,
} from '../helpers/helpers';
import { LEFT_MOUSE_BUTTON } from './libs/constants';
import { groupService } from './libs/group_service';
import { ADDITION, Operation, SUBTRACTION } from 'three-bvh-csg';

function handleMousedown(event) {
  if (event.button == LEFT_MOUSE_BUTTON) {
    pointer.lastMouseDown = new Vector2(event.clientX, event.clientY);
  }
}

function handleClick(event) {
  console.log([...scene.children]);

  if (
    !pointer.lastMouseDown.equals(new Vector2(event.clientX, event.clientY))
  ) {
    return;
  }

  const transformingObject = transform.object;

  raycaster.setFromCamera(
    getNormalizedPointer(event.clientX, event.clientY),
    camera,
  );
  const intersections = raycaster.intersectObjects(getUserObjects());

  if (!intersections.length) {
    if (transformingObject) {
      transform.detach();

      if (
        transformingObject.isGroup &&
        !transformingObject.userData.isGrouped
      ) {
        groupService.ungroup(transformingObject);
      }

      render();
    }
    return;
  }

  let firstIntersectedObject = intersections[0].object;
  firstIntersectedObject = getLastParentGroupOrOneself(firstIntersectedObject);

  if (firstIntersectedObject == transformingObject) {
    return;
  }

  let target = firstIntersectedObject;

  if (transformingObject) {
    if (event.ctrlKey) {
      if (
        transformingObject.isGroup &&
        !transformingObject.userData.isGrouped
      ) {
        target = groupService.expandGroup(transformingObject, [
          firstIntersectedObject,
        ]);
      } else {
        target = groupService.group([
          transformingObject,
          firstIntersectedObject,
        ]);
      }

      scene.add(target);
    } else if (
      transformingObject.isGroup &&
      !transformingObject.userData.isGrouped
    ) {
      transform.detach();
      groupService.ungroup(transformingObject);
    }
  }

  transform.attach(target);

  render();
}

function handleGroup() {
  if (!transform.object?.isGroup) {
    return;
  }
  /*
    ---LAYOUT---

    base = new Operation(children[0])
    solidsAndHolesOperations = children.slice(0).groupBy(({isHole}) => isHole ? 'holes' : 'solids') - position, updateMatrixWorld();
    base.add(...solids, ...holes)

    result = csgEvaluator.evaluateHierarchy(base, new Mesh()?);

    alignMesh() - to the center and back

  */

  const group = transform.object;

  const children = group.children.slice();

  const solids = [];
  const holes = [];

  children.forEach((child) => {
    const { isHole, geometry, material, quaternion, scale } = child;

    const operation = new Operation(geometry, material);
    operation.position.copy(child.getWorldPosition(vector3));
    operation.scale.copy(scale);
    operation.quaternion.copy(quaternion);

    operation.updateMatrixWorld();

    if (isHole) {
      operation.operation = SUBTRACTION;

      holes.push(operation);
      return;
    }
    // operation.operation == ADDITION by default
    solids.push(operation);
  });

  const target = new Mesh();

  let root;

  if (solids.length) {
    root = solids.splice(0, 1)[0];
    solids.concat(holes).forEach((operation) => root.attach(operation));
  } else {
    root = holes.splice(0, 1)[0];

    holes.forEach((operation) => {
      operation.operation = ADDITION;
      root.attach(operation);

      target.isHole = true;
    });
  }

  const result = csgEvaluator.evaluateHierarchy(root, target);

  result.userData.source = children;

  transform.detach();
  groupService.ungroup(group);

  scene.remove(...children);

  result.geometry.computeBoundingBox();
  const center = result.geometry.boundingBox.getCenter(vector3);
  result.geometry.center();
  result.position.copy(center);

  scene.add(result);

  transform.attach(result);

  render();
}

function handleUngroup() {
  if (!transform.object?.isGroup) {
    return;
  }

  const selectedGroup = transform.object;

  transform.detach();

  groupService.ungroup(selectedGroup);

  render();
}

function handleChangeColor(event) {
  if (!transform.object) {
    return;
  }

  groupService.callbackForAllSimpleObjects(transform.object, (simpleObject) =>
    simpleObject.material.setValues({ color: event.target.value }),
  );

  render();
}

function handleHole() {
  if (!transform.object) {
    return;
  }

  const selectedObject = transform.object;

  selectedObject.isHole = true;
  const material = new MeshNormalMaterial({
    depthWrite: false,
    transparent: true,
    opacity: 0.5,
  });

  selectedObject.material = material;
  selectedObject.castShadow = false;

  render();
}

export {
  handleClick,
  handleMousedown,
  handleGroup,
  handleUngroup,
  handleChangeColor,
  handleHole,
};
