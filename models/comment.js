const Sequelize = require('sequelize');

module.exports = class Comment extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      comments: {
        type: Sequelize.TEXT,
        allowNull:true,
      },
      rating: {
        type: Sequelize.INTEGER,
        allowNull:true,
      },
    }, {
      sequelize,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }
  static associate(db) {
    db.Comment.belongsTo(db.User);
    db.Comment.belongsTo(db.Book);
  }
};