const Invoice = require('../../../models/appModels/SupplierInvoice');
const Supplier = require('../../../models/appModels/Supplier');
const { calculate } = require('../../../helpers');

const update = async (Model, req, res) => {
  const {
    amount: newAmount,
    invoice: invoiceId,
    paymentMode,
    supplier: supplierId,
    number,
    description,
  } = req.body;
  const paymentId = req.params.id;

  if (newAmount === 0) {
    return res.status(202).json({
      success: false,
      result: null,
      message: `The Minimum Amount couldn't be 0`,
    });
  }

  // Fetch the current invoice
  const currentInvoice = await Invoice.findOne({
    _id: invoiceId,
    removed: false,
  });

  if (!currentInvoice) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'Invoice not found',
    });
  }

  // Check if the invoice is already fully paid
  if (currentInvoice.paymentStatus === 'paid') {
    return res.status(400).json({
      success: false,
      result: null,
      message: "To'lov to'liq amalga oshirilgan, yangilash mumkin emas",
    });
  }

  // Extract supplierId from the invoice
  // const supplierId = currentInvoice.supplier;

  // Fetch the previous payment
  const previousPayment = await Model.findOne({
    _id: paymentId,
    removed: false,
  });

  if (!previousPayment) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'Payment not found',
    });
  }

  const oldAmount = previousPayment.amount;
  const { total: previousTotal, credit: previousCredit } = currentInvoice;

  // Calculate max allowable amount
  const maxAmount = calculate.sub(previousTotal, previousCredit) + oldAmount;

  if (newAmount > maxAmount) {
    return res.status(202).json({
      success: false,
      result: null,
      message: `Qo'shishingiz mumkin bo'lgan maksimal summa ${maxAmount}`,
    });
  }

  // Update the payment
  const updatedPayment = await Model.findOneAndUpdate(
    { _id: paymentId },
    { amount: newAmount, updatedBy: req.user._id, number: number, description: description },
    { new: true }
  ).exec();

  const amountDifference = calculate.sub(newAmount, oldAmount);
  const updatedCredit = calculate.add(previousCredit, amountDifference);

  // Update invoice with new payment and status
  let paymentStatus =
    calculate.sub(previousTotal, 0) === updatedCredit
      ? 'paid'
      : updatedCredit > 0
        ? 'partially'
        : 'unpaid';

  await Invoice.findOneAndUpdate(
    { _id: invoiceId },
    {
      $set: { credit: updatedCredit, paymentStatus: paymentStatus },
    },
    { new: true }
  ).exec();

  // Fetch supplier
  const supplier = await Supplier.findOne({ _id: supplierId });

  // Reverse the old amount from supplier's balances
  if (previousPayment.paymentMode === 'cash') {
    supplier.cash = calculate.sub(supplier.cash, oldAmount);
  } else if (previousPayment.paymentMode === 'transfer') {
    supplier.transfers = calculate.sub(supplier.transfers, oldAmount);
  } else if (previousPayment.paymentMode === 'click') {
    supplier.click = calculate.sub(supplier.click, oldAmount);
  }

  // Add the new amount to the supplier's balances based on payment mode
  if (paymentMode === 'cash') {
    supplier.cash = calculate.add(supplier.cash, newAmount);
  } else if (paymentMode === 'transfer') {
    supplier.transfers = calculate.add(supplier.transfers, newAmount);
  } else if (paymentMode === 'click') {
    supplier.click = calculate.add(supplier.click, newAmount);
  }

  // Update the supplier's debt by subtracting the new amount and adding the old amount
  supplier.debt = calculate.sub(calculate.add(supplier.debt, oldAmount), newAmount);

  // Save updated supplier information
  await supplier.save();

  return res.status(200).json({
    success: true,
    result: updatedPayment,
    message: "To'lov muvaffaqiyatli yangilandi",
  });
};

module.exports = update;
