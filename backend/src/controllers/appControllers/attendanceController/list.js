const Employee = require('../../../models/appModels/Employee');

const list = async (Model, req, res) => {
  try {
    const { year, month } = req.params;

    if (!year || !month) {
      return res.status(400).json({ message: 'Year and month are required.' });
    }

    const startDate = new Date(Date.UTC(year, month - 1, 1));
    const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
    const currentDate = new Date();

    const employees = await Employee.find({ removed: false }).lean();
    const employeeIds = employees.map((employee) => employee._id);

    const attendanceRecords = await Model.find({
      employee: { $in: employeeIds },
      date: { $gte: startDate, $lte: endDate },
    }).lean();

    const attendanceMap = {};
    attendanceRecords.forEach((record) => {
      const key = `${record.employee}-${record.date.toISOString().slice(0, 10)}`;
      attendanceMap[key] = record;
    });

    const daysInMonth = endDate.getUTCDate();

    let totalSalary = 0;
    let totalEarnedAmount = 0;

    const results = employees.map((employee) => {
      const employeeResults = [];
      let employeeSalary = 0;
      let employeeTotalEarnedAmount = 0;

      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(Date.UTC(year, month - 1, day));
        const isoDate = date.toISOString().slice(0, 10);
        const formattedDate = `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}`;
        const key = `${employee._id}-${isoDate}`;

        const isSunday = date.getUTCDay() === 0;

        if (attendanceMap[key]) {
          const record = attendanceMap[key];
          employeeResults.push({
            date: formattedDate,
            status: record.status,
            earnedAmount: record.earnedAmount,
            closed: record?.closed,
          });

          if (record.status === 'present') {
            employeeSalary += employee.dailyWage;
          } else if (record.status === 'half-day') {
            employeeSalary += employee.dailyWage / 2;
          }
          employeeTotalEarnedAmount += record.earnedAmount;
          employeeSalary -= record.earnedAmount;
        } else {
          let status = date < currentDate ? 'absent' : 'not-started';
          if (isSunday) {
            status = 'rest';
          }
          employeeResults.push({
            date: formattedDate,
            status,
            earnedAmount: 0,
            closed: false,
          });
        }
      }
      if (employeeSalary >= 0) {
        totalSalary += employeeSalary;
      }

      totalEarnedAmount += employeeTotalEarnedAmount;

      return {
        employee: {
          _id: employee._id,
          firstname: employee.firstname,
          lastname: employee.lastname,
          dailyWage: employee.dailyWage,
          enabled: employee.enabled,
        },
        results: employeeResults,
        totalEarnedAmount: employeeTotalEarnedAmount,
        salary: employeeSalary,
      };
    });

    res.json({
      results,
      totalSalary,
      totalEarnedAmount,
    });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ message: 'An error occurred while fetching attendance data.' });
  }
};

module.exports = list;