// 로그인 필요
exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
      }
    return res.status(401).send('로그인이 필요합니다.');
  };

  // 로그인 불필요
  exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return next();
    }
    return res.status(401).send('로그인한 사람은 할 수 없습니다..');
  };
  