const schema = require('./schemaValidate');
const mongoose = require('mongoose');
const Model = require('../../../models/appModels/ClientInvoice');
const { calculate } = require('../../../helpers');
const Client = require('../../../models/appModels/Client');
const Products = require('../../../models/appModels/Products');

const update = async (req, res) => {
  let body = req.body;
  const invoiceId = req.params.id; // path parameterdan invoiceId keladi

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

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Eski invoiceni topish
    const existingInvoice = await Model.findById(invoiceId).session(session);
    if (!existingInvoice) {
      throw new Error('Invoice not found');
    }

    // Avvalgi invoicedagi product quantity'larini rollback qilish
    for (let oldItem of existingInvoice.items) {
      const product = await Products.findById(oldItem.product).session(session);
      if (product) {
        product.quantity = calculate.add(product.quantity, oldItem.quantity); // rollback - eski quantity qaytariladi
        await product.save({ session });
      }
    }

    // Yangi ma'lumotlarni o'rnatish va product quantity'larini yangilash
    for (let item of items) {
      const { product, quantity, price } = item; // Chegirma yo'q

      // Mahsulotni ID bo'yicha olish
      const productResult = await Products.findById(product).session(session);
      if (!productResult) {
        throw new Error(`Product with ID ${product} not found`);
      }

      // Mahsulot narxi va miqdorini yangilash
      const oldQuantity =
        existingInvoice.items.find((i) => i.product.toString() === product.toString())?.quantity ||
        0;

      const quantityDifference = calculate.sub(quantity, oldQuantity);

      productResult.quantity = calculate.sub(productResult.quantity, quantityDifference); // Ombor miqdorini kamaytirish

      await productResult.save({ session });

      // Item uchun umumiy qiymatni hisoblash
      let itemTotal = calculate.multiply(quantity, price);

      // SubTotalni va item totalni yangilash
      subTotal = calculate.add(subTotal, itemTotal);
      item['total'] = itemTotal;
      item['price'] = price; // Chegirma olinmagan holda narxni yangilash
    }

    total = subTotal;
    body['subTotal'] = subTotal;
    body['total'] = total;
    body['items'] = items;
    body['updatedBy'] = req.user._id;

    // Invoice ma'lumotlarini yangilash
    const updatedInvoice = await Model.findByIdAndUpdate(invoiceId, body, { new: true, session });

    // Clientni yangilash
    const client = await Client.findById(updatedInvoice.client).session(session);
    if (!client) {
      throw new Error('Client not found');
    }

    // Eski client ma'lumotlarini rollback qilish
    client.turnover = calculate.sub(client.turnover, existingInvoice.subTotal);
    client.debt = calculate.sub(
      client.debt,
      existingInvoice.subTotal - existingInvoice.cash - existingInvoice.transfers
    );

    // Yangi client ma'lumotlarini hisoblash
    client.turnover = calculate.add(client.turnover, subTotal);
    client.debt = calculate.sub(client.turnover, client.cash + client.transfers);

    await client.save({ session });

    // Transactionni commit qilish
    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      result: updatedInvoice,
      message: 'Hisob-faktura muvaffaqiyatli yangilandi.',
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

module.exports = update;
