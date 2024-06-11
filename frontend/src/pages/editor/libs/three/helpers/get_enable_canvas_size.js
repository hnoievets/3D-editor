function getEnableCanvasSize() {
  const canvasContainer = document.getElementById('canvasContainer');

  return {
    width: canvasContainer.offsetWidth,
    height: canvasContainer.offsetHeight,
  };
}

/*function getEnableCanvasWidth() {
  return (
    window.innerWidth -
    document.getElementById('itemsBar').offsetWidth
  );
}

function getEnableCanvasHeight() {
  return (
    window.innerHeight -
    document.getElementById('menu').offsetWidth
  );
}*/

export { getEnableCanvasSize };
