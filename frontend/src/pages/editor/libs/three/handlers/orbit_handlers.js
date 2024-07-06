import { editor } from '../editor';
import {
  getLastParentGroupOrOneself,
  getNormalizedPointer,
} from '../helpers/helpers';

function handleDraggingChanged(event) {
  editor.orbit.enabled = !event.value;
}

function handleFocus(event) {
  const pointer = getNormalizedPointer(event.clientX, event.clientY);

  editor.raycaster.setFromCamera(pointer, editor.camera);
  let firstIntersectedObject = editor.raycaster.intersectObjects(
    editor.getUserObjects()
  )[0]?.object;

  if (firstIntersectedObject) {
    editor.orbit.target.copy(
      getLastParentGroupOrOneself(firstIntersectedObject).position
    );
    editor.orbit.update();
  }
}

function handleLookAtScene() {
  if (!editor.orbit.target.equals(editor.scene.position)) {
    editor.orbit.target.copy(editor.scene.position);
    editor.orbit.update();
  }
}

export { handleDraggingChanged, handleFocus, handleLookAtScene };
