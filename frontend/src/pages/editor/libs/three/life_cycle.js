import { editor } from './editor';
import {
  handleWindowResize,
  handleDraggingChanged,
  handleKeyDown,
  handleSelecting,
  handleMousedown as handleLastMousedownPosition,
  handleFocus,
} from './handlers/handlers';

function init(container) {
  editor.init(container);

  editor.orbit.addEventListener('change', () => editor.render());

  editor.transform.addEventListener('change', () => {
    editor.scene.remove(editor.boxHelper);

    if (editor.selectedObject) {
      editor.box.setFromObject(editor.selectedObject);
      editor.scene.add(editor.boxHelper);
    }

    editor.render();
  });
  editor.transform.addEventListener('dragging-changed', handleDraggingChanged);

  const { domElement } = editor.renderer;
  domElement.addEventListener('click', handleSelecting);
  domElement.addEventListener('dblclick', handleFocus);
  domElement.addEventListener('mousedown', handleLastMousedownPosition);

  window.addEventListener('resize', handleWindowResize);
  window.addEventListener('keydown', handleKeyDown);
}

function uninit() {
  // звільнення пам'яті що займає сцена
  editor.destructor();

  // видалення обробників подій вікна
  window.removeEventListener('resize', handleWindowResize);
  window.removeEventListener('keydown', handleKeyDown);
}

export { init, uninit };
