const update = async (Model, req, res) => {
  const { code, name } = req.body;
  const existingDocument = await Model.findOne({ code, name, removed: true });

  if (existingDocument) {
    return res.status(400).json({
      success: false,
      message: 'Xuddi shu kod va nomga ega mahsulot mavjud',
    });
  }

  req.body.removed = false;
  const result = await Model.findOneAndUpdate({ _id: req.params.id, removed: false }, req.body, {
    new: true,
    runValidators: true,
  }).exec();

  if (!result) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'Bunday Mahsulot mavjud emas! ',
    });
  }

  return res.status(200).json({
    success: true,
    result,
    message: "Mahsulot o'gartirildi",
  });
};

module.exports = update;