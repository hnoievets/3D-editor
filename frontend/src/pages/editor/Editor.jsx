import { useCallback, useEffect, useRef, useState } from 'react';

import { GeometryType, editor } from './libs/three/three';
import styles from './styles.module.css';
import {
  handleCreateGeometry,
  handleUngroup,
  handleChangeColor,
  handleHole,
  handleGroup,
  handleSolid,
  handleLookAtScene,
} from './libs/three/handlers/handlers';
import { useNavigate, useParams } from 'react-router-dom';
import { Route } from '../../../../shared/constants/route';
import { appApi } from '../../libs/app_api';
import { HttpMethod } from '../../libs/constants';
import { load } from './libs/three/handlers/canvas_handlers';
import { notifier } from '../../libs/notifier';
import { Loader } from '../../libs/components/loader';
import BurgerMenu from '../../libs/components/burger_menu/burger_menu';
import { init, uninit } from './libs/three/three';

const figures = [
  { id: 1, name: 'Cube', geometry: GeometryType.BOX },
  { id: 2, name: 'Conus', geometry: GeometryType.CONUS },
  { id: 3, name: 'Cylinder', geometry: GeometryType.CYLINDER },
  { id: 4, name: 'Sphere', geometry: GeometryType.SPHERE },
];

function Editor() {
  const [project, setProject] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  const handleSave = useCallback(async () => {
  try {
    setIsSaving(true);
    const payload = editor.getDataToSave();

    await appApi.load(`${Route.PROJECTS}/${project.id}`, {
      method: HttpMethod.PATCH,
      payload: JSON.stringify(payload),
      hasAuth: true,
    });

    notifier.success(`Project ${project.name} successfully saved!`);
  } catch (error) {
    return notifier.error(error.message);
  } finally {
    setIsSaving(false);
  }
  }, [project]);

  const refContainer = useRef(null);

  useEffect(() => {
    if (!id) {
      init(refContainer.current);
      editor.render();

      return () => uninit();
    }

    setIsLoading(true);

    appApi
      .load(`${Route.PROJECTS}/${id}`, {
        method: HttpMethod.GET,
        hasAuth: true,
      })
      .then((response) => response.json())
      .then((project) => {
        init(refContainer.current);
        load(project.scene);

        setProject(project);

        editor.render();
      })
      .catch((error) => {
        notifier.error(error.message);
        navigate(Route.PROJECTS);
      })
      .finally(() => setIsLoading(false));

    return () => uninit();
  }, [id, navigate]);

  return (
    <div className={styles.editorPage}>
      <Loader
        isLoading
        className={`${styles.loader} ${!isLoading ? styles.invisible : ''}`}
      />
      <div className={styles.menu}>
        <BurgerMenu />
        <button disabled={isSaving} onClick={handleSave}>
          Save
        </button>
        <button onClick={handleGroup}>Group</button>
        <button onClick={handleUngroup}>Ungroup</button>
        <button onClick={handleSolid}>Solid</button>
        <button onClick={handleHole}>Hole</button>
        <button onClick={handleLookAtScene}>Look at the scene</button>
        <label>
          Color:
          <input
            type="color"
            defaultValue="#ffffff"
            onInput={handleChangeColor}
          />
        </label>
      </div>
      <div className={styles.editor}>
        <div id="canvasContainer" ref={refContainer}></div>
        <div className={styles.itemsBar} onClick={handleCreateGeometry}>
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
