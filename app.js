const express= require('express');
const morgan=require('morgan');
const cors=require('cors');
const helmet = require('helmet');
const hpp = require('hpp');
const dotenv=require('dotenv');
const passporConfig=require('./passport')
const session = require('express-session');
const cookie = require('cookie-parser');
const passport = require('passport');
const {sequelize} = require('./models');
const prod=process.env.NODE_ENV === 'production'
const PORT= 5000;
dotenv.config();
const logger = require('./logger');
// 라우터
const userRouter= require('./router/user');
const bookRouter=require('./router/books');
const hashtagRouter=require('./router/hashtags')
const profileRouter=require('./router/profile')
const thumbnailRouter=require('./router/thumbnail')


const app =express();


// db 연결
sequelize.sync()
.then(()=>{
    console.log('db 연결 성공')
})
.catch(err=>{
  console.log(err)
  logger.error(err);
});
passporConfig();

if (prod) {
  app.use(morgan('combined'));
  app.use(helmet());
  app.use(hpp());
  // cors 에러 방지
app.use(cors({
  origin:'https://vue.roen.pe.kr',
    credentials: true,
}));
} else {
  app.use(morgan('dev'));
  // cors 에러 방지
app.use(cors({
  origin:['http://localhost:3000','http://localhost:5000'],
    credentials: true,
}));

}

app.use(express.json());
app.use(express.urlencoded({extended:false}));

// app.set('trust proxy', true);
// app.set('trust proxy', 1)
app.use(cookie(process.env.COOKIE_KEY));
const sessionOption = {
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_KEY,
  cookie: {
    httpOnly: true,
    secure: false,
    domain: prod && '.roen.pe.kr',
  },
};
if (prod) {
  sessionOption.proxy = true;
  // sessionOption.cookie.sameSite='none'
  // sessionOption.cookie.sameSite=false
  sessionOption.cookie.secure = true;
}
app.use(session(sessionOption));
// passport 초기화
app.use(passport.initialize());
app.use(passport.session());

app.use('/user',userRouter);
app.use('/books',bookRouter)
app.use('/hashtags',hashtagRouter)
app.use('/profiles',profileRouter);
app.use('/thumbnail',thumbnailRouter);


app.get('/',(req,res)=>{
  console.log('test')
  return res.json({
    test:'test'
  })
})

// test
app.listen(prod?process.env.PORT:PORT,()=>{
    console.log(`${prod?process.env.PORT:PORT}번에서 실행중`)
    logger.info(`${prod?process.env.PORT:PORT}`);
});