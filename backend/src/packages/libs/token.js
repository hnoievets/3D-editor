import { jwtVerify, SignJWT } from 'jose';
import { UnauthorizedError } from './exceptions/exceptions.js';
import { ExceptionMessage } from './exceptions/exception_massage.js';

class Token {
  secret;
  algorithm;
  expirationTime;

  constructor() {
    this.secret = new TextEncoder().encode('secret');
    this.algorithm = 'HS256';
    this.expirationTime = '24h';
  }

  create(payload, expirationTime = this.expirationTime) {
    return new SignJWT(payload)
      .setProtectedHeader({ alg: this.algorithm })
      .setExpirationTime(expirationTime)
      .sign(this.secret);
  }

  async verifyToken(token) {
    try {
      const { payload } = await jwtVerify(token, this.secret);

      return payload;
    } catch {
      throw new UnauthorizedError(ExceptionMessage.INVALID_TOKEN);
    }
  }
}

const token = new Token();

export { token };
