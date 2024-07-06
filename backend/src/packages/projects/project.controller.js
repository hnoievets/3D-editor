import express from 'express';
import { StatusCode } from '../../../../shared/constants/status_code.js';
import { ProjectApiPath } from '../../../../shared/constants/project_api_path.js';
import { projectService } from './project.service.js';
import { authentication } from '../libs/middleware/authentication.js';
import { postProjectValidationSchema } from './libs/validation_schemas.js/post_project.validation_schema.js';
import { validate } from '../libs/middleware/validate.middleware.js';
import { patchProjectValidationSchema } from './libs/validation_schemas.js/patch_project.validation_schema.js';

const router = express.Router();

router.use(authentication);

router.post(
  ProjectApiPath.ROOT,
  validate({ body: postProjectValidationSchema }),
  async (req, res, next) => {
    try {
      const project = await projectService.create(req.user.id, req.body);
      res.status(StatusCode.CREATED).send(project);
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  ProjectApiPath.$ID,
  validate({ body: patchProjectValidationSchema }),
  async (req, res, next) => {
    try {
      const project = await projectService.update(req.params.id, req.body);
      res.status(StatusCode.OK).send(project);
    } catch (error) {
      next(error);
    }
  }
);

router.get(ProjectApiPath.OWN, async (req, res, next) => {
  try {
    const projects = await projectService.getAllByUserId(req.user.id);
    res.status(StatusCode.OK).send({ projects });
  } catch (error) {
    next(error);
  }
});

router.get(ProjectApiPath.$ID, async (req, res, next) => {
  try {
    const project = await projectService.getById(req.user.id, req.params.id);
    res.status(StatusCode.OK).send(project);
  } catch (error) {
    next(error);
  }
});

router.delete(ProjectApiPath.$ID, async (req, res, next) => {
  try {
    await projectService.delete(req.params.id);
    res.sendStatus(StatusCode.NO_CONTENT);
  } catch (error) {
    next(error);
  }
});

export default router;
