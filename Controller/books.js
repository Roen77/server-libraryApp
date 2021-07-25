const request = require('request');
const db = require('../models');
const { Op } = require("sequelize");
require('dotenv').config();

const getBooks = () =>{
    
}
module.exports={
    // 카카오 검색
    kakaosearch(req,res,next){
        //통합 검색
        const api_url='https://dapi.kakao.com/v3/search/book?query=' + encodeURI(req.query.query);
        let  option={
            size:req.query.size,
            page:req.query.page
        };
        //타이틀 검색,isbn검색,저자 검색,출판사 검색
        if(req.query.target){
            option={...option,target:encodeURI(req.query.target)}
        }

        let options={
            url:api_url,
            qs:option,
            headers: {"Authorization":` KakaoAK ${process.env.KAKAO_APIKEY}`}
        };

        request.get(options,function(error,response,body){
            if(!error && response.statusCode == 200){
                res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
               res.end(body);
            }else{
                res.status(response.statusCode).end();
                console.log('error = ' + response.statusCode);
            }
        })
    },
    // 책  추가
    async addBook(req,res,next){
        try {
            const {title,contents,url,isbn,authors,publisher,datetime} = req.body;
            // 책제목과 isbn,책저자가 같은 책이 있는 지 찾는다.
        const book=await db.Book.findOne({where:{
            [Op.and]: [{ UserId:req.user.id },{title:title},{isbn:isbn},{publisher:publisher}],    
        }})
        //  Amazon S3 버킷을 이용해 이미지를 저장한 후 req.file이 있다면, location를 저장하고,없다면 req.body.thumbnail를 저장한다. 
        let thumbnail=req.file?req.file.location:req.body.thumbnail
        //  책제목과 isbn,책저자가 같은 책이 없다면 새로운 책을 추가한다.
        if(!book){
            const newBook = await db.Book.create({
                title,contents,url,isbn,authors,publisher,datetime,UserId:req.user.id,thumbnail
            },)
           return res.json({
                success:true,
                book:newBook,
                msg:'책이 성공적으로 추가되었습니다.'
            })
        }else{
            return res.status(400).json({
                success:false,
                msg:'이미 추가된 책입니다.'
            })
        }
        } catch (error) {
            console.error(error);
            return next(error);
        }
        
    },
    // 책들 가져오기
    async fetchBooks(req,res,next){
        try {
            let page=req.query.page;
            // 12개씩 가져오기
            let limit=12;
            const offset=page?page*limit:0;
           const books= await db.Book.findAll({
               limit,
               offset,
               where:{UserId:req.user.id},
                order:[['createdAt','DESC']],
                include:[{
                    model:db.Hashtag,
                    as:'Hashtags',
                    attributes:['id','name']
                },
                {
                    model:db.User,
                    as:'Likers',
                    attributes:['username']
                },{
                    model:db.Comment,
                    order:[['updatedAt','DESC']],
                    include:[{
                        model:db.User,
                        attributes:['id','username']
                    }]
            }]})
            // 전체 책의 갯수
           const totalCount=await db.Book.count({where:{UserId:req.user.id}})
           res.json({
               success:true,
               books,
               totalCount,
               page,
               totalPage:Math.ceil(totalCount/limit)?Math.ceil(totalCount/limit):0
           })
           return
        } catch (error) {
            console.error(error);
            return next(error);
        }
    },
    // 책 가져오기
    async fetcbBook(req,res,next){
        try {
          const book=  await db.Book.findOne({where:{
            [Op.and]: [{ UserId:req.user.id }, { id: req.params.bookId }],      
            },
        include:[{
            model:db.Hashtag,
            as:'Hashtags',
            
        },{
            model:db.User,
            as:'Likers',
            attributes:['username']
        }]})    
            res.json({
                success:true,
                book,
            })
        } catch (error) {
            console.error(error);
            return next(error);
        }
    },
    // 책 삭제하기
    async deleteBook(req,res,next){
        try {
            await db.Book.destroy({where:{
                [Op.and]: [{ UserId:req.user.id }, { id: req.params.bookId }],      
                }})
            return res.json({
                success:true,
                msg:'성공적으로 제거되었습니다.'
            })
        } catch (error) {
            console.error(error);
            return next(error);
        }
    },
    // 책 수정
    async updateBook(req,res,next){
        try {
            const {title,contents,url,isbn,authors,publisher,datetime} = req.body;
            let thumbnail=req.file?req.file.location:null
          await db.Book.update({
                title,contents,url,isbn,authors,publisher,datetime,
                thumbnail
            },{where:{
                [Op.and]: [{ UserId:req.user.id }, { id: req.params.bookId }]      
                }})

                const book=  await db.Book.findOne({where:{
                    [Op.and]: [{ UserId:req.user.id }, { id: req.params.bookId }],      
                    },
                    include:[{
                        model:db.Comment,
                        order:[['updatedAt','DESC']],
                        include:[{model:db.User,attributes:['id','username']}]
                    }]})
            return res.json({
                success:true,
                msg:'성공적으로 수정완료되었습니다.',
                book,
            })
        } catch (error) {
            console.error(error);
            return next(error);
        }
    },
    // 북마크 추가
    async addBookmark(req,res,next){
        try {
            // bookmark 속성값으로 북마크 유무를 수정해준다.
            await db.Book.update({bookmark:true},{where:{
                [Op.and]: [{ UserId:req.user.id }, { id: req.params.bookId }],        
            }})
            return res.json({
                success:true,
                msg:'성공적으로 북마크 추가 완료되었습니다.',
            })
        } catch (error) {
            console.error(error);
            return next(error);
        }
    },
    // 북마크 삭제
    async removeBookmark(req,res,next){
        try {
            await db.Book.update({bookmark:false},{where:{
                [Op.and]: [{ UserId:req.user.id }, { id: req.params.bookId }],        
            }})
            return res.json({
                success:true,
                msg:'성공적으로 북마크 삭제 완료되었습니다.',
            })
        } catch (error) {
            console.error(error);
            return next(error);
        }
    },
    // 다른 사용자의 책들 가져오기
    // 내 책이 아닌 다른 사용자의 책은 검색할 수  있도록 구현
    async otherFetchBooks(req,res,next){
        try {
            let page=req.query.page;
            let limit=12;
            let where;
            const offset=page?page*limit:0;
            // 책 검색 시,
            if(req.query.search && req.query.target){
                switch (req.query.search) {
                    // 책 제목으로 검색
                    case "책제목":
                        where={[Op.and]:[{UserId:{[Op.ne]:req.user.id}},{
                            title:{
                                [Op.like]:`%${decodeURIComponent(req.query.target)}%`
                            }
                        }]}
                      break;
                    //   저자로 검색
                    case "저자":
                      where={[Op.and]:[{UserId:{[Op.ne]:req.user.id}},{
                            authors:{
                                [Op.like]:`%${decodeURIComponent(req.query.target)}%`
                            }
                        }]}
                    break;
                    default:
                        break;
                }
            }else{
                // 다른 사용자의 책일 때
                where={UserId:{[Op.ne]:req.user.id}}
            }
          const books=  await db.Book.findAll({
            limit,
            offset,
            where,
            include:[{
                model:db.Hashtag,
                as:'Hashtags',
            },{
              model:db.User,
              attributes:['id','username']
          },
          {
            model:db.User,
            as:'Likers',
            attributes:['id']
        },{
            model:db.User,
            as:'Likers',
            attributes:['username']
        },{
              model:db.Comment,
              order:[['updatedAt','DESC']],
              include:[{
                  model:db.User,
                  attributes:['id','username']
              }]
          }],
        order:[['createdAt','DESC']]})
        // 조건에 맞는 책의 갯수
          const totalCount=await db.Book.count({where})
       return res.json({
            success:true,
            books,
            totalCount,
            page,
            totalPage:Math.ceil(totalCount/limit)?Math.ceil(totalCount/limit):0
        })
        } catch (error) {
            console.error(error);
            return next(error);
        }
    },
    // 다른 사용자의 책 가져오기
    async otherFetchBook(req,res,next){
        try {
          const book=  await db.Book.findOne({
            where:{
            [Op.and]: [{ UserId:{[Op.ne]:req.user.id} }, { id: req.params.bookId }],      
            },
            include:[{
                model:db.User,
                attributes:['id','username']
            },{
                model:db.Hashtag,
                as:'Hashtags',
            },{
                model:db.User,
                as:'Likers',
                attributes:['username']
            }]})    
            res.json({
                success:true,
                book,
            })
        } catch (error) {
            console.error(error);
            return next(error);
        }
    },
    // 다른사람 책 좋아요
    async otheraddLike(req,res,next){
        try {
            const book = await db.Book.findOne({
                where:{
                    [Op.and]: [{ UserId:{[Op.ne]:req.user.id} }, { id: req.params.bookId }],    
            }})
            if(!book){
                return res.status(404).send('해당 책이 존재하지 않습니다.');
            }
            await book.addLiker(req.user.id)
            res.json({ userId: req.user.id });
        } catch (error) {
            console.error(error);
            return next(error);
        }
    },
    //다른 사람 책 좋아요 해제
    async otherremoveLike(req,res,next){
        try {
            const book = await db.Book.findOne({
                where:{
                    [Op.and]: [{ UserId:{[Op.ne]:req.user.id} }, { id: req.params.bookId }],    
            }})
            if(!book){
                return res.status(404).send('해당 책이 존재하지 않습니다.');
            }
            await  book.removeLiker(req.user.id)
            res.json({ userId: req.user.id });
        } catch (error) {
            console.error(error);
            return next(error);
        }
    },
}

