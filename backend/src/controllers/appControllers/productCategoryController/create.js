const create = async (Model, req, res) => {
  const { code, name } = req.body;

  try {
    // Xuddi shu kod va nomga ega va yoqilgan hujjatni tekshiring
    const existingDocument = await Model.findOne({ code, name, removed: true });

    if (existingDocument) {
      return res.status(400).json({
        success: false,
        message: 'Xuddi shu kod va nomga ega kategoriya mavjud',
      });
    }

    // Agar mavjud bo'lmasa, yangi hujjatni yarating va saqlang
    const result = await new Model({
      ...req.body,
    }).save();

    // Muvaffaqiyatli javob qaytarish
    return res.status(200).json({
      success: true,
      result,
      message: 'Modelda hujjat muvaffaqiyatli yaratildi',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Hujjatni yaratishda xatolik yuz berdi.',
      error: error.message,
    });
  }
};

module.exports = create;
