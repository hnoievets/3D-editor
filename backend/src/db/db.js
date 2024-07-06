import { Sequelize, DataTypes } from 'sequelize';
import { logger } from '../libs/logger.js';
import { getUserModel, getProjectModel } from './models/models.js';

const ON_DELETE_BEHAVIOR = 'CASCADE';

const sequelize = new Sequelize(
  'postgres://postgres:postgres@localhost:5432/3d-modeling',
  {
    logging: (msg) => logger.info(msg),
  }
);

const users = getUserModel(sequelize, DataTypes);
const projects = getProjectModel(sequelize, DataTypes);

const db = {
  sequelize,
  users,
  projects,
};

db.users.hasMany(projects, {
  onDelete: ON_DELETE_BEHAVIOR,
});
db.projects.belongsTo(users);

try {
  await sequelize.authenticate();
  logger.info('Connection has been established successfully.');

  await sequelize.sync();
} catch (error) {
  logger.error('Unable to connect to the database:', error);
}

export { db };
