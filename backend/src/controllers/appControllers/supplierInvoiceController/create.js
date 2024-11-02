const { createSchema } = require('./schemaValidate');
const mongoose = require('mongoose');
const Model = require('../../../models/appModels/SupplierInvoice');
const { calculate } = require('../../../helpers');
const Supplier = require('../../../models/appModels/Supplier');
const Products = require('../../../models/appModels/Products');

const create = async (req, res) => {
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
    // Fetch and verify the supplier
    const supplier = await Supplier.findById(body.supplier).session(session);
    if (!supplier) {
      throw new Error('Supplier not found');
    }

    // Set currency in the body based on supplier's currency
    body['currency'] = supplier.currency;

    // Loop through each item to update products and calculate totals
    for (let item of items) {
      const { product, quantity, price, discount = 0 } = item;

      if (product) {
        // Fetch the product by its ID
        const productResult = await Products.findById(product).session(session);
        if (!productResult) {
          throw new Error(`Product with ID ${product} not found`);
        }

        // Calculate the discounted price if a discount is provided
        let discountedPrice = price;
        if (discount > 0) {
          discountedPrice = (price * discount) / 100 + price;
        }

        // Update product's price and quantity in the database
        productResult.price = discountedPrice;
        productResult.quantity = calculate.add(productResult.quantity, quantity); // Adjust the quantity

        await productResult.save({ session });
      }

      // Calculate the total for the item
      let itemTotal = calculate.multiply(quantity, price);

      // Update subTotal and item total
      subTotal = calculate.add(subTotal, itemTotal);
      item['total'] = itemTotal;
      item['price'] = price; // Update the item's price with the discounted one
    }

    total = subTotal;
    body['subTotal'] = subTotal;
    body['total'] = total;
    body['items'] = items;
    body['createdBy'] = req.user._id;

    // Create the invoice
    const result = await new Model(body).save({ session });

    supplier.turnover += subTotal;
    supplier.debt = supplier.turnover - supplier.cash - supplier.transfers;

    await supplier.save({ session });

    // Commit the transaction
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
