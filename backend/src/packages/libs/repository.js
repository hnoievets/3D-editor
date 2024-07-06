export class Repository {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    return await this.model.create(data);
  }

  async findAll(data) {
    return await this.model.findAll({ where: data });
  }

  async findById(id) {
    return await this.model.findByPk(id);
  }

  async find(data) {
    return await this.model.findOne({ where: data });
  }

  async update(id, data) {
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
