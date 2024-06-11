import { Vector2 } from 'three';
import { getEnableCanvasSize } from '../helpers/helpers';

function getNormalizedPointer(clientX, clientY) {
  const pointer = new Vector2();
  const enableCanvasSize = getEnableCanvasSize();
  const canvas = document.getElementsByTagName('canvas')[0];

  pointer.x = ((clientX - canvas.offsetLeft) / enableCanvasSize.width) * 2 - 1;
  pointer.y = -((clientY - canvas.offsetTop) / enableCanvasSize.height) * 2 + 1;

  return pointer;
}

export { getNormalizedPointer };
