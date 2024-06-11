import { renderer, camera } from '../entities';
import { render, getEnableCanvasSize } from '../helpers/helpers';

function handleWindowResize() {
  const { width: enableCanvasWidth, height: enableCanvasHeight } =
    getEnableCanvasSize();

  camera.aspect = enableCanvasWidth / enableCanvasHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(enableCanvasWidth, enableCanvasHeight);
  render();
}

export { handleWindowResize };
