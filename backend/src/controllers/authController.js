const mailer = require('../utilities/mailer');
const bcrypt = require('bcryptjs');
const Admin = require('../models/auth/User');
const AdminPassword = require('../models/auth/UserPassword');
const { hashPassword } = require('../utilities/hashedPassword');
const jwt = require('jsonwebtoken');
const shortid = require('shortid');

// Foydalanuvchini ro'yxatdan o'tkazish funksiyasi
const registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    let admin = await Admin.findOne({ email });
    if (admin)
      return res
        .status(400)
        .json({ message: 'Foydalanuvchi allaqachon mavjud', status: 400, success: false });

    admin = new Admin({ email, name });
    await admin.save();
    const salt = bcrypt.genSaltSync(10);
    const emailToken = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const adminPassword = new AdminPassword({
      user: admin._id,
      password: hashPassword(password),
      salt,
      emailToken,
      emailTokenExpires: Date.now() + 3600000,
    });
    await adminPassword.save();

    const verificationLink = `http://localhost:3000/mail-verification?token=${emailToken}`;
    const mailContent = `<p>Emailingizni tasdiqlash uchun quyidagi havolaga bosing: <a href="${verificationLink}">Emailni tasdiqlash</a></p>`;

    await mailer(email, 'Emailni tasdiqlash', mailContent);

    res.status(201).json({
      message: "Foydalanuvchi muvaffaqiyatli ro'yxatdan o'tdi. Iltimos, emailingizni tasdiqlang.",
      status: 201,
      success: true,
      result: {},
    });
  } catch (error) {
    next(error);
  }
};

// Emailni tasdiqlash funksiyasi
const mailVerification = async (req, res, next) => {
  const { token } = req.query;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const adminPassword = await AdminPassword.findOne({ user: decoded.id });

    if (
      !adminPassword ||
      adminPassword.emailToken !== token ||
      adminPassword.emailTokenExpires < Date.now()
    ) {
      return res
        .status(400)
        .json({ message: 'Noto`g`ri yoki muddati o`tgan token', status: 400, success: false });
    }

    adminPassword.emailVerified = true;
    adminPassword.emailToken = undefined;
    adminPassword.emailTokenExpires = undefined;
    await adminPassword.save();

    res
      .status(201)
      .json({ message: 'Email muvaffaqiyatli tasdiqlandi', status: 201, success: true });
  } catch (error) {
    res.status(500).json({ message: error?.message, status: 500, success: false });
  }
};

// Foydalanuvchini tizimga kiritish funksiyasi
const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email, removed: false });
    if (!admin) {
      return res.status(400).json({
        message: 'Bu foydalanuvchi mavjud emas!',
        status: 400,
        success: false,
        result: null,
      });
    }

    const adminPassword = await AdminPassword.findOne({ user: admin._id, removed: false });
    if (!adminPassword) {
      return res
        .status(400)
        .json({ message: 'Email yoki parol xato!', status: 400, success: false });
    }

    const isValidPassword = bcrypt.compareSync(password, adminPassword.password);
    if (!isValidPassword) {
      return res
        .status(400)
        .json({ message: 'Email yoki parol xato!', status: 400, success: false });
    }

    if (!adminPassword.emailVerified) {
      console.log(`Email tasdiqlanmagan: ${admin._id}`);
      return res.status(400).json({ message: 'Email tasdiqlanmagan', status: 400, success: false });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: req.body.remember ? 365 * 24 + 'h' : '24h',
    });
    // adminPassword.activeTokens.push(token);
    await adminPassword.save();

    await AdminPassword.findOneAndUpdate(
      { user: admin._id },
      { $push: { loggedSessions: token } },
      {
        new: true,
      }
    ).exec();

    res.cookie('token', token, {
      maxAge: req.body.remember ? 365 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000, // 1 yil yoki 24 soat
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
      domain: req.hostname,
      path: '/',
      Partitioned: true,
    });

    res.status(200).json({
      message: 'Kirish muvaffaqiyatli amalga oshirildi',
      status: 200,
      success: true,
      result: {
        _id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        surname: admin?.surname,
        photo: admin?.photo,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Server xatosi', status: 500, error: error.message, success: false });
  }
};

// Parolni unutgan foydalanuvchi uchun parolni tiklash funksiyasi
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await Admin.findOne({ email: email, removed: false });
  const databasePassword = await AdminPassword.findOne({ user: user._id, removed: false });

  if (!user.enabled) {
    return res.status(409).json({
      success: false,
      result: null,
      message: "Hisobingiz o'chirilgan, hisobingiz administratoriga murojaat qiling",
    });
  }

  if (!user)
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No account with this email has been registered.',
    });

  const resetToken = shortid.generate();
  await AdminPassword.findOneAndUpdate(
    { user: user._id },
    { resetToken },
    {
      new: true,
    }
  ).exec();

  const mailContent = 'http://localhost:3000' + '/resetpassword/' + user._id + '/' + resetToken;
  await mailer(email, 'Parolni tiklash', mailContent);
  return res.status(200).json({
    success: true,
    result: null,
    message: 'Check your email inbox , to reset your password',
  });
};

// Parolni tiklash funksiyasi
const resetPassword = async (req, res) => {
  const { userId, token, password } = req.body;

  try {
    const user = await Admin.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Foydalanuvchi topilmadi',
      });
    }

    const adminPassword = await AdminPassword.findOne({ user: userId });
    if (!adminPassword || adminPassword.resetToken !== token) {
      return res.status(400).json({
        success: false,
        message: 'Noto`g`ri token',
      });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(salt + password, 10);

    adminPassword.password = hashedPassword;
    adminPassword.salt = salt;
    adminPassword.resetToken = undefined;
    await adminPassword.save();

    return res.json({
      success: true,
      message: 'Parol muvaffaqiyatli tiklandi',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server xatosi',
      error: error.message,
    });
  }
};

const logout = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(400).json({
      success: false,
      message: 'Foydalanuvchi tizimga kirmagan',
    });
  }

  try {
    const adminPassword = await AdminPassword.findOne({ user: req.user._id });

    if (!adminPassword) {
      return res.status(400).json({
        success: false,
        message: 'Foydalanuvchi topilmadi yoki tizimga kirmagan',
      });
    }

    await AdminPassword.findOneAndUpdate(
      { user: req.user._id },
      { $pull: { loggedSessions: token } },
      { new: true }
    ).exec();

    res.clearCookie('token', {
      maxAge: null,
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      domain: req.hostname,
      Path: '/',
    });

    return res.json({
      success: true,
      result: {},
      message: 'Muvaffaqiyatli tizimdan chiqdingiz',
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Server xatosi',
      status: 500,
      error: error.message,
      success: false,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  resetPassword,
  forgotPassword,
  logout,
  mailVerification,
};
