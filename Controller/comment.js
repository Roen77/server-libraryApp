const db = require('../models');
const { Op } = require("sequelize");
//코멘트는 유저 상관없이 전부다 쓸수 있다
module.exports={
    // 댓글(코멘트) 추가
    async addComment(req,res,next){
        try {
            const book=await db.Book.findOne({where:{id:req.params.bookId}})
            if(!book){
               return res.status(404).json({
                    success:false,
                    msg:'요청해주신 책이 존재하지 않습니다.'
                })
            }
            // const {comments,rating}=req.body
            // const {comments,rating}=req.body
            const newComment= await db.Comment.create({
                comments:req.body.comments,
                rating:req.body.rating,
                UserId:req.user.id,
                BookId:req.params.bookId
            })
            const findComment=await db.Comment.findOne({where:{
                id:newComment.id
            },
            include:[{
                model:db.User,
                attributes:['id','username','thumbnail']
            }]})
            res.json({
                comment:findComment
            })
        } catch (error) {
            console.error(error);
            return next(error);
        }
    },
    // 댓글(코멘트) 가져오기
    async fetchComments(req,res,next){
        try {
            const book=await db.Book.findOne({where:{id:req.params.bookId}})
            if(!book){
               return res.status(404).json({
                    success:false,
                    msg:'요청해주신 책이 존재하지 않습니다.'
                })
            }
            // 10개씩 가져온다.
            let limit=10
            let page=req.query.page?req.query.page:1
            let  where={BookId:req.params.bookId}
            // lastId 가 있다면 다음요소를 10개씩 가져온다.
            console.log('id인식',req.params.bookId)
            console.log('리밋인식',parseInt(req.query.limit || 10))
            console.log('조건인식', where)
            if (parseInt(req.query.lastId, 10)) {
                where={[Op.and]: [{BookId:req.params.bookId},{id: {
                    [Op.lt]: parseInt(req.query.lastId, 10), // less than
                  }}]}
            }
                const comments = await db.Comment.findAll({
                    where:{BookId:req.params.bookId},
                    include:[{
                    model:db.User,
                    attributes:['id','username','thumbnail']
                    }],
                    limit:parseInt(req.query.limit || 10),
                    order:[['updatedAt','DESC']]}
                    ) 
                    // 댓글의 전채 갯수
                    const commentsss = await db.Comment.findAll({
                        where:{BookId:req.params.bookId}
                    }) 
            const totalCount=await db.Comment.count({where:{BookId:req.params.bookId}})
            console.log(commentsss,'코멘트는가져오는ㄴ건가')
            console.log(totalCount,'???????????????????장난까나?')
            res.json({
                success:true,
                comments,
                page,
                commentCount:totalCount,
                // 마지막 페이지 유무 확인
                end:Math.ceil(totalCount/limit) === parseInt(page,10)?true:false,
                test:'아니 이걸호출하는거임???????????????????????????',
                testcom:commentsss 
            })
        } catch (error) {
            console.error(error);
            return next(error);
        }

    },
    // 코멘트(댓글) 삭제
    async deleteComment(req,res,next){
        try {
            const book=await db.Book.findOne({where:{id:req.params.bookId}})
            if(!book){
               return res.status(404).json({
                    success:false,
                    msg:'요청해주신 책이 존재하지 않습니다.'
                })
            }
            await db.Comment.destroy({
                where:{
                    [Op.and]: [{ UserId:req.user.id },{BookId:req.params.bookId},{id:req.params.commentId}],  
                }});
            res.json({
                success:true,
                msg:'코멘트 삭제 완료되었습니다.'
            })
        } catch (error) {
            console.error(error);
            return next(error);
        }

    },
}