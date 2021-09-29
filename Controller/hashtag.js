const db = require('../models');
const { Op } = require("sequelize");


module.exports={
    // 해시태그 추가
    async addHashtag(req,res,next){
        try {
            const book = await db.Book.findOne({
                where:{
                    [Op.and]: [{ UserId:req.user.id}, { id: req.params.bookId }],
            }})
            if(!book){
               return res.status(404).json({
                    success:false,
                    msg:'요청해주신 책이 존재하지 않습니다.'
                })
            }
            const HashtagsList=await book.getHashtags()
            // 해당 책에 존자해는 해시태그의 갯수가 10개이상 이라면 추가할수 없게한다.(클라이언트에서도 이미 추가한 해시태그가 10개 이상이라면 추가할 수 없도록 구현하였습니다.)
            if(HashtagsList.length>5){
                return res.status(400).json({
                    msg:'더이상 해시태그를 추가할 수 없습니다.'
                })
            }
            const {hashtags}=req.body
            if(!Array.isArray(hashtags) || hashtags === null) return
            // 배열 hashtagList 에 들어 있는 해시태그가 이미 db에 존재한다면  찾고, 없으면 추가한다.
        const hashtagList= await Promise.all(hashtags.map(tag=>{
               return db.Hashtag.findOrCreate({
                   where:{ name:String(tag).toLowerCase()}
                })
            }))
            // 해시태그 추가
            await book.addHashtags(hashtagList.map(hashtag=>hashtag[0]))

            res.json({
                msg:'해시태그 추가 완료되었습니다.',
                // hashtagList:newhashtagList,
                hashtagList:hashtagList.map((tag)=>tag[0])
            })
        } catch (error) {
            console.error(error);
            return next(error);
        }
    },
    // 해싵태그 제거
    async removeHashtag(req,res,next){
        try {
            const book = await db.Book.findOne({
                where:{
                    [Op.and]: [{ UserId:req.user.id}, { id: req.params.bookId }],
            }})
            if(!book){
               return res.status(404).json({
                    success:false,
                    msg:'요청해주신 책이 존재하지 않습니다.'
                })
            }
            // 해시태그 삭제
                await book.removeHashtag(req.params.hashtagId)
            res.json({
                msg:'해시태그 삭제 완료되었습니다.',

            })
        } catch (error) {
            console.error(error);
            return next(error);
        }
    },
    // 해시태그 가져오기
    // 해시태그 검색시, 해시태그 이름이 같은 책들을 가져온다.
    async getHashtagBooks(req,res,next){
        try {
            let page=Number(req.query.page);
            if(isNaN(page)){
                return res.status(400).json({
                    msg:'요청해주신 책들을 불러오지 못했습니다.'
                })
            }
            let limit=12;
            const offset=page?page*limit:0;
            console.log(typeof req.query.page,req.query.page,'알아서인코딩??')
            const books= await db.Book.findAll({
               limit,
               offset,
                order:[['createdAt','DESC']],
                include:[{
                    model:db.Hashtag,
                    where: {name:req.query.name},
                    as:'Hashtags',
                },
                {
                    model:db.User,
                    attributes:['id','username']
                },
                {
                  model:db.User,
                  as:'Likers',
                  attributes:['id']
              },{
                    model:db.Comment,
                    order:[['updatedAt','DESC']],
                    include:[{
                        model:db.User,
                        attributes:['id','username']
                    }]
            }]})

            if(!books.length){
                return res.status(404).json({
                     success:false,
                     msg:'요청해주신 책이 존재하지 않습니다.'
                 })
             }

           const totalCount=await db.Book.count({
                include:[{
                    model:db.Hashtag,
                    where: {name:req.query.name},
                    as:'Hashtags',
                }]
            })
            console.log('토탈확인좀',totalCount)
           res.json({
               success:true,
               books,
               totalCount,
               page:page+1,
               totalPage:Math.ceil(totalCount/limit)?Math.ceil(totalCount/limit):0
           })
           return
        } catch (error) {
            console.log('eeeeee??????????????????',req.query.name);
            return res.status(500).json({
                success:false,
                msg:'요청해주신 책이 존재하지 않습니다.',
                error
            })
        }
    }
}