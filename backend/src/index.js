import express from 'express';
import { Route } from '../../shared/constants/route.js';
import authRouter from './packages/auth/auth.controller.js';
import projectsRoute from './packages/projects/project.controller.js';
import { logger } from './libs/logger.js';
import bodyParser from 'body-parser';
import { errorHandler } from './libs/error_handler.js';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.use(Route.AUTH, authRouter);
app.use(Route.PROJECTS, projectsRoute);

app.use(errorHandler);

app.listen(port, () => {
  logger.info(`server is listening on port ${port}`);
});
