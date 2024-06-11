import { useEffect, useRef } from 'react';

import { init, render } from './libs/three/three';
import styles from './styles.module.css';
import {
  handleCreateGeometryClick,
  handleUngroup,
  handleChangeColor,
  handleHole,
  handleGroup,
} from './libs/three/handlers/handlers';

const figures = [
  { id: 1, name: 'Cube', geometry: 'cube' },
  { id: 2, name: 'Conus', geometry: 'conus' },
  { id: 3, name: 'Cylinder', geometry: 'cylinder' },
  { id: 4, name: 'Sphere', geometry: 'sphere' },
];

function Editor() {
  console.log('init');

  const refContainer = useRef(null);

  useEffect(() => {
    init(refContainer.current);
    render();
  }, []);

  return (
    <div className={styles.editorPage}>
      <div className={styles.menu} id="menu">
        <button onClick={handleGroup}>Group</button>
        <button onClick={handleUngroup}>Ungroup</button>
        <label htmlFor="color-picker">Color: </label>
        <input
          type="color"
          id="color-picker"
          defaultValue="#ff0000"
          onInput={handleChangeColor}
        />
        <button onClick={handleHole}>Hole</button>
      </div>
      <div className={styles.editor}>
        <div id="canvasContainer" ref={refContainer}></div>
        <div
          className={styles.itemsBar}
          id="itemsBar"
          onClick={handleCreateGeometryClick}
        >
          {figures.map(({ id, name, geometry }) => (
            <li key={id}>
              <button className={styles.itemButton} data-geometry={geometry}>
                {name}
              </button>
            </li>
          ))}
        </div>
      </div>
    </div>
  );
}

export { Editor };
