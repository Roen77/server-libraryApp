const passport = require('passport');
const db= require('../models');
const bcrypt=require('bcrypt');

// 이메일 로그인 및 회원가입
const loginConfirm=(req,res,next)=>{
    passport.authenticate('local', async (err, user, info) => {
        if (err) {
          console.error(err);
          return next(err);
        }
        if (info) {
          return res.status(401).json({
            success:false,
            msg:info.reason
          });
        }
        return req.login(user, async (err) => {
          if (err) {
            console.error(err);
            return next(err);
          }
          // 사용자 정보
         const userinfo =await db.User.findOne({where:{id:user.id},attributes:['id','email','username','thumbnail','provider']})
          return res.json(userinfo);
        });
      })(req, res, next);
}

module.exports={
  // 회원가입
    async register(req,res,next){
        try {
            const {email,password,username}=req.body;
            // 비밀번호 암호화
            const hash=await bcrypt.hash(password,12);
            const user =await db.User.findOne({where:{email}})
            // 회원가입한 사용자가 있을 때
            if(user){
               return res.status(403).json({
                    success:false,
                    msg:'이미 회원가입된 유저입니다.'
                });
            };
            // 회원가입한 사용자가 없다면 사용자 생성
            await db.User.create({email,password:hash,username});
            loginConfirm(req,res,next);
        } catch (error) {
            console.error(error);
            return next(error);
        }
    },
    // 로그인
     async login(req,res,next){
        try {
            loginConfirm(req,res,next);
        } catch (error) {
            console.error(error);
           return next(error);
        }
       },
      //  로그아웃
    logout(req,res,next){
        if(req.isAuthenticated()){
         req.logout();
         req.session.destroy(); 
         return res.status(200).send('로그아웃 되었습니다.')
        }
     },
    //  사용자 정보 변경
     async changeUserinfo(req,res,next){
      try {
      //  사용자 이름 변경 시
        if(req.body.username){
          await db.User.update({
            username:req.body.username,
          },{
            where:{id:req.user.id}
          });
        }
        // 사용자 프로필(썸네일) 이미지 변경 시
        if(req.body.thumbnail){
          await db.User.update({
            thumbnail:req.body.thumbnail
          },{
            where:{id:req.user.id}
          });
        }
        // 변경한 사용자의 정보를 찾는다.
        const newUser=await db.User.findOne({where:{id:req.user.id},attributes:['id','email','username','thumbnail']})
         
      return  res.json({
        success:true,
        msg:'프로필 수정 완료되었습니다.',
        user:newUser
      })
      } catch (error) {
        console.error(error);
       return next(error);
      }
     },
    //  비밀번호 변경
     async changePassword(req,res,next){
      try {
        const {password} = req.body;
        // 비밀번호 암호화
        const hash=await bcrypt.hash(password,12);
        // 비밀번호 변경 후 사용자 정보를 업데이트해준다.
        await db.User.update({password:hash},{where:{id:req.user.id}})
        return  res.json({
          success:true,
          msg:'비밀번호 수정 완료되었습니다.',
        })
      } catch (error) {
        console.error(error);
        return next(error);
      }

     }
}