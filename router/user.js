const express=require('express');
const {isLoggedIn,isNotLoggedIn} = require('./middleware');
const passport = require('passport');
const router = express.Router();
const {upload,uploadImage}=require('../Controller/Image');

const authController=require('../Controller/auth');


// 사용자의 정보 가져오기
router.get('/',(req,res)=>{
    const User=req.user;
  return res.json(User)
});

// 구글 로그인
router.get('/google',isNotLoggedIn,passport.authenticate('google',{ scope: ['profile','email'], accessType:'offline',prompt:'consent' }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/auth/failed' }),
  function(req, res) {
    res.redirect('http://localhost:3000/')
  });

// kakao 로그인
router.get('/kakao',isNotLoggedIn,passport.authenticate('kakao', {failureRedirect: 'auth/failed'}));
  
router.get('/kakao/oauth',isNotLoggedIn,passport.authenticate('kakao', {failureRedirect: 'auth/failed',}),function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('http://localhost:3000/')
      });

// 회원 가입
router.post('/register',isNotLoggedIn,authController.register);
// 로그인
router.post('/login',isNotLoggedIn,authController.login)
// 로그아웃
router.get('/logout',isLoggedIn,authController.logout);
// 이미지  Amazon S3 버킷에 업로드
router.post('/thumbnail',isLoggedIn,upload.single('photo'),uploadImage);
// 사용자 정보 수정
router.put('/',isLoggedIn,authController.changeUserinfo);
// 사용자 정보 중 비밀번호 수정
router.patch('/',isLoggedIn,authController.changePassword);

module.exports=router;