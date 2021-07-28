const {User} = require("../models");
const local=require("./local");
const kakao=require('./kakao');
const google=require("./google");
const passport = require('passport');

module.exports=()=>{
    passport.serializeUser(function(user, done) {
      return done(null, user.id);
      });
      
      passport.deserializeUser(async function(id, done) {
        try {
            const exUser = await User.findOne({where:{id},attributes:['email','username','id','thumbnail','provider']})
           return done(null,exUser);
        } catch (error) {
            consno.error(error);
            return done(err);
        }
      });
      local();
      kakao();
      google();
};