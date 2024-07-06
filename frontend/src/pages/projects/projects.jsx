import { useEffect, useState } from 'react';
import styles from './styles.module.css';
import { appApi } from '../../libs/app_api';
import { Route } from '../../../../shared/constants/route';
import { HttpMethod } from '../../libs/constants';
import { notifier } from '../../libs/notifier';
import { useNavigate } from 'react-router-dom';
import { Loader } from '../../libs/components/loader';
import { ProjectApiPath } from '../../../../shared/constants/project_api_path';

// const mock = [
//   {
//     id: 1,
//     name: 'One Proj',
//     createdAt: Date.now(),
//     updatedAt: Date.now(),
//   },
//   {
//     id: 2,
//     name: 'Second Proj',
//     createdAt: Date.now(),
//     updatedAt: Date.now(),
//   },
//   {
//     id: 3,
//     name: 'Third Proj',
//     createdAt: Date.now(),
//     updatedAt: Date.now(),
//   },
//   {
//     id: 4,
//     name: 'Fourth Proj',
//     createdAt: Date.now(),
//     updatedAt: Date.now(),
//   },
// ];

function Projects() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('New Project');

  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);

    appApi
      .load(`${Route.PROJECTS}/${ProjectApiPath.OWN}`, {
        method: HttpMethod.GET,
        hasAuth: true,
      })
      .then((response) => response.json())
      .then(({ projects }) => setProjects(projects))
      .catch((err) => notifier.error(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  const handleSelectProject = (id) => {
    navigate(`${Route.EDITOR}/${id}`);
  };

  const handleNewProject = () => {
    appApi
      .load(`${Route.PROJECTS}`, {
        method: HttpMethod.POST,
        payload: JSON.stringify({name, scene: []}),
        hasAuth: true,
      })
      .then((response) => response.json())
      .then(({ id }) => navigate(`${Route.EDITOR}/${id}`))
      .catch((err) => notifier.error(err.message))
      .finally(() => setIsLoading(false));
  };

  const handleDelete = (projectId) => {
    appApi
      .load(`${Route.PROJECTS}/${projectId}`, {
        method: HttpMethod.DELETE,
        hasAuth: true,
      })
      .then(() => {
        setProjects(projects.filter(({ id }) => id !== projectId));

        notifier.success('Project deleted successfully!');
      })
      .catch((err) => notifier.error(err.message));
  };

  return (
    <div className={styles.projectsContainer}>
      <div className={styles.projectsBody}>
        <Loader isLoading={isLoading}>
          <h2>Choose a Project</h2>
          <input
            type="text"
            name="projectName"
            className={styles.newProjectInput}
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button className={styles.newProjectBtn} onClick={handleNewProject}>
            Create New Project
          </button>
          {projects.length ? (
            <div className={styles.projectList}>
              {projects.toReversed().map((project) => (
                <div className={styles.projectItem} key={project.id}>
                  <button
                    className={styles.crossMark}
                    onClick={() => handleDelete(project.id)}
                  >
                    [x]
                  </button>
                  <span className={styles.name}>{project.name}</span>
                  <span className={styles.changes}>
                    <span>Latest changes:</span>{' '}
                    {new Date(project.updatedAt).toLocaleString()}
                  </span>
                  <button
                    className={styles.editBtn}
                    onClick={() => handleSelectProject(project.id)}
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <h2>You don`t have projects yet</h2>
          )}
        </Loader>
      </div>
    </div>
  );
}

export default Projects;
