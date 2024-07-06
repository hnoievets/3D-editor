import { ForbiddenError } from '../libs/exceptions/exceptions.js';
import { Service } from '../libs/service.js';
import { projectRepository } from './project.repository.js';

class ProjectService extends Service {
  async create(userId, data) {
    return this.repository.create({ userId, ...data });
  }

  async getAllByUserId(userId) {
    return await this.repository.findAll({ userId });
  }

  async getById(userId, id) {
    const project = await this.repository.findById(id);

    if (userId != project?.userId) {
      throw new ForbiddenError('Project can only be obtained by the owner');
    }

    return project;
  }

  async update(id, data) {
    return await this.repository.update(id, data);
  }

  async delete(id) {
    return await this.repository.delete(id);
  }
}

const projectService = new ProjectService(projectRepository);

export { projectService };
