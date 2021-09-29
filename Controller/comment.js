const db = require('../models');
const { Op } = require("sequelize");
//댓글 유저 상관없이 전부다 쓸수 있다
module.exports={
    // 댓글 추가
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
    // 댓글 가져오기
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
            if (parseInt(req.query.lastId, 10)) {
                where={[Op.and]: [{BookId:req.params.bookId},{id: {
                    [Op.lt]: parseInt(req.query.lastId, 10), // less than
                  }}]}
            }
                console.log(where,'조건절 확인좀')
                const comments = await db.Comment.findAll({
                    where,
                    include:[{
                    model:db.User,
                    attributes:['id','username','thumbnail']
                    }],
                    limit:parseInt(req.query.limit || 10),
                    order:[['updatedAt','DESC']]}
                    )
            const totalCount=await db.Comment.count({where:{BookId:req.params.bookId}})
            res.json({
                success:true,
                comments,
                page,
                commentCount:totalCount,
                // 마지막 페이지 유무 확인
                end:Math.ceil(totalCount/limit) === parseInt(page,10)?true:false
            })
        } catch (error) {
            console.error(error);
            return next(error);
        }

    },
    // 댓글 삭제
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
                msg:'댓글 삭제 완료되었습니다.'
            })
        } catch (error) {
            console.error(error);
            return next(error);
        }

    },
}