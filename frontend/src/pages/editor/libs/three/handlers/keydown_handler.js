import { transform, renderer, scene } from '../entities';
import { render } from '../helpers/helpers';
import { groupService } from './libs/group_service';

export function handleKeyDown(event) {
  switch (event.code) {
    case 'KeyQ':
      transform.setSpace(transform.space === 'local' ? 'world' : 'local');
      break;

    case 'KeyW':
      transform.setMode('translate');
      break;

    case 'KeyE':
      transform.setMode('rotate');
      break;

    case 'KeyR':
      transform.setMode('scale');
      break;

    case '+':
    case '=':
      transform.setSize(transform.size + 0.1);
      break;

    case '-':
    case '_':
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

    case ' ':
      transform.enabled = !transform.enabled;
      break;

    case 'Escape':
      transform.reset();
      break;

    // @todo
    case 'KeyI':
      console.log(renderer.info);
      break;

    case 'Delete': {
      const selectedObject = transform.object;

      if (!selectedObject) {
        return;
      }

      transform.detach();
      scene.remove(selectedObject);

      groupService.callbackForAllSimpleObjects(
        selectedObject,
        disposeResources,
      );
      selectedObject.clear();

      render();
    }
  }
}

function disposeResources(object) {
  object.geometry.dispose();
  object.material.dispose();
}
