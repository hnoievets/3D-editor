import express from 'express';
import { AuthApiPath } from './libs/constants.js';
import { authService } from './auth.service.js';
import { StatusCode } from '../../../../shared/constants/status_code.js';
import { validate } from '../libs/middleware/validate.middleware.js';
import {
  LogInValidationSchema,
  SignUpValidationSchema,
} from './libs/validation_schemas/validation_schemas.js';

const router = express.Router();

router.post(
  AuthApiPath.SIGN_UP,
  validate({ body: SignUpValidationSchema }),
  async (req, res, next) => {
    try {
      const response = await authService.signUp(req.body);
      res.status(StatusCode.CREATED).send(response);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  AuthApiPath.LOG_IN,
  validate({ body: LogInValidationSchema }),
  async (req, res, next) => {
    try {
      const response = await authService.logIn(req.body);
      res.status(StatusCode.OK).send(response);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
