const jwt = require('jsonwebtoken');

const mongoose = require('mongoose');

const isValidAuthToken = async (req, res, next) => {
  try {
    const UserPassword = mongoose.model('UserPassword');
    const User = mongoose.model('User');
    const token = req.cookies.token;

    if (!token)
      return res.status(401).json({
        success: false,
        result: null,
        message: 'Avtorizatsiya rad etildi, autentifikatsiya tokeni mavjud emas',
        jwtExpired: true,
      });

    const verified = jwt.verify(token, process.env.JWT_SECRET);

    if (!verified)
      return res.status(401).json({
        success: false,
        result: null,
        message: 'Token tekshiruvi amalga oshmadi, avtorizatsiya rad etildi.',
        jwtExpired: true,
      });

    const userPasswordPromise = UserPassword.findOne({ user: verified.id, removed: false });
    const userPromise = User.findOne({ _id: verified.id, removed: false });

    const [user, userPassword] = await Promise.all([userPromise, userPasswordPromise]);

    if (!user)
      return res.status(401).json({
        success: false,
        result: null,
        message: 'Foydalanuvchi mavjud emas, avtorizatsiya rad etildi.',
        jwtExpired: true,
      });

    const { loggedSessions } = userPassword;
    if (!loggedSessions.includes(token))
      return res.status(401).json({
        success: false,
        result: null,
        message:
          'Foydalanuvchi allaqachon tizimdan chiqqan, qayta kirishga harakat qiling, avtorizatsiya rad etildi.',
        jwtExpired: true,
      });
    else {
      const reqUserName = 'User'.toLowerCase();
      req[reqUserName] = user;
      next();
    }
  } catch (error) {
    return res.status(503).json({
      success: false,
      result: null,
      message: error.message,
      error: error,
      controller: 'isValidAuthToken',
    });
  }
};

module.exports = isValidAuthToken;
