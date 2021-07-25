const express=require('express');
const {isLoggedIn,isNotLoggedIn} = require('./middleware');
const bookController=require('../Controller/books');
const hashController=require('../Controller/hashtag')
const commentController=require("../Controller/comment")
const {upload,uploadImage}=require('../Controller/Image');
const router = express.Router();

// 카카오 검색
router.get('/search/kakao',bookController.kakaosearch);
// 이미지 Amazon S3 버킷에 업로드 후 책 추가
router.post('/add',upload.single('photo'),bookController.addBook);
// 이미지 Amazon S3 버킷에 업로드 후 책 수정
router.put('/:bookId',upload.single('photo'),bookController.updateBook);
// 책 삭제
router.delete('/:bookId',bookController.deleteBook);
// 책들 가져오기
router.get('/',bookController.fetchBooks);
// 책 가져오기
router.get('/:bookId',bookController.fetcbBook);
// 이미지 Amazon S3 버킷에 업로드
router.post('/thumbnail',upload.single('photo'),uploadImage);


// 북마크
// 북마크 추가
router.patch('/:bookId/addbookmark',bookController.addBookmark)
// 북마크 삭제
router.patch('/:bookId/removebookmark',bookController.removeBookmark)

// 내 책 해시태그 추가/삭제/해시태그 책 가져오기
// 해시태그 추가
router.post('/:bookId/addhashtags',hashController.addHashtag)
// 해시태그 삭제
router.delete('/:bookId/removehashtag/:hashtagId',hashController.removeHashtag)
// 해시태그 가져오기
router.get('/hashtags/:hashtagName',hashController.getHashtagBooks)

// 코멘트
// 코멘트 가져오기
router.get('/:bookId/comments',commentController.fetchComments)
// 코멘트 추가
router.post('/:bookId/comment',commentController.addComment)
// 코멘트 삭제
router.delete('/:bookId/comment/:commentId',commentController.deleteComment)

//다른 사용자의 책들 가져오기
router.get('/others/book',bookController.otherFetchBooks)
// 다른 사용자의 책 가져오기
router.get('/others/book/:bookId',bookController.otherFetchBook)

// 좋아요
// 다른 사용자의 책 좋아요
router.post('/others/book/:bookId/addLike',bookController.otheraddLike)
// 다른 사용자의 책 좋아요 삭제
router.delete('/others/book/:bookId/removeLike',bookController.otherremoveLike)


module.exports=router;