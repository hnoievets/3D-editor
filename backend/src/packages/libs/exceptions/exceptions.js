import { StatusCode } from '../../../../../shared/constants/status_code.js';

class HttpError extends Error {
  constructor({ message, status }) {
    super(message);
    this.status = status;
  }
}

class UnauthorizedError extends HttpError {
  constructor(message) {
    super({ message, status: StatusCode.UNAUTHORIZED });
  }
}

class BadRequestError extends HttpError {
  constructor(message) {
    super({ message, status: StatusCode.BAD_REQUEST });
  }
}

class NotFoundError extends HttpError {
  constructor(message) {
    super({ message, status: StatusCode.NOT_FOUND });
  }
}

class InternalServerError extends HttpError {
  constructor(message) {
    super({ message, status: StatusCode.INTERNAL_SERVER_ERROR });
  }
}

class ForbiddenError extends HttpError {
  constructor(message) {
    super({ message, status: StatusCode.FORBIDDEN });
  }
}

export {
  HttpError,
  ForbiddenError,
  NotFoundError,
  InternalServerError,
  BadRequestError,
  UnauthorizedError,
};
