import { scene } from '../entities';
import { DESK_MESH_NAME } from '../constants';

export function getUserObjects() {
  return scene.children.filter(
    (obj) => (obj.isMesh && obj.name != DESK_MESH_NAME) || obj.isGroup,
  );
}
