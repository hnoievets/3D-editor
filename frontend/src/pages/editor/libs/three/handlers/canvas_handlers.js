import { editor } from '../editor';
import { resourcesManager } from '../packages/resource_manager/resources_manager';

export async function load(children) {
  console.log(children);
  children.forEach((child) => {
    resourcesManager.load(editor.scene, child);
  });
}
