import { editor } from '../editor';
import { getEnableCanvasSize } from '../helpers/helpers';

function handleWindowResize() {
  const { width: enableCanvasWidth, height: enableCanvasHeight } =
    getEnableCanvasSize();

  editor.camera.aspect = enableCanvasWidth / enableCanvasHeight;
  editor.camera.updateProjectionMatrix();

  editor.renderer.setSize(enableCanvasWidth, enableCanvasHeight);
  editor.render();
}

export { handleWindowResize };
