export function getProjectModel(sequelize, DataTypes) {
  const Project = sequelize.define('project', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    scene: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  });

  return Project;
}
