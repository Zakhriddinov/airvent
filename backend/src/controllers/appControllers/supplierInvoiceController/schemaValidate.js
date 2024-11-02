const Joi = require('joi');

const createSchema = Joi.object({
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
        product: Joi.string().optional(),
        itemName: Joi.string().optional(),
        quantity: Joi.number().positive().required(),
        price: Joi.number().positive().required(),
        discount: Joi.number(),
        total: Joi.number().required(),
        unit: Joi.string().valid('m', 'kg', 'l', 'dona', 'm2').optional(),
      }).required()
    )
    .required(),
  currency: Joi.string().valid('UZS', 'USD').optional(),
  notes: Joi.string().optional(),
});

const updateSchema = Joi.object({
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
        product: Joi.string().optional(),
        itemName: Joi.string().optional(),
        quantity: Joi.number().positive().required(),
        price: Joi.number().positive().required(),
        discount: Joi.number(),
        total: Joi.number().required(),
        unit: Joi.string().valid('m', 'kg', 'l', 'dona', 'm2').optional(),
      }).required()
    )
    .required(),
  currency: Joi.string().valid('UZS', 'USD').optional(),
  notes: Joi.string().optional(),
});

module.exports = { createSchema, updateSchema };
