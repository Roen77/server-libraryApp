const Sequelize = require('sequelize');

module.exports = class Hashtag extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      name: {
        type: Sequelize.STRING(100),
        allowNull:false,
      },
    }, {
      sequelize,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }
  static associate(db) {
    db.Hashtag.belongsToMany(db.Book, { through: 'BookHashtag',as:'tagBook' });
  }
};