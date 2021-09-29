const express=require('express');
const {isLoggedIn,isNotLoggedIn} = require('./middleware');
const bookController=require('../Controller/books');
const commentController=require("../Controller/comment")
const router = express.Router();

// 카카오 검색
router.get('/search/kakao',isLoggedIn,bookController.kakaosearch);
// 이미지 Amazon S3 버킷에 업로드 후 책 추가
router.post('/add',isLoggedIn,bookController.addBook);
// router.post('/add',isLoggedIn,upload.single('photo'),bookController.addBook);
// 이미지 Amazon S3 버킷에 업로드 후 책 수정
router.put('/:bookId',isLoggedIn,bookController.updateBook);
// router.put('/:bookId',isLoggedIn,upload.single('photo'),bookController.updateBook);
// 책 삭제
router.delete('/:bookId',isLoggedIn,bookController.deleteBook);
// 책들 가져오기
router.get('/',isLoggedIn,bookController.fetchBooks);
// 책 가져오기
router.get('/:bookId',isLoggedIn,bookController.fetcbBook);



// 북마크
// 북마크 추가
router.patch('/:bookId/addbookmark',isLoggedIn,bookController.addBookmark)
// 북마크 삭제
router.patch('/:bookId/removebookmark',isLoggedIn,bookController.removeBookmark)



// 댓글
// 댓글 가져오기
router.get('/:bookId/comments',isLoggedIn,commentController.fetchComments)
// 댓글 추가
router.post('/:bookId/comment',isLoggedIn,commentController.addComment)
// 댓글 삭제
router.delete('/:bookId/comment/:commentId',isLoggedIn,commentController.deleteComment)

//다른 사용자의 책들 가져오기
router.get('/others/book',isLoggedIn,bookController.otherFetchBooks)
// 다른 사용자의 책 가져오기
router.get('/others/book/:bookId',isLoggedIn,bookController.otherFetchBook)

// 좋아요
// 다른 사용자의 책 좋아요
router.post('/others/book/:bookId/addLike',isLoggedIn,bookController.otheraddLike)
// 다른 사용자의 책 좋아요 삭제
router.delete('/others/book/:bookId/removeLike',isLoggedIn,bookController.otherremoveLike)




module.exports=router;