const express=require('express');
const profileController=require('../Controller/profile');
const {isLoggedIn,isNotLoggedIn} = require('./middleware');
const router = express.Router();

// 통계 데이터 가져오기
router.get('/',isLoggedIn,profileController.Counts)
module.exports=router
