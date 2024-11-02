const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authValidation = require('../validators/authValidators');
const isValidAuthToken = require('../middlewares/isValidAuthToken');

router.post('/register', authValidation.registerValidation, authController.registerUser);
router.post('/login', authValidation.loginValidation, authController.loginUser);
router.get('/mail-verification', authController.mailVerification);
router.post(
  '/reset-password',
  authValidation.resetPasswordValidation,
  authController.resetPassword
);
router.post(
  '/forgot-password',
  authValidation.forgotPasswordValidation,
  authController.forgotPassword
);
router.post('/logout', isValidAuthToken, authController.logout);

module.exports = router;
