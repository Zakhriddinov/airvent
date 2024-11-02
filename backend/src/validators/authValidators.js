const Joi = require('joi');
const validationError = require('../handlers/validationError');
// Parol validatsiyasi
const passwordValidation = Joi.string()
  .min(8)
  .max(30)
  .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])'))
  .messages({
    'string.empty': 'Parol kiritilishi shart',
    'string.min': 'Parol kamida 8 belgidan iborat bo‘lishi kerak',
    'string.max': 'Parol eng ko‘pi bilan 30 belgidan iborat bo‘lishi kerak',
    'string.pattern.base':
      'Parol kamida bitta katta harf, bitta kichik harf, bitta raqam va bitta maxsus belgi (!@#$%^&*) bo‘lishi kerak',
    'any.required': 'Parol kiritilishi shart',
  })
  .required();

// Ro'yxatdan o'tish uchun validatsiya
const registerValidation = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required().messages({
      'string.empty': 'Ism kiritilishi shart',
    }),
    email: Joi.string().email().required().messages({
      'string.empty': 'Email kiritilishi shart',
      'string.email': 'Email manzili noto`g`ri formatda',
    }),
    password: passwordValidation,
  });

  validationError.validateRequest(schema, req, res, next);
};

// Kirish uchun validatsiya
const loginValidation = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: true } })
      .required()
      .messages({
        'string.empty': 'Email kiritilishi shart',
        'string.email': 'Email manzili noto`g`ri formatda',
      }),
    password: passwordValidation,
    remember: Joi.boolean(),
  });

  validationError.validateRequest(schema, req, res, next);
};

// Parolni unutganlar uchun validation
const forgotPasswordValidation = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: true } })
      .required()
      .messages({
        'string.empty': 'Email kiritilishi shart',
        'string.email': 'Email manzili noto`g`ri formatda',
        'any.required': 'Email kiritilishi shart',
      }),
  });

  validationError.validateRequest(schema, req, res, next);
};

// Parolni tiklash uchun validatsiya
const resetPasswordValidation = async (req, res, next) => {
  const schema = Joi.object({
    token: Joi.string().required().messages({
      'string.empty': 'Token kiritilishi shart',
      'any.required': 'Token kiritilishi shart',
    }),
    password: passwordValidation,
    userId: Joi.string().required(),
  });

  validationError.validateRequest(schema, req, res, next);
};

module.exports = {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
};
