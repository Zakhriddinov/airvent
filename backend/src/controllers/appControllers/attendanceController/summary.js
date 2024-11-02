const Employee = require('../../../models/appModels/Employee');

const summary = async (Model, req, res) => {
  try {
    // Get current year and month if not provided
    const currentDate = new Date();
    const year = req.params.year ? parseInt(req.params.year) : currentDate.getUTCFullYear();
    const month = req.params.month ? parseInt(req.params.month) : currentDate.getUTCMonth() + 1; // getUTCMonth() returns 0-11, so +1

    // Validate year and month
    if (!year || !month) {
      return res.status(400).json({ message: 'Year and month are required.' });
    }

    const startDate = new Date(Date.UTC(year, month - 1, 1));
    const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

    // Fetch all active employees
    const employees = await Employee.find({ removed: false }).lean();
    const employeeIds = employees.map((employee) => employee._id);

    // Fetch all attendance records for the specified month
    const attendanceRecords = await Model.find({
      employee: { $in: employeeIds },
      date: { $gte: startDate, $lte: endDate },
    }).lean();

    // Initialize totals
    let totalSalary = 0;
    let totalEarnedAmount = 0;

    // Calculate the total dailyWage and earnedAmount
    attendanceRecords.forEach((record) => {
      const employee = employees.find((emp) => emp._id.equals(record.employee));
      if (employee) {
        if (record.status === 'present') {
          totalSalary += employee.dailyWage;
        } else if (record.status === 'half-day') {
          totalSalary += employee.dailyWage / 2;
        }
        totalEarnedAmount += record.earnedAmount;
      }
    });

    // Return the summary
    return res.status(200).json({
      success: true,
      totalSalary,
      totalEarnedAmount,
      message: `Successfully fetched the summary for ${month}/${year}`,
    });
  } catch (error) {
    console.error('Error fetching attendance summary:', error);
    return res
      .status(500)
      .json({ message: 'An error occurred while fetching attendance summary.' });
  }
};

module.exports = summary;
