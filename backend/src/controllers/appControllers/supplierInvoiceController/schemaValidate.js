const Joi = require('joi');

const schema = Joi.object({
  supplier: Joi.alternatives()
    .try(
      Joi.string().required(),
      Joi.object({
        id: Joi.string().required(),
        name: Joi.string().required(),
      }).required()
    )
    .required(),
  number: Joi.number().integer().min(1).required(),
  year: Joi.number().integer().min(1900).max(new Date().getFullYear()).required(),
  status: Joi.string()
    .valid('draft', 'pending', 'sent', 'refunded', 'cancelled', 'on hold')
    .required(),
  expiredDate: Joi.string().required(),
  date: Joi.string().required(),
  items: Joi.array()
    .items(
      Joi.object({
        product: Joi.string().required(),
        quantity: Joi.number().positive().required(),
        price: Joi.number().positive().required(),
        discount: Joi.number().required(),
      }).required()
    )
    .required(),
  currency: Joi.string().valid('UZS', 'USD').required(),
});

module.exports = schema;
