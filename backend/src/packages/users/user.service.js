import { Service } from '../libs/service.js';
import { userRepository } from './user.repository.js';
import { UserEntity } from './user.entity.js';
import { encrypt } from '../libs/encript.js';

class UserService extends Service {
  constructor(repository, encript) {
    super(repository);
    this.encrypt = encript;
  }

  async create(data) {
    const passwordSalt = await this.encrypt.generateSalt();

    const passwordHash = await this.encrypt.encrypt(
      data.password,
      passwordSalt
    );

    const user = await this.repository.create({
      ...data,
      passwordHash,
      passwordSalt,
    });

    return new UserEntity(user).toObject();
  }

  async getById(id) {
    const user = await this.repository.findById(id);

    return user && new UserEntity(user).toObject();
  }

  async getByEmail(email) {
    const user = await this.repository.find({ email });

    if (!user) {
      return null;
    }

    return new UserEntity(user).toObject();
  }

  async getPrivateData(id) {
    const { passwordHash, passwordSalt } = await this.repository.findById(id);
    return {
      passwordHash,
      passwordSalt,
    };
  }
}

const userService = new UserService(userRepository, encrypt);

export { userService };
