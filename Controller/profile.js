// 통계
const db = require('../models');
const sequelize=require('sequelize');
const moment=require('moment');

// 날짜 포맷
const Format=(data,obj)=>{
    if(!obj){
        return data.filter(value=>value.dataValues).map(value=>value.dataValues.months=moment(value.dataValues.months).format("M"))
    }
    return data.map(value=>value.months=moment(value.months).format("M"))

}
module.exports={
    async Counts(req,res,next){
        try {
            //생성한 책의 수
            const books=await db.Book.findAll({
                attributes: [[ sequelize.fn('date_trunc', 'month', sequelize.col('createdAt')), 'months'], 
                  [sequelize.fn('count', sequelize.col('id')), 'value']], 
                  where:{UserId:req.user.id},
                  group: ['months']
            })
            // 북마크한 수
           const bookmarks=await db.Book.findAll({
                attributes: [[ sequelize.fn('date_trunc', 'month', sequelize.col('createdAt')), 'months'], 
                  [sequelize.fn('count', sequelize.col('bookmark')), 'value']], 
                  where:{[sequelize.Op.and]:[
                      {bookmark:true},
                      {UserId:req.user.id}
                  ]},
                  group: ['months']
            })
            //좋아요한 수
           const likeList=await db.sequelize.query(`SELECT 
           count(*) as value,date_trunc('month', "createdAt")::date as months
       from "Like"
       where   "Like"."UserId"=${req.user.id}
       GROUP BY date_trunc('month',"createdAt");`)
       //좋아요 받은 수
       const likerList=await db.sequelize.query(`SELECT 
       count(*) as value,date_trunc('month', "Like"."createdAt")::date as months
   from "Like","Books"
   where   "Books"."UserId"=${req.user.id} and "Books".id ="Like"."BookId"
   GROUP BY date_trunc('month',"Like"."createdAt")`)
   //작성한 코멘트수
   const comments=await db.Comment.findAll({
    attributes: [[ sequelize.fn('date_trunc', 'month', sequelize.col('createdAt')), 'months'], 
      [sequelize.fn('count', sequelize.col('UserId')), 'value']], 
      where: {UserId:req.user.id},
      group: ['months']
})   
        const likes=likeList[0]
        const likers=likerList[0]
            Format(books)
            Format(bookmarks)
            Format(comments)
            Format(likes,true)
            Format(likers,true)
            console.log()
            res.json({
                bookmarks,   
                likes,
                likers,
                comments,
                books
            })
        
        } catch (error) {
            console.error(error);
            return next(error);
        }
    }

}