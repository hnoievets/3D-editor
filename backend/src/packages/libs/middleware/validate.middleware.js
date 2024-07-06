import { logger } from '../../../libs/logger.js';

export function validate(schemas) {
  return (req, res, next) => {
    for (const [key, value] of Object.entries(schemas)) {
      const { error, value } = schemas[key].validate(req[key]);

      if (error) {
        logger.error(error.message);
        return next(error);
      }

      req[key] = value;
    }

    next();
  };
}
