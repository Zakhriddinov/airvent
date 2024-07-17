const mongoose = require('mongoose');

const Product = mongoose.model('Products');

const remove = async (Model, req, res) => {
  const { id } = req.params;

  const product = await Product.findOne({
    productCategory: id,
    removed: false,
  }).exec();

  if (product) {
    return res.status(400).json({
      success: false,
      result: null,
      message: "Agara kategoriya mahsulotga bog'langan bo'lsa o'chirib bo'lmaydi!",
    });
  }

  const result = await Model.findOneAndUpdate(
    { _id: id, removed: false },
    {
      $set: {
        removed: true,
      },
    }
  ).exec();
  if (!result) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'Kategoriya mavjud emas: ' + id,
    });
  }
  return res.status(200).json({
    success: true,
    result,
    message: 'Kategoriya muvaffaqiyati o`chirildi: ' + id,
  });
};

module.exports = remove;
