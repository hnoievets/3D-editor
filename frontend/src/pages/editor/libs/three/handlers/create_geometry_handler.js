import { editor } from '../editor';
import { resourcesManager } from '../packages/resource_manager/resources_manager';
import { Solid } from '../packages/operations/solid';

const DEFAULT_Y_POSITION = 0.5;

function handleCreateGeometry(event) {
  if (!event.target.dataset.geometry) {
    return;
  }

  let geometry = resourcesManager.getGeometry(event.target.dataset.geometry);

  const solidMesh = new Solid(geometry);
  solidMesh.position.setY(DEFAULT_Y_POSITION);

  editor.scene.add(solidMesh);
  editor.render();
}

export { handleCreateGeometry };
