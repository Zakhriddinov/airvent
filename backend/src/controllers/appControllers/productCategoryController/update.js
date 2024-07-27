const mongoose = require('mongoose');

const Product = mongoose.model('Products');
const update = async (Model, req, res) => {
  const { id } = req.params;
  const { code, name } = req.body;

  // Xuddi shu kod va nomga ega va yoqilgan hujjatni tekshiring
  const existingDocument = await Model.findOne({ code, name, removed: true });

  if (existingDocument) {
    return res.status(400).json({
      success: false,
      message: 'Xuddi shu kod va nomga ega kategoriya mavjud',
    });
  }

  const product = await Product.findOne({
    productCategory: id,
    removed: false,
  }).exec();

  if (product && !req.body.enabled) {
    return res.status(400).json({
      success: false,
      result: null,
      message: "Agara kategoriya mahsulotga bog'langan bo'lsa passive qilib bo'lmaydi!",
    });
  }

  req.body.removed = false;
  const result = await Model.findOneAndUpdate({ _id: id, removed: false }, req.body, {
    new: true,
    runValidators: true,
  }).exec();

  if (!result) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'Kategoriya mavjud emas! ',
    });
  }

  return res.status(200).json({
    success: true,
    result,
    message: "Kategoriya o'gartirildi",
  });
};

module.exports = update;
