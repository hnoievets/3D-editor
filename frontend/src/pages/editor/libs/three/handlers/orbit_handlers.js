import { orbit } from '../entities';

function handleDraggingChanged(event) {
  orbit.enabled = !event.value;
}

export { handleDraggingChanged };
