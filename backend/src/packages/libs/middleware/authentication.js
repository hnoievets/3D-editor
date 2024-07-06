import { userService } from '../../users/user.service.js';
import { ExceptionMessage } from '../exceptions/exception_massage.js';
import { UnauthorizedError } from '../exceptions/exceptions.js';
import { token } from '../token.js';

export async function authentication(req, res, next) {
  const { headers } = req;
  const [, requestToken] = headers.authorization?.split(' ') ?? [];

  try {
    if (!requestToken) {
      throw new UnauthorizedError(ExceptionMessage.AUTHORIZATION_HEADER);
    }

    const { userId } = await token.verifyToken(requestToken);

    if (!userId) {
      throw new UnauthorizedError(ExceptionMessage.INVALID_TOKEN);
    }

    const authorizedUser = await userService.getById(userId);

    if (!authorizedUser) {
      throw new UnauthorizedError(ExceptionMessage.DO_NOT_HAVE_AUTHORIZATION);
    }

    req.user = authorizedUser;
    next();
  } catch (error) {
    next(error);
  }
}
