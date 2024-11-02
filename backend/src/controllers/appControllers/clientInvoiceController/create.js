const { createSchema } = require('./schemaValidate');
const mongoose = require('mongoose');
const Model = require('../../../models/appModels/ClientInvoice');
const { calculate } = require('../../../helpers');
const Client = require('../../../models/appModels/Client');
const Products = require('../../../models/appModels/Products');

const create = async (Model, req, res) => {
  let body = req.body;

  const { error, value } = createSchema.validate(body);
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
    const client = await Client.findById(body.client).session(session);
    if (!client) {
      throw new Error('Mijoz mavjud emas!');
    }
    body['currency'] = client?.currency;
    // Mahsulotlarni loop orqali o'zgartirish va umumiy summalarni hisoblash
    for (let item of items) {
      const { product, quantity, price, discount = 0, itemName } = item;

      // Mahsulot yoki itemName dan foydalanish sharti
      if (!product && !itemName) {
        throw new Error('Product yoki itemName kiritilishi shart');
      }

      let discountedPrice = price;

      if (product) {
        // Mahsulotni ID bo'yicha olish
        const productResult = await Products.findById(product).session(session);
        if (!productResult) {
          throw new Error(`Product with ID ${product} not found`);
        }

        // Mahsulot miqdorini kamaytirish
        if (productResult.quantity < quantity) {
          throw new Error(`'${productResult?.name}' - mahsuloti uchun miqdor yetarli emas`);
        }
        productResult.quantity = calculate.sub(productResult.quantity, quantity);

        await productResult.save({ session });

        // Chegirma hisoblash
        if (discount > 0) {
          discountedPrice = price - (price * discount) / 100;
        }
      }

      // Mahsulot summasini hisoblash
      let itemTotal = calculate.multiply(quantity, discountedPrice);

      // Umumiy summa va subtotal yangilash
      subTotal = calculate.add(subTotal, itemTotal);
      item['total'] = itemTotal;
      item['price'] = price;
    }

    total = subTotal;
    body['subTotal'] = subTotal;
    body['total'] = total;
    body['items'] = items;
    body['createdBy'] = req.user._id;

    const result = await new Model(body).save({ session });

    client.turnover += subTotal;
    client.debt = client.turnover - client.cash - client.transfers;

    await client.save({ session });

    // PDF faylini yaratish va invoicega qo'shish
    const fileId = 'invoice-' + result._id + '.pdf';
    result.pdf = fileId;
    await result.save({ session });

    // Transactionni commit qilish
    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      result: result,
      message: 'Hisob-faktura muvaffaqiyatli yangilandi',
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
