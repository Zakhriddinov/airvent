const mongoose = require('mongoose');
const Employee = require('../../../models/appModels/Employee');

const update = async (Model, req, res) => {
  try {
    const { employeeId, date, status, earnedAmount } = req.body;

    if (!employeeId || !date || !status || earnedAmount === undefined) {
      return res.status(400).json({
        message: 'Xodim IDsi, sana, holat, va olingan miqdor talab qilinadi.',
      });
    }

    const passiveEmployee = await Employee.findOne({
      _id: employeeId,
      enabled: false,
    }).exec();

    if (passiveEmployee) {
      return res.status(400).json({
        success: false,
        result: null,
        message: "Xodim status passive bo'lsa o'zgartirib bo'lmaydi!",
      });
    }

    const employee = await Employee.findOne({
      _id: employeeId,
    }).exec();

    if (!employee) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Xodim mavjud emas!',
      });
    }

    const parsedDate = new Date(date);
    const startOfDay = new Date(parsedDate.setUTCHours(0, 0, 0, 0));
    const endOfDay = new Date(parsedDate.setUTCHours(23, 59, 59, 999));

    let attendanceRecord = await Model.findOne({
      employee: new mongoose.Types.ObjectId(employeeId),
      date: { $gte: startOfDay, $lt: endOfDay },
    });

    if (attendanceRecord) {
      attendanceRecord.status = status;
      attendanceRecord.earnedAmount = earnedAmount;
      attendanceRecord.dailyWage = employee.dailyWage;
      attendanceRecord.updated = new Date();
      await attendanceRecord.save();
    } else {
      attendanceRecord = new Model({
        employee: new mongoose.Types.ObjectId(employeeId),
        date: parsedDate,
        status,
        earnedAmount,
        dailyWage: employee.dailyWage,
        created: new Date(),
        updated: new Date(),
      });
      await attendanceRecord.save();
    }

    res.status(200).json({
      success: true,
      message: "Muvaffaqiyatli o'zgartirildi",
      record: attendanceRecord,
    });
  } catch (error) {
    console.error('Error processing attendance record:', error);
    res.status(500).json({
      success: false,
      result: [],
      message: 'An error occurred while processing the attendance record.',
    });
  }
};

module.exports = update;
