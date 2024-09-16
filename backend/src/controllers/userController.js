const User = require('../models/userModel');
const { hashPassword } = require('../utilities/hashedPassword');
const mailer = require('../utilities/mailer');

const userRegister = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const isExists = await User.findOne({ email });

    if (isExists) {
      return res.status(400).json({
        success: false,
        message: 'Email Already Exists!',
      });
    }

    const user = new User({
      name,
      email,
      phone,
      password: hashPassword(password),
      image: 'images/' + req?.file?.filename,
    });

    const userData = await user.save();

    const msg = `<p>Hii ${name}, Please <a href="http://127.0.0.1:8889/mail-verification?id=${userData._id}">Verify</a> your mail </p>`;

    mailer.sendMail(email, 'Mail verification', msg);
    return res.status(200).json({
      success: true,
      message: 'Successfully register user',
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const mailVerification = async (req, res) => {
  try {
    if (req.query.id === undefined) {
      return res.render('404');
    }
    const userData = await User.findOne({ _id: req.query.id });
    if (userData) {
      if (userData.is_verified) {
        return res.render('mail-verification', { message: 'Your mail has already verified Successfully!' });
      }

      await User.findByIdAndUpdate(
        { _id: req.query._id },
        {
          $set: {
            is_verified: 1,
          },
        }
      );
      return res.render('mail-verification', { message: 'Mail has been verified Successfully!' });
    } else {
      return res.render('mail-verification', { message: 'User not found!' });
    }
  } catch (error) {
    console.log(error.message);
    return res.render('404');
  }
};

module.exports = { userRegister, mailVerification };
