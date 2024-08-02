
const Employee = require('../../../models/appModels/Employee');

const remove = async (Model, req, res) => {
  const { id } = req.params;

  const employee = await Employee.findOne({
    position: id,
    removed: false,
  }).exec();

  if (employee) {
    return res.status(400).json({
      success: false,
      result: null,
      message: "Agar lavozim xodimga bog'langan bo'lsa o'chirib bo'lmaydi!",
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
      message: 'Bunday lavozim mavjud emas: ' + id,
    });
  }
  return res.status(200).json({
    success: true,
    result,
    message: 'Lavozim muvaffaqiyati o`chirildi: ' + id,
  });
};

module.exports = remove;
