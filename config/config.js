require('dotenv').config();

module.exports ={
    "development": {
      "username": "postgres",
      "password": process.env.SEQUELIZE_PASSWORD,
      "database": "library",
      "host": "127.0.0.1",
      "dialect": "postgres",
      "port":5432
    },
    "test": {
      "username": "postgres",
      "password": process.env.SEQUELIZE_PASSWORD,
      "database": "library_test",
      "host": "127.0.0.1",
      "dialect": "postgres",
      "port":5432
    },
    "production": {
      "username": "postgres",
      "password": process.env.SEQUELIZE_PASSWORD,
      "database": "library_production",
      "host": "127.0.0.1",
      "dialect": "postgres",
      logging: false,
      "port":5432
    }
  }
  