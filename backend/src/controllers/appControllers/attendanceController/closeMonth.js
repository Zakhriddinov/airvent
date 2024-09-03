const closeMonth = async (Model, req, res) => {
  try {
    const { year, month } = req.body;

    if (!year || !month) {
      return res.status(400).json({
        message: 'Yil va oy kiritilishi shart.',
      });
    }

    const startDate = new Date(Date.UTC(year, month - 1, 1));
    const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
    const currentDate = new Date();

    // Check if the month is in the future
    if (startDate > currentDate) {
      return res.status(500).json({
        message: 'Bu oyni yopa olmaysiz.',
      });
    }

    // Check if the month is currently ongoing
    if (endDate > currentDate) {
      return res.status(500).json({
        message: 'Oyning tugashini kuting, keyin yoping.',
      });
    }

    const existingClosedMonth = await Model.findOne({
      closed: true,
      date: { $gte: startDate, $lte: endDate },
    });

    if (existingClosedMonth) {
      return res.status(500).json({
        message: 'Bu oy allaqachon yopilgan.',
      });
    }

    await Model.updateMany(
      {
        date: { $gte: startDate, $lte: endDate },
      },
      {
        $set: { closed: true },
      }
    );

    res.status(200).json({
      success: true,
      message: 'Oy muvaffaqiyatli yopildi.',
    });
  } catch (error) {
    console.error('Oy yopilishida xatolik:', error);
    res.status(500).json({
      success: false,
      message: 'Oy yopilishida xatolik yuz berdi.',
    });
  }
};

module.exports = closeMonth;
