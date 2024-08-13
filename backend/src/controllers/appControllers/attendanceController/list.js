// const Employee = require('../../../models/appModels/Employee');

// const list = async (Model, req, res) => {
//   try {
//     const { year, month } = req.params;

//     if (!year || !month) {
//       return res.status(400).json({ message: 'Year and month are required.' });
//     }

//     const startDate = new Date(Date.UTC(year, month - 1, 1));
//     const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
//     const currentDate = new Date();

//     const employees = await Employee.find({ removed: false });
//     const results = await Promise.all(
//       employees.map(async (employee) => {
//         const attendanceRecords = await Model.find({
//           employee: employee._id,
//           date: {
//             $gte: startDate,
//             $lte: endDate,
//           },
//         });

//         if (attendanceRecords.length === 0 && !employee.enabled) {
//           return null;
//         }

//         const attendanceMap = new Map();
//         attendanceRecords.forEach((record) => {
//           const isoDate = record.date.toISOString().slice(0, 10);
//           attendanceMap.set(isoDate, record);
//         });

//         const daysInMonth = endDate.getUTCDate();
//         const employeeResults = [];
//         let totalEarnedAmount = 0;
//         let salary = 0;

//         for (let day = 1; day <= daysInMonth; day++) {
//           const date = new Date(Date.UTC(year, month - 1, day));
//           const isoDate = date.toISOString().slice(0, 10);
//           const formattedDate = `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}`;

//           if (attendanceMap.has(isoDate)) {
//             const record = attendanceMap.get(isoDate);
//             employeeResults.push({
//               date: formattedDate,
//               status: record.status,
//               earnedAmount: record.earnedAmount,
//             });

//             if (record.status === 'present') {
//               salary += employee.dailyWage;
//             } else if (record.status === 'half-day') {
//               salary += employee.dailyWage / 2;
//             }
//             totalEarnedAmount += record.earnedAmount;
//             salary -= record.earnedAmount;
//           } else {
//             let status = 'not-started';
//             if (date < currentDate) {
//               status = 'absent';
//             }
//             employeeResults.push({
//               date: formattedDate,
//               status: status,
//               earnedAmount: 0,
//               enabled: false,
//             });
//           }
//         }

//         return {
//           employee: {
//             _id: employee._id,
//             firstname: employee.firstname,
//             lastname: employee.lastname,
//             dailyWage: employee.dailyWage,
//             enabled: employee.enabled,
//           },
//           results: employeeResults,
//           totalEarnedAmount,
//           salary,
//         };
//       })
//     );

//     const filteredResults = results.filter((result) => result !== null);

//     res.json(filteredResults);
//   } catch (error) {
//     console.error('Error fetching attendance:', error);
//     res.status(500).json({ message: 'An error occurred while fetching attendance data.' });
//   }
// };

// module.exports = list;

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

    const results = employees.map((employee) => {
      const employeeResults = [];
      let totalEarnedAmount = 0;
      let salary = 0;

      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(Date.UTC(year, month - 1, day));
        const isoDate = date.toISOString().slice(0, 10);
        const formattedDate = `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}`;
        const key = `${employee._id}-${isoDate}`;

        if (attendanceMap[key]) {
          const record = attendanceMap[key];
          employeeResults.push({
            date: formattedDate,
            status: record.status,
            earnedAmount: record.earnedAmount,
          });

          if (record.status === 'present') {
            salary += employee.dailyWage;
          } else if (record.status === 'half-day') {
            salary += employee.dailyWage / 2;
          }
          totalEarnedAmount += record.earnedAmount;
          salary -= record.earnedAmount;
        } else {
          const status = date < currentDate ? 'absent' : 'not-started';
          employeeResults.push({
            date: formattedDate,
            status,
            earnedAmount: 0,
          });
        }
      }

      return {
        employee: {
          _id: employee._id,
          firstname: employee.firstname,
          lastname: employee.lastname,
          dailyWage: employee.dailyWage,
          enabled: employee.enabled,
        },
        results: employeeResults,
        totalEarnedAmount,
        salary,
      };
    });

    res.json(results);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ message: 'An error occurred while fetching attendance data.' });
  }
};

module.exports = list;
