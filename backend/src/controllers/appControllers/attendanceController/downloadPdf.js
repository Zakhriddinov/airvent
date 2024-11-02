const Employee = require('../../../models/appModels/Employee');
const path = require('path');
const ejs = require('ejs');
const pdf = require('html-pdf');

const downloadFile = async (Model, req, res) => {
  try {
    const { year, month } = req.params;
    if (!year || !month) {
      return res.status(400).json({ message: 'Year and month are required.' });
    }

    const startDate = new Date(Date.UTC(year, month - 1, 1));
    const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

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
    const results = employees.map((employee) => {
      let salary = 0;
      const employeeResults = Array.from({ length: daysInMonth }, (_, index) => {
        const date = new Date(Date.UTC(year, month - 1, index + 1));
        const isoDate = date.toISOString().slice(0, 10);
        const formattedDate = `${String(index + 1).padStart(2, '0')}/${String(month).padStart(2, '0')}`;
        const key = `${employee._id}-${isoDate}`;

        let status = 'not-started',
          earnedAmount = 0;
        if (attendanceMap[key]) {
          const record = attendanceMap[key];
          status = record.status;
          earnedAmount = record.earnedAmount || 0;
          if (status === 'present') {
            salary += employee.dailyWage;
          } else if (status === 'half-day') {
            salary += employee.dailyWage / 2;
          }
          salary -= earnedAmount;
        } else if (date < new Date()) {
          status = 'absent';
        }

        return { date: formattedDate, status, earnedAmount };
      });

      return {
        employee: {
          _id: employee._id,
          firstname: employee.firstname,
          lastname: employee.lastname,
          dailyWage: employee.dailyWage,
          enabled: employee.enabled,
        },
        results: employeeResults,
        totalEarnedAmount: salary,
      };
    });

    ejs.renderFile(
      path.join(__dirname, '../../../pdf', 'Attendance.ejs'),
      { data: results },
      (err, html) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Error rendering PDF');
        }

        pdf.create(html, { format: 'A4', orientation: 'landscape' }).toBuffer((err, buffer) => {
          if (err) {
            console.error(err);
            return res.status(500).send('Error creating PDF');
          }

          res.type('pdf');
          res.end(buffer, 'binary');
        });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'An error occurred while fetching attendance data.' });
  }
};

module.exports = downloadFile;
