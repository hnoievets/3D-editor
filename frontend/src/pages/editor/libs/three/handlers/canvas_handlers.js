import { camera, raycaster, orbit } from '../entities';
import { getLastParentGroupOrOneself } from '../helpers/helpers';
import { getUserObjects, getNormalizedPointer } from '../helpers/helpers';

function handleDblclick(event) {
  const pointer = getNormalizedPointer(event.clientX, event.clientY);

  raycaster.setFromCamera(pointer, camera);
  const firstIntersectedObject =
    raycaster.intersectObjects(getUserObjects())[0]?.object;

  if (firstIntersectedObject) {
    orbit.target = getLastParentGroupOrOneself(
      firstIntersectedObject,
    ).position.clone();
    orbit.update();
  }
}

export { handleDblclick };
