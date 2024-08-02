const Attendance = require('../../../models/appModels/Attendance');

const remove = async (Model, req, res) => {
  const { id } = req.params;

  const attandance = await Attendance.findOne({
    employee: id
  }).exec();

  if (attandance) {
    return res.status(400).json({
      success: false,
      result: null,
      message: "Agara xodim davomatga bog'langan bo'lsa o'chirib bo'lmaydi!",
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
      message: 'Bunday xodim mavjud emas: ' + id,
    });
  }

  return res.status(200).json({
    success: true,
    result,
    message: 'Xodim muvaffaqiyati o`chirildi: ' + id,
  });
};

module.exports = remove;
