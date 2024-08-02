const update = async (Model, req, res) => {
  req.body.removed = false;
  
  const result = await Model.findOneAndUpdate({ _id: req.params.id, removed: false }, req.body, {
    new: true,
    runValidators: true,
  }).exec();

  if (!result) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'Bunday Xodim mavjud emas!',
    });
  }

  return res.status(200).json({
    success: true,
    result,
    message: "Xodim o'gartirildi",
  });
};

module.exports = update;
