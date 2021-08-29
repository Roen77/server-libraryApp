const express=require('express');
const {isLoggedIn,} = require('./middleware');
const hashController=require('../Controller/hashtag');
const router = express.Router();

// 내 책 해시태그 추가/삭제/해시태그 책 가져오기
// 해시태그 가져오기
router.get('/',isLoggedIn,hashController.getHashtagBooks)
// 해시태그 추가
router.post('/:bookId',isLoggedIn,hashController.addHashtag)
// 해시태그 삭제
router.delete('/:bookId/tag/:hashtagId',isLoggedIn,hashController.removeHashtag)

module.exports=router;