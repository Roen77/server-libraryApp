const Sequelize = require('sequelize');

module.exports = class Book extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      title: {
        type: Sequelize.STRING(100),
        allowNull:false,
      },
      contents: {
        type: Sequelize.TEXT,
        allowNull:true,
      },
      url: {
        type: Sequelize.TEXT,
        allowNull:true,
      },
      isbn: {
        type: Sequelize.STRING(100),
        allowNull:true,
      },
      authors: {
        type: Sequelize.STRING(100),
        allowNull:false,
      },
      publisher: {
        type: Sequelize.STRING(100),
        allowNull:true,
      },
      thumbnail: {
        type: Sequelize.STRING,
        allowNull:true,
      },
      datetime: {
        type: Sequelize.DATE,
        allowNull:true,
      },
      bookmark:{
        type:Sequelize.BOOLEAN,
        allowNull:true,
        defaultValue:false
      }
    }, {
      sequelize,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }
  static associate(db) {
    db.Book.belongsTo(db.User);
    db.Book.hasMany(db.Comment);
    db.Book.belongsToMany(db.Hashtag,{ through: 'BookHashtag', as:'Hashtags'});
    db.Book.belongsToMany(db.User,{ through: 'Like', as: 'Likers' })
  }
};