import { db } from '../../db/db.js';
import { Repository } from '../libs/repository.js';

class UserRepository extends Repository {}

const userRepository = new UserRepository(db.users);

export { userRepository };
