const { updateSchema } = require('./schemaValidate');
const mongoose = require('mongoose');
const Model = require('../../../models/appModels/SupplierInvoice');
const { calculate } = require('../../../helpers');
const Supplier = require('../../../models/appModels/Supplier');
const Products = require('../../../models/appModels/Products');
const Transaction = require('../../../models/appModels/SupplierPayment');

/**
 * Bog'liq tranzaksiyalar mavjudligini tekshirish uchun funksiya
 * @param {String} invoiceId - Invoice ID
 * @returns {Boolean} - True agar bog'liq tranzaksiyalar mavjud bo'lsa, aks holda false
 */
const relatedTransactionsExist = async (invoiceId) => {
  try {
    // Transaction kolleksiyasida invoice bilan bog'liq tranzaksiyalarni qidirish
    const relatedTransactions = await Transaction.find({ invoice: invoiceId });

    // Agar bog'liq tranzaksiyalar mavjud bo'lsa, true qaytaradi, aks holda false
    return relatedTransactions.length > 0;
  } catch (error) {
    console.error('Tegishli tranzaktsiyalarni tekshirishda xatolik yuz berdi:', error);
    throw new Error('Tegishli tranzaktsiyalarni tekshirishda xatolik yuz berdi');
  }
};

const update = async (req, res) => {
  let body = req.body;
  const invoiceId = req.params.id;

  const { error, value } = updateSchema.validate(body);
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
      throw new Error('Hisob-faktura topilmadi');
    }

    // 1. Invoice "Yopilgan" yoki "To'langan" bo'lsa, yangilashni taqiqlash
    if (existingInvoice.status === 'paid') {
      throw new Error("Hisob-faktura allaqachon yopilgan yoki to'langan");
    }

    // 2. Invoice bilan bog'liq boshqa tranzaksiyalar mavjudligini tekshirish
    const hasRelatedTransactions = await relatedTransactionsExist(invoiceId);
    if (hasRelatedTransactions) {
      throw new Error(
        'Hisob-fakturada tegishli operatsiyalar mavjud. Yangilanishlarga ruxsat berilmaydi.'
      );
    }

    // 3. Eski invoicedagi product quantity'larini rollback qilish
    for (let oldItem of existingInvoice.items) {
      const product = await Products.findById(oldItem.product).session(session);
      if (product) {
        product.quantity = calculate.sub(product.quantity, oldItem.quantity);
        await product.save({ session });
      }
    }

    // Supplierni yangilash
    const supplier = await Supplier.findById(existingInvoice.supplier._id).session(session);
    if (!supplier) {
      throw new Error('Yetkazib beruvchi topilmadi');
    }
    // Yangi ma'lumotlarni o'rnatish va product quantity'larini yangilash
    for (let item of items) {
      const { product, quantity, price, discount = 0 } = item;

      if (product !== null && product) {
        // Mahsulotni ID bo'yicha olish va o'chirilgan yoki mavjud emasligini tekshirish
        const productResult = await Products.findById(product).session(session);
        if (!productResult || productResult.status === 'deleted') {
          throw new Error(`Product with ID ${product} is either deleted or does not exist`);
        }

        // Chegirma mavjud bo'lsa, narxni hisoblash
        let discountedPrice = price;
        if (discount > 0) {
          discountedPrice = (price * discount) / 100 + price;
        }

        // Eski quantity'ni topish (agar mavjud bo'lsa)
        const oldItem = existingInvoice.items.find(
          (i) => i.product && i.product.toString() === product.toString()
        );

        if (oldItem) {
          // Agar eski mahsulot mavjud bo'lsa, quantity farqini hisoblash
          const quantityDifference = calculate.sub(quantity, oldItem.quantity);
          productResult.quantity = calculate.add(productResult.quantity, quantityDifference);
        } else {
          // Agar mahsulot yangi bo'lsa, quantity'ni to'g'ridan-to'g'ri qo'shish
          productResult.quantity = calculate.add(productResult.quantity, quantity);
        }

        // Mahsulotni yangilash
        productResult.price = discountedPrice;
        await productResult.save({ session });
      }

      // Item uchun umumiy qiymatni hisoblash
      let itemTotal = calculate.multiply(quantity, price);

      // SubTotalni va item totalni yangilash
      subTotal = calculate.add(subTotal, itemTotal);
      item['total'] = itemTotal;
      item['price'] = price; // Chegirma qilingan narxni yangilash
    }

    total = subTotal;
    body['subTotal'] = subTotal;
    body['total'] = total;
    body['items'] = items;
    body['updatedBy'] = req.user._id;
    body['currency'] = supplier.currency;

    // Invoice ma'lumotlarini yangilash
    const updatedInvoice = await Model.findByIdAndUpdate(invoiceId, body, { new: true, session });

    // Eski supplier ma'lumotlarini rollback qilish
    supplier.turnover = calculate.sub(supplier.turnover, existingInvoice.subTotal);
    supplier.debt = calculate.sub(
      supplier.debt,
      existingInvoice.subTotal - existingInvoice.cash - existingInvoice.transfers
    );

    // Yangi supplier ma'lumotlarini hisoblash
    supplier.turnover = calculate.add(supplier.turnover, subTotal);
    supplier.debt = calculate.sub(supplier.turnover, supplier.cash + supplier.transfers);

    await supplier.save({ session });

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
