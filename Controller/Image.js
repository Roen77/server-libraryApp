const aws= require('aws-sdk');
const multer=require('multer');
const multer3=require('multer-s3');
require("dotenv").config();
// Amazon S3 버킷에 이미지 저장
aws.config.update({
    secretAccessKey:process.env.AWSSECRETKEY,
    accessKeyId:process.env.AWSACCESSKEYID,
    region:'us-west-1'
})
let s3= new aws.S3();

upload=multer({
    storage:multer3({
        s3:s3,
        bucket:"myimageslist",
        acl:'public-read',
        metadata:function(req,file,cb){
            cb(null,{fieldName:file.fieldname})
        },
        key:function(req,file,cb){
            cb(null,Date.now().toString())
        },
    }),
    limits: { fileSize: 20 * 1024 * 1024 },
}),



module.exports={
    upload,
    async uploadImage(req,res,next){
        try {
            res.json(req.file.location)
        } catch (error) {
            console.error(error);
            next(error)
        }
    }
}