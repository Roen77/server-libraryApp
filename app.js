const express= require('express');
const morgan=require('morgan');
const cors=require('cors');
const helmet = require('helmet');
const hpp = require('hpp');
const dotenv=require('dotenv');
const passporConfig=require('./passport');
const session = require('express-session');
const cookie = require('cookie-parser');
const passport = require('passport');
const {sequelize} = require('./models');
const PORT= 5000;
dotenv.config();
const logger = require('./logger');
// 라우터
const userRouter= require('./router/user');
const bookRouter=require('./router/books');
const profileRouter=require('./router/profile')

const app =express();


app.use(cookie(process.env.COOKIE_KEY));
app.use(session({
  maxAge:24*60*60*1000,
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_KEY,
  cookie: {
    httpOnly: true,
    secure: false,
  }
}));

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

if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
  app.use(helmet());
  app.use(hpp());
} else {
  app.use(morgan('dev'));
}
// cors 에러 방지
app.use(cors({
  origin:['http://localhost:3000','http://localhost:5000','https://nuxt-libraryapp.herokuapp.com'],
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({extended:false}));

// passport 초기화
app.use(passport.initialize());
app.use(passport.session());

app.use('/user',userRouter);
app.use('/books',bookRouter)
app.use('/profiles',profileRouter);


app.get('/',(req,res)=>{
  console.log('test')
  return res.json({
    test:'test'
  })
})


app.listen(PORT,()=>{
    console.log(`${PORT}번에서 실행중`)
    logger.info(`${PORT}`);
});