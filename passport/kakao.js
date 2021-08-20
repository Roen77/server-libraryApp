const passport = require('passport');
const {User} = require('../models');
require('dotenv').config();
const KakaoStrategy = require('passport-kakao').Strategy

module.exports=()=>{
  passport.use(new KakaoStrategy({
    clientID :process.env.KAKAO_clientID,
    clientSecret:process.env.KAKAO_SECRET,
    callbackURL : process.env.KAKAO_URL
  },
 async (accessToken, refreshToken, profile, done) => {
    // 사용자의 정보는 profile에 들어있다.
    try {
        const exUser =await User.findOne({where:{
            kakaoId:profile.id
        }})
        if(!exUser){
          const newUser =await User.create({
              email:profile._json.kakao_account.email,
              username:profile.username,
              kakaoId:profile.id,
              provider:profile.provider,
    
          })
        return  done(null,newUser)
  
        }else{
           return done(null,exUser)
        }
      } catch (error) {
          console.error(error);
          return done(error);
      }
  }
));
}