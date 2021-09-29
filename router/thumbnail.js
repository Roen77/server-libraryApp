const express=require('express');
const {isLoggedIn} = require('./middleware');
const router = express.Router();

const {upload,uploadImage}=require('../Controller/Image');


// 이미지 Amazon S3 버킷에 업로드
router.post('/',isLoggedIn,upload.single('photo'),uploadImage);

module.exports=router;