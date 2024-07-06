import { genSalt, hash } from 'bcrypt';

export class Encrypt {
  async generateSalt(saltRounds = 10) {
    return await genSalt(saltRounds);
  }

  async encrypt(password, salt) {
    return await hash(password, salt);
  }

  async compare({ passwordToCompare, salt, passwordHash }) {
    const hashToCompare = await this.encrypt(passwordToCompare, salt);

    return hashToCompare === passwordHash;
  }
}

const encrypt = new Encrypt();

export { encrypt };
