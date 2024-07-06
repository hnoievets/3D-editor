import { editor } from '../editor';

export function handleKeyDown(event) {
  const { transform } = editor;
  switch (event.code) {
    case 'KeyW':
      transform.setMode('translate');
      break;

    case 'KeyR':
      transform.setMode('rotate');
      break;

    case 'KeyS':
      transform.setMode('scale');
      break;

    case 'NumpadAdd':
    case 'Plus':
      transform.setSize(transform.size + 0.1);
      break;

    case 'NumpadSubtract':
    case 'Minus':
      transform.setSize(Math.max(transform.size - 0.1, 0.1));
      break;

    case 'KeyX':
      transform.showX = !transform.showX;
      break;

    case 'KeyY':
      transform.showY = !transform.showY;
      break;

    case 'KeyZ':
      transform.showZ = !transform.showZ;
      break;

    case 'Escape':
      transform.reset();
      break;

    // @todo
    case 'KeyI':
      console.log(editor.renderer.info);
      break;

    case 'Delete': {
      if (!editor.selectedObject) {
        return;
      }

      const selectedObject = editor.selectedObject;
      editor.deselect();

      selectedObject.removeFromParent();
      selectedObject.dispose();

      editor.render();
    }
  }
}
