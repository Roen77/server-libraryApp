const dotenv=require('dotenv');
dotenv.config();
// 로그인 필요
exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
      }
    return res.status(401).json({
      msg:'로그인이 필요합니다.',
      auth:true
    })
  };

  // 로그인 불필요
  exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return next();
    }
    return res.status(401).json({
      msg:'이미 로그인되어 있어 사용할 수 없습니다.',
      authed:true
    })

  };
  // 로그인 불필요
  exports.isNitLoggedReDirect = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return next();
    }
    return res.redirect('https://vue.roen.pe.kr')
  };
