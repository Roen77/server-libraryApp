const passport= require('passport');
const {User} = require('../models');
require('dotenv').config();

const GoogleStrategy = require('passport-google-oauth20').Strategy;


module.exports=()=>{
  passport.use(new GoogleStrategy({
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:process.env.GOOGLE_URL
  },
  async function(accessToken, refreshToken, profile, done) {
      try {
        const exUser =await User.findOne({where:{
            googleId:profile.id
        }})
        if(!exUser){
          const newUser =await User.create({
              email:profile._json.email,
              username:profile.displayName,
              googleId:profile.id,
              provider:profile.provider,
    
          })
          console.log('new User created',profile._json.email);
        return  done(null,newUser)
  
        }else{
            console.log('이미 유저가 있습니다.', profile)
           return done(null,exUser)
        }
      // User.findOrCreate({ googleId: profile.id }, function (err, user) {
      //   return done(err, user);
      // });
      } catch (error) {
          console.error(error);
          return done(error);
      }
  }
));
}