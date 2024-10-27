
const Invoice = require('../../../models/appModels/ClientInvoice');
const Client = require('../../../models/appModels/Client');
const { calculate } = require('../../../helpers');

const create = async (Model, req, res) => {
  if (req.body.amount === 0) {
    return res.status(202).json({
      success: false,
      result: null,
      message: `The Minimum Amount couldn't be 0`,
    });
  }

  const currentInvoice = await Invoice.findOne({
    _id: req.body.invoice,
    removed: false,
  });

  const { total: previousTotal, credit: previousCredit } = currentInvoice;
  const maxAmount = calculate.sub(previousTotal, previousCredit);

  if (req.body.amount > maxAmount) {
    return res.status(202).json({
      success: false,
      result: null,
      message: `Qo'shishingiz mumkin bo'lgan maksimal miqdor ${maxAmount}`,
    });
  }

  req.body['createdBy'] = req.user._id;
  const result = await Model.create(req.body);

  const fileId = 'payment-' + result._id + '.pdf';
  const updatePath = await Model.findOneAndUpdate(
    {
      _id: result._id.toString(),
      removed: false,
    },
    { pdf: fileId },
    {
      new: true,
    }
  ).exec();

  const { _id: paymentId, amount } = result;
  const { id: invoiceId, total, credit } = currentInvoice;

  let paymentStatus =
    calculate.sub(total, 0) === calculate.add(credit, amount)
      ? 'paid'
      : calculate.add(credit, amount) > 0
        ? 'partially'
        : 'unpaid';

  const invoiceUpdate = await Invoice.findOneAndUpdate(
    { _id: req.body.invoice },
    {
      $push: { payment: paymentId.toString() },
      $inc: { credit: amount },
      $set: { paymentStatus: paymentStatus },
    },
    {
      new: true, // return the new result instead of the old one
      runValidators: true,
    }
  ).exec();

  const client = await Client.findOne({ _id: req.body.client });
  if (req.body.paymentMode === 'cash') {
    client.cash += amount;
  } else if (req.body.paymentMode === 'transfer') {
    client.transfers += amount;
  } else if (req.body.paymentMode === 'click') {
    client.click += amount;
  }

  // Subtract the amount from debtEnd
  client.debt = calculate.sub(client.debt, amount);

  // Save the supplier's updated information
  await client.save();

  return res.status(200).json({
    success: true,
    result: updatePath,
    message: `To'lov hisob-fakturasi muvaffaqiyatli yaratildi'`,
  });
};

module.exports = create;
