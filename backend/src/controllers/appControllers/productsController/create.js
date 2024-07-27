const create = async (Model, req, res) => {
  const { code, name } = req.body;
  const existingDocument = await Model.findOne({ code, name, removed: true });

  if (existingDocument) {
    return res.status(400).json({
      success: false,
      message: 'Xuddi shu kod va nomga ega mahsulot mavjud',
    });
  }

  const result = await new Model({
    ...req.body,
  }).save();

  // Returning successfull response
  return res.status(200).json({
    success: true,
    result,
    message: 'Successfully Created the document in Model ',
  });
};

module.exports = create;
