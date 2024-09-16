const schema = require('./schemaValidate');
const mongoose = require('mongoose');
const Model = require('../../../models/appModels/SupplierInvoice');
const { calculate } = require('../../../helpers');
const Supplier = require('../../../models/appModels/Supplier');

const create = async (req, res) => {
  let body = req.body;

  const { error, value } = schema.validate(body);
  if (error) {
    const { details } = error;
    return res.status(400).json({
      success: false,
      result: null,
      message: details[0]?.message,
    });
  }

  const { items = [] } = value;

  let subTotal = 0;
  let total = 0;

  items.map((item) => {
    let total = calculate.multiply(item['quantity'], item['price']);
    //sub total
    subTotal = calculate.add(subTotal, total);
    //item total
    item['total'] = total;
  });

  total = subTotal;

  body['subTotal'] = subTotal;
  body['total'] = total;
  body['items'] = items;
  body['createdBy'] = req.user._id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const result = await new Model(body).save({ session });

    // Supplier'ni topish va yangilash
    const supplier = await Supplier.findById(result.supplier).session(session);
    if (!supplier) {
      throw new Error('Supplier not found');
    }

    supplier.turnover += subTotal;
    supplier.debtEnd = supplier.debtStart + supplier.turnover - supplier.cash - supplier.transfers;

    await supplier.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      result: result,
      message: 'Invoice and Supplier updated successfully',
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error',
    });
  }
};

module.exports = create;
