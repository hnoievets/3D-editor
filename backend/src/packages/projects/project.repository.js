import { db } from '../../db/db.js';
import { logger } from '../../libs/logger.js';
import { Repository } from '../libs/repository.js';

class ProjectRepository extends Repository {
  async create(data) {
    return await this.model.create(data);
  }

  async findAll(data) {
    return await this.model.findAll({ where: data });
  }

  async findById(id) {
    return await this.model.findByPk(id);
  }

  async update(id, data) {
    logger.warn(data);
    logger.warn(id);
    return await this.model.update(data, {
      where: { id },
    });
  }

  async delete(id) {
    return this.model.destroy({
      where: { id },
    });
  }
}

const projectRepository = new ProjectRepository(db.projects);

export { projectRepository };
