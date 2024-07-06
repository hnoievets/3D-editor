import { Vector2 } from 'three';

import { editor } from '../editor';
import {
  getNormalizedPointer,
  getLastParentGroupOrOneself,
} from '../helpers/helpers';
import { LEFT_MOUSE_BUTTON } from './libs/constants';
import { Group } from '../packages/group/group';
import { ADDITION } from 'three-bvh-csg';
import { Solid } from '../packages/operations/solid';
import { Hole } from '../packages/operations/hole';
import { CsgType } from '../packages/operations/constants';

function handleMousedown(event) {
  if (event.button == LEFT_MOUSE_BUTTON) {
    editor.pointer.lastMouseDown = new Vector2(event.clientX, event.clientY);
  }
}

function handleSelecting(event) {
  console.log([...editor.scene.children]);

  if (
    !editor.pointer.lastMouseDown.equals(
      new Vector2(event.clientX, event.clientY)
    )
  ) {
    return;
  }

  const transformingObject = editor.selectedObject;

  editor.raycaster.setFromCamera(
    getNormalizedPointer(event.clientX, event.clientY),
    editor.camera
  );
  const intersections = editor.raycaster.intersectObjects(
    editor.getUserObjects()
  );

  if (!intersections.length) {
    if (transformingObject) {
      editor.deselect();

      if (transformingObject.isGroup) {
        transformingObject.ungroup();
      }

      editor.render();
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
      if (transformingObject.isGroup) {
        target = transformingObject.getExpanded([firstIntersectedObject]);
      } else {
        target = new Group().group([
          transformingObject,
          firstIntersectedObject,
        ]);
      }

      editor.scene.add(target);
    } else if (transformingObject.isGroup) {
      editor.deselect();
      transformingObject.ungroup();
    }
  }

  editor.select(target);

  editor.render();
}

function handleGroup() {
  if (!editor.selectedObject?.isGroup) {
    return;
  }

  const group = editor.selectedObject;

  const { solids, holes } = Object.groupBy(group.children, (operation) =>
    operation instanceof Solid ? 'solids' : 'holes'
  );

  let root, result;
  const ancestor = JSON.stringify(group);

  if (solids?.length) {
    root = solids.shift();

    const operations = holes ? solids.concat(holes) : solids;

    operations.forEach((operation) => {
      if (operation instanceof Hole) {
        if (Array.isArray(operation.material)) {
          operation.material.forEach((material) => (material.opacity = 1));
        } else {
          operation.material.opacity = 1;
        }
      }

      root.attach(operation);
    });

    result = new Solid();
  } else {
    root = holes.shift();

    holes.forEach((hole) => {
      hole.operation = ADDITION;
      root.attach(hole);
    });

    result = new Hole();
  }

  result = editor.csgEvaluator.evaluateHierarchy(root, result);
  result.setAncestor(ancestor);

  editor.deselect();
  group.removeFromParent();

  result.geometry.computeBoundingBox();
  const center = result.geometry.boundingBox.getCenter(editor.vector3);
  result.geometry.center();
  result.position.copy(center);

  editor.scene.add(result);
  editor.select(result);

  editor.render();
}

function handleUngroup() {
  if (!editor.selectedObject?.hasAncestor) {
    console.log('has not');
    return;
  }

  const { selectedObject } = editor;
  editor.deselect();

  const group = selectedObject.undoOperation();

  editor.scene.add(group);
  editor.select(group);

  editor.render();
}

function handleChangeColor(event) {
  if (!editor.selectedObject) {
    return;
  }

  editor.selectedObject.setColor(
    Number.parseInt(event.target.value.replace('#', '0x'))
  );

  editor.render();
}

function handleHole() {
  changeCsgType(editor.selectedObject, CsgType.HOLE);
}

function handleSolid() {
  changeCsgType(editor.selectedObject, CsgType.SOLID);
}

function changeCsgType(object, type) {
  if (!object || (!object.isGroup && object.type === type)) {
    return;
  }
  editor.deselect();

  const result = object.changeOperationTo(type);

  if (!result.isGroup) {
    editor.scene.add(result);

    object.removeFromParent();
  }

  editor.select(result);
  editor.render();
}

export {
  handleSelecting,
  handleMousedown,
  handleGroup,
  handleUngroup,
  handleChangeColor,
  handleHole,
  handleSolid,
};
