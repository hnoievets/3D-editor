import { StatusCode } from '../../../shared/constants/status_code.js';
import { HttpError } from '../packages/libs/exceptions/exceptions.js';
import { logger } from './logger.js';

export function errorHandler(err, req, res, next) {
  if (err.isJoi) {
    return res
      .status(StatusCode.UNPROCESSED_ENTITY)
      .send({ message: err.message });
  }

  if (err instanceof HttpError) {
    return res.status(err.status).send({ message: err.message });
  }

  logger.error(err.stack);

  res
    .status(StatusCode.INTERNAL_SERVER_ERROR)
    .send({ message: 'Something went wrong :(' });
}
