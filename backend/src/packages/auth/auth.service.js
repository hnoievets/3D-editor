import { encrypt } from '../libs/encript.js';
import { ExceptionMessage } from '../libs/exceptions/exception_massage.js';
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from '../libs/exceptions/exceptions.js';
import { token } from '../libs/token.js';
import { userService } from '../users/user.service.js';

export class AuthService {
  constructor(userService, encrypt, token) {
    this.userService = userService;
    this.encrypt = encrypt;
    this.token = token;
  }

  async signUp(userData) {
    const user = await this.userService.getByEmail(userData.email);

    if (user) {
      throw new ForbiddenError(ExceptionMessage.EMAIL_IS_ALREADY_USED);
    }

    const newUser = await this.userService.create(userData);
    const token = await this.token.create({
      userId: newUser.id,
    });

    return { user: newUser, token };
  }

  async logIn(userData) {
    const { email, password } = userData;

    const user = await this.userService.getByEmail(email);

    if (!user) {
      throw new NotFoundError(ExceptionMessage.USER_NOT_FOUND);
    }

    const userPrivateData = await this.userService.getPrivateData(user.id);

    const hasSamePassword = await this.encrypt.compare({
      passwordToCompare: password,
      salt: userPrivateData.passwordSalt,
      passwordHash: userPrivateData.passwordHash,
    });

    if (!hasSamePassword) {
      throw new BadRequestError(ExceptionMessage.INVALID_CREDENTIALS);
    }

    const token = await this.token.create({
      userId: user.id,
    });

    return { user, token };
  }
}

const authService = new AuthService(userService, encrypt, token);

export { authService };
