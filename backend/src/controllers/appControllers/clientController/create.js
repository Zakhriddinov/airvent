const create = async (Model, req, res) => {
  const result = await new Model({
    ...req.body,
  }).save();

  // Returning successfull response
  return res.status(200).json({
    success: true,
    result,
    message: 'Mijoz muvaffaqiyatli yaratildi!',
  });
};

module.exports = create;
