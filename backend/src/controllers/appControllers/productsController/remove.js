const remove = async (Model, req, res) => {
  const { id } = req.params;
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
      message: 'Mahsulot mavjud emas: ' + id,
    });
  }
  return res.status(200).json({
    success: true,
    result,
    message: 'Mahsulot muvaffaqiyati o`chirildi: ' + id,
  });
};

module.exports = remove;
