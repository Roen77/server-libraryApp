const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};
const Book = require('./book');
const Comment = require('./comment');
const Hashtag = require('./hashtag');
const User = require('./user');

const sequelize = new Sequelize(config.database, config.username, config.password, config);


db.sequelize = sequelize;
db.Sequelize = Sequelize;


db.Book=Book;
db.Comment=Comment;
db.Hashtag=Hashtag;
db.User=User;

Book.init(sequelize);
Comment.init(sequelize);
Hashtag.init(sequelize);
User.init(sequelize);

Book.associate(db);
Comment.associate(db);
Hashtag.associate(db);
User.associate(db);

module.exports = db;
