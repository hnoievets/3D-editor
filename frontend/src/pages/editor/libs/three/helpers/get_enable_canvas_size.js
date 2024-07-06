function getEnableCanvasSize() {
  const canvasContainer = document.getElementById('canvasContainer');

  return {
    width: canvasContainer.offsetWidth,
    height: canvasContainer.offsetHeight,
  };
}

export { getEnableCanvasSize };
