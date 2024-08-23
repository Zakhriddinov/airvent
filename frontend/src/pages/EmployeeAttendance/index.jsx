import React, { useState, useEffect } from 'react';
import {
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DownloadOutlined,
  ExclamationCircleOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons';
import { PageHeader } from '@ant-design/pro-layout';
import { DatePicker, Radio, Table, Modal, Select, Button, message, InputNumber } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import ErpLayout from '@/layout/ErpLayout';
import { API_BASE_URL } from '@/config/serverApiConfig';
import { moneyFormatter } from '@/utilities/dataStructure';
import errorHandler from '@/request/errorHandler';
import * as XLSX from 'xlsx';

const { Option } = Select;

export const EmployeeAttendance = () => {
  const [attendance, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [currentDateIndex, setCurrentDateIndex] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [amount, setAmount] = useState(0);
  const [statusLoading, setStatusLoading] = useState(false);
  const [downloadPdfLoading, setDownloadPdfLoading] = useState(false);
  const [totalSummary, setTotalSummary] = useState({
    totalSalary: 0,
    totalEarnedAmount: 0,
  });

  const fetchAttendanceData = async () => {
    setLoading(true);
    try {
      const date = dayjs(selectedMonth);
      const response = await axios.get(
        `${API_BASE_URL}attendance/${date.year()}/${date.month() + 1}`
      );
      const { results, totalSalary, totalEarnedAmount } = response?.data;
      setAttendanceData(results);
      setTotalSummary({
        totalSalary: totalSalary,
        totalEarnedAmount: totalEarnedAmount,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error('Error fetching attendance data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceData();
  }, [selectedMonth]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'half-day':
        return <MinusCircleOutlined style={{ color: 'grey' }} />;
      case 'absent':
        return <CloseCircleOutlined style={{ color: 'red' }} />;
      case 'present':
        return <CheckCircleOutlined style={{ color: 'green' }} />;
      case 'not-started':
        return <ExclamationCircleOutlined style={{ color: 'orange' }} />;
      case 'rest':
        return <CalendarOutlined style={{ color: '#1640d6' }} />;
      default:
        return <ExclamationCircleOutlined style={{ color: 'orange' }} />;
    }
  };

  const handleStatusChange = async () => {
    if (currentEmployee && currentDateIndex !== null) {
      try {
        setStatusLoading(true);
        const employeeRecord = attendance.find((emp) => emp.employee._id === currentEmployee);
        const currentResult = employeeRecord.results[currentDateIndex];
        const formattedDate = dayjs(currentResult.date, 'DD/MM').format('YYYY-MM-DD');

        await axios
          .put(`${API_BASE_URL}/attendance/update`, {
            employeeId: currentEmployee,
            date: formattedDate,
            status: newStatus,
            earnedAmount: amount,
          })
          .then((res) => {
            message.success('Muvaffaqiyatli saqlandi!');
            setModalVisible(false);
            fetchAttendanceData();
            setStatusLoading(false);
          })
          .catch((e) => {
            setStatusLoading(false);
            return errorHandler(e);
          });
      } catch (error) {
        console.error('Error updating status:', error);
        message.error('Error updating status.');
        setStatusLoading(false);
      }
    }
  };

  const showModal = (employeeId, dateIndex, currentStatus, result) => {
    setCurrentEmployee(employeeId);
    setCurrentDateIndex(dateIndex);
    setNewStatus(currentStatus);
    setAmount(result.earnedAmount);
    setModalVisible(true);
  };

  const dataSource = attendance.map((employeeRecord, index) => ({
    key: employeeRecord.employee._id,
    index: index + 1,
    employee: `${employeeRecord.employee.firstname} ${employeeRecord.employee.lastname}`,
    enabled: employeeRecord.employee.enabled,
    ...employeeRecord.results.reduce((acc, result, index) => {
      acc[`date-${index}`] = (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Radio.Group
            value={result.status}
            style={{ marginBottom: '20px' }}
            disabled={!employeeRecord.employee.enabled}
          >
            <Radio.Button
              value={result.status}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '30px',
                height: '30px',
                border: 'none',
                background: '#f5f5f5',
              }}
              onClick={() => showModal(employeeRecord.employee._id, index, result.status, result)}
            >
              {getStatusIcon(result.status)}
            </Radio.Button>
          </Radio.Group>
          {moneyFormatter({ amount: result.earnedAmount })}
        </div>
      );
      return acc;
    }, {}),
    totalEarnedAmount: moneyFormatter({ amount: employeeRecord.totalEarnedAmount }),
    salary: moneyFormatter({ amount: employeeRecord.salary }),
  }));

  const allDates = attendance.length
    ? Array.from(new Set(attendance.flatMap((emp) => emp.results.map((result) => result.date))))
    : [];

  const columns = [
    {
      title: '№',
      dataIndex: 'index',
      key: 'index',
      width: 20,
    },
    {
      title: 'Ism Familiya',
      dataIndex: 'employee',
      key: 'employee',
      fixed: 'left',
      width: 200,
    },
    ...allDates.map((date, index) => ({
      title: date,
      dataIndex: `date-${index}`,
      key: `date-${index}`,
      width: 100,
    })),
    {
      title: 'Umumiy olingan avans',
      dataIndex: 'totalEarnedAmount',
      key: 'totalEarnedAmount',
      width: 150,
      fixed: 'right',
    },
    {
      title: 'Oylik maoshi',
      dataIndex: 'salary',
      key: 'salary',
      fixed: 'right',
      width: 150,
    },
  ];

  const downloadExcel = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet([]);
    const date = dayjs(selectedMonth).format('DD.MM.YYYY');

    const dates = [
      ...new Set(attendance.flatMap((employee) => employee.results.map((result) => result.date))),
    ].sort();

    // Add title "Ishlar oylik davomati" at the top and center it
    const title = [
      [
        {
          v: 'Ishchilar oylik davomati',
          t: 's',
          s: {
            font: { bold: true, sz: 16 },
            alignment: { horizontal: 'center', vertical: 'center' }, // Center alignment
            border: {
              // Black border for title
              top: { style: 'thin', color: { rgb: '000000' } },
              bottom: { style: 'thin', color: { rgb: '000000' } },
              left: { style: 'thin', color: { rgb: '000000' } },
              right: { style: 'thin', color: { rgb: '000000' } },
            },
          },
        },
      ],
    ];
    XLSX.utils.sheet_add_aoa(worksheet, title, { origin: 'A1' });
    worksheet['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: dates.length + 5 } }];

    // Add date below the title and center it
    const dateRow = [
      [
        {
          v: `Sana: ${date}`,
          t: 's',
          s: {
            font: { bold: true, sz: 12 },
            alignment: { horizontal: 'center', vertical: 'center' }, // Center alignment
            border: {
              // Black border for date
              top: { style: 'thin', color: { rgb: '000000' } },
              bottom: { style: 'thin', color: { rgb: '000000' } },
              left: { style: 'thin', color: { rgb: '000000' } },
              right: { style: 'thin', color: { rgb: '000000' } },
            },
          },
        },
      ],
    ];
    XLSX.utils.sheet_add_aoa(worksheet, dateRow, { origin: 'A2' });
    worksheet['!merges'].push({ s: { r: 1, c: 0 }, e: { r: 1, c: dates.length + 5 } });

    // Add total salary and total earned amount below the title and center them
    const totalsRow = [
      [
        {
          v: `Umumiy berilgan avans: ${totalSummary.totalEarnedAmount}`,
          t: 's',
          s: {
            font: { bold: true, sz: 12 },
            alignment: { horizontal: 'center', vertical: 'center' },
            border: {
              // Black border for totals
              top: { style: 'thin', color: { rgb: '000000' } },
              bottom: { style: 'thin', color: { rgb: '000000' } },
              left: { style: 'thin', color: { rgb: '000000' } },
              right: { style: 'thin', color: { rgb: '000000' } },
            },
          },
        },
      ],
      [
        {
          v: `Umumiy beriladigan summa: ${totalSummary.totalSalary}`,
          t: 's',
          s: {
            font: { bold: true, sz: 12 },
            alignment: { horizontal: 'center', vertical: 'center' },
            border: {
              // Black border for totals
              top: { style: 'thin', color: { rgb: '000000' } },
              bottom: { style: 'thin', color: { rgb: '000000' } },
              left: { style: 'thin', color: { rgb: '000000' } },
              right: { style: 'thin', color: { rgb: '000000' } },
            },
          },
        },
      ],
    ];
    XLSX.utils.sheet_add_aoa(worksheet, totalsRow, { origin: 'A3' });
    worksheet['!merges'].push(
      { s: { r: 2, c: 0 }, e: { r: 2, c: dates.length + 5 } }, // Merge cells for Total Earned Amount
      { s: { r: 3, c: 0 }, e: { r: 3, c: dates.length + 5 } } // Merge cells for Total Salary
    );

    // Add header after totals
    const header = [
      '№',
      'F.I.SH',
      ...dates,
      '✔',
      '⏱',
      '✘',
      '☀',
      'Olingan avans',
      'Oylik maoshi',
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A5' });

    let rowOffset = 6; // Adjust row offset due to the title and totals

    attendance.forEach((employee, index) => {
      const rowStatus = [];
      const rowAmount = [];

      rowStatus.push(index + 1);
      rowStatus.push(`${employee.employee.firstname} ${employee.employee.lastname}`);

      rowAmount.push('');
      rowAmount.push('');

      let presentCount = 0,
        tardyCount = 0,
        unexcusedCount = 0,
        excusedCount = 0;

      dates.forEach((date, colIndex) => {
        const result = employee.results.find((r) => r.date === date);

        if (result) {
          let status = '';
          switch (result.status) {
            case 'present':
              status = '✔';
              presentCount++;
              break;
            case 'absent':
              status = '✘';
              unexcusedCount++;
              break;
            case 'rest':
              status = '☀';
              excusedCount++;
              break;
            case 'half-day':
              status = '⏱';
              tardyCount++;
              break;
            default:
              status = 'N/A';
          }

          rowStatus.push({
            v: status,
            t: 's',
            s: {
              font: { sz: 10 },
              alignment: { horizontal: 'center', vertical: 'center' },
              border: {
                // Black border for cell
                top: { style: 'thin', color: { rgb: '000000' } },
                bottom: { style: 'thin', color: { rgb: '000000' } },
                left: { style: 'thin', color: { rgb: '000000' } },
                right: { style: 'thin', color: { rgb: '000000' } },
              },
            },
          });

          rowAmount.push({
            v: result.earnedAmount || 0,
            t: 'n',
            s: {
              font: { sz: 10 },
              numFmt: '#,##0.00',
              border: {
                // Black border for cell
                top: { style: 'thin', color: { rgb: '000000' } },
                bottom: { style: 'thin', color: { rgb: '000000' } },
                left: { style: 'thin', color: { rgb: '000000' } },
                right: { style: 'thin', color: { rgb: '000000' } },
              },
            },
          });
        } else {
          rowStatus.push({
            v: 'N/A',
            t: 's',
            s: {
              font: { sz: 10 },
              alignment: { horizontal: 'center', vertical: 'center' },
              border: {
                // Black border for cell
                top: { style: 'thin', color: { rgb: '000000' } },
                bottom: { style: 'thin', color: { rgb: '000000' } },
                left: { style: 'thin', color: { rgb: '000000' } },
                right: { style: 'thin', color: { rgb: '000000' } },
              },
            },
          });
          rowAmount.push({
            v: 0,
            t: 'n',
            s: {
              font: { sz: 10 },
              numFmt: '#,##0.00',
              border: {
                // Black border for cell
                top: { style: 'thin', color: { rgb: '000000' } },
                bottom: { style: 'thin', color: { rgb: '000000' } },
                left: { style: 'thin', color: { rgb: '000000' } },
                right: { style: 'thin', color: { rgb: '000000' } },
              },
            },
          });
        }
      });

      rowStatus.push(presentCount);
      rowStatus.push(tardyCount);
      rowStatus.push(unexcusedCount);
      rowStatus.push(excusedCount);

      rowAmount.push('');
      rowAmount.push('');
      rowAmount.push('');
      rowAmount.push('');

      rowStatus.push({
        v: employee.totalEarnedAmount,
        t: 'n',
        s: {
          numFmt: '#,##0.00',
          border: {
            // Black border for total earned amount
            top: { style: 'thin', color: { rgb: '000000' } },
            bottom: { style: 'thin', color: { rgb: '000000' } },
            left: { style: 'thin', color: { rgb: '000000' } },
            right: { style: 'thin', color: { rgb: '000000' } },
          },
        },
      });
      rowStatus.push({
        v: employee.salary,
        t: 'n',
        s: {
          numFmt: '#,##0.00',
          border: {
            // Black border for salary
            top: { style: 'thin', color: { rgb: '000000' } },
            bottom: { style: 'thin', color: { rgb: '000000' } },
            left: { style: 'thin', color: { rgb: '000000' } },
            right: { style: 'thin', color: { rgb: '000000' } },
          },
        },
      });

      rowAmount.push('');
      rowAmount.push('');

      XLSX.utils.sheet_add_aoa(worksheet, [rowStatus], { origin: `A${rowOffset}` });
      XLSX.utils.sheet_add_aoa(worksheet, [rowAmount], { origin: `A${rowOffset + 1}` });

      rowOffset += 2;
    });

    const colWidths = [{ wch: 5 }, { wch: 20 }];
    dates.forEach(() => colWidths.push({ wch: 8 }));
    colWidths.push({ wch: 5 }, { wch: 5 }, { wch: 5 }, { wch: 5 });
    colWidths.push({ wch: 12 }, { wch: 12 });
    worksheet['!cols'] = colWidths;

    const rowHeights = [];
    for (let i = 0; i < rowOffset; i++) {
      rowHeights.push({ hpt: 20 });
    }
    worksheet['!rows'] = rowHeights;

    // Add black border to header cells
    const headerRange = XLSX.utils.decode_range(`A4:${XLSX.utils.encode_col(dates.length + 5)}4`);
    for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
      const headerCellRef = XLSX.utils.encode_cell({ r: 4, c: C });
      if (!worksheet[headerCellRef]) continue;
      worksheet[headerCellRef].s = {
        font: { bold: true },
        fill: { fgColor: { rgb: 'D3D3D3' } },
        border: {
          // Black border for header cells
          top: { style: 'thin', color: { rgb: '000000' } },
          bottom: { style: 'thin', color: { rgb: '000000' } },
          left: { style: 'thin', color: { rgb: '000000' } },
          right: { style: 'thin', color: { rgb: '000000' } },
        },
      };
    }

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Davomat');
    XLSX.writeFile(workbook, `Davomat_${date}.xlsx`);
  };

  return (
    <ErpLayout>
      <PageHeader
        onBack={() => window.history.back()}
        title="Xodimlar oylik hisoboti"
        ghost={false}
        style={{
          padding: '20px 0px',
        }}
        extra={[
          <Button
            icon={<DownloadOutlined />}
            type="primary"
            loading={downloadPdfLoading}
            onClick={downloadExcel}
          >
            Yuklash
          </Button>,
          <DatePicker
            key="date-picker"
            defaultValue={dayjs(selectedMonth)}
            onChange={(date) => setSelectedMonth(date.toDate())}
            picker="month"
          />,
        ]}
      />
      
      <Table
        loading={loading}
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        scroll={{ x: 'max-content', y: 600 }}
        style={{ marginBottom: '20px' }}
        footer={() => (
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px' }}>
            <div>
              Umumiy beriladigan summa: {moneyFormatter({ amount: totalSummary.totalSalary })}
            </div>
            <div>
              Umumiy berilgan avans: {moneyFormatter({ amount: totalSummary.totalEarnedAmount })}
            </div>
          </div>
        )}
      />
      <Modal
        title="Holat va miqdorni o'zgartirish"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setModalVisible(false)}>
            Yopish
          </Button>,
          <Button key="submit" type="primary" onClick={handleStatusChange} loading={statusLoading}>
            Saqlash
          </Button>,
        ]}
      >
        <Select value={newStatus} style={{ width: 240, marginRight: 20 }} onChange={setNewStatus}>
          <Option value="not-started">
            <ExclamationCircleOutlined style={{ color: 'orange', marginRight: 8 }} />
            Hali boshlanmadi
          </Option>
          <Option value="rest">
            <CalendarOutlined style={{ color: '#1640d6', marginRight: 8 }} />
            Dam olish
          </Option>
          <Option value="present">
            <CheckCircleOutlined style={{ color: 'green', marginRight: 8 }} />
            Keldi
          </Option>
          <Option value="absent">
            <CloseCircleOutlined style={{ color: 'red', marginRight: 8 }} />
            Kelmadi
          </Option>
          <Option value="half-day">
            <MinusCircleOutlined style={{ color: 'grey', marginRight: 8 }} />
            Yarim kun ishladi
          </Option>
        </Select>

        <InputNumber
          style={{ width: 180, marginTop: 8 }}
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e)}
        />
      </Modal>

    </ErpLayout>
  );
};
