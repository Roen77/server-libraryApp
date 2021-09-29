const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      email: {
        type: Sequelize.STRING(50),
        allowNull:false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      username: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      googleId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      kakaoId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      provider:{
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      thumbnail:{
        type: Sequelize.STRING(250),
        allowNull: true,
      },
      role:{
        type: Sequelize.STRING(50),
        defaultValue:'Normal'
      },
    }, {
      sequelize,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }
  static associate(db) {
    db.User.hasMany(db.Book);
    db.User.hasMany(db.Comment);
    db.User.belongsToMany(db.Book,{ through: 'Like', as: 'Liked' })
  }
};