import React, { useState, useEffect } from 'react';
import {
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CloseOutlined,
  DownloadOutlined,
  ExclamationCircleOutlined,
  IssuesCloseOutlined,
  MinusCircleOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
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
import MoreAttendanceModal from './MoreAttendanceModal';

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
  const [closeLoading, setCloseLoading] = useState(false);
  const [moreAttendanceModal, setMoreAttendanceModal] = useState(false);

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

  function openMoreAttendanceModal() {
    setMoreAttendanceModal(true);
  }

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
            disabled={!employeeRecord.employee.enabled || result?.closed}
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
    totalEarnedAmount: (
      <div style={employeeRecord.totalEarnedAmount < 0 ? { color: 'red' } : {}}>
        {moneyFormatter({ amount: employeeRecord.totalEarnedAmount })}
      </div>
    ),
    salary: (
      <div style={employeeRecord.salary < 0 ? { color: 'red' } : {}}>
        {moneyFormatter({ amount: employeeRecord.salary })}
      </div>
    ),
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
      fixed: 'left',
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
      width: 160,
      fixed: 'right',
    },
    {
      title: 'Oylik maoshi',
      dataIndex: 'salary',
      key: 'salary',
      fixed: 'right',
      width: 160,
    },
  ];

  const downloadExcel = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet([]);

    // Common styles
    const borderStyle = {
      top: { style: 'thin', color: { rgb: '000000' } },
      bottom: { style: 'thin', color: { rgb: '000000' } },
      left: { style: 'thin', color: { rgb: '000000' } },
      right: { style: 'thin', color: { rgb: '000000' } },
    };

    const cellStyle = {
      alignment: { horizontal: 'center', vertical: 'center' },
      border: borderStyle,
      numFmt: '#,##0', // Format for numbers
    };

    // Title style
    const titleStyle = {
      ...cellStyle,
      font: { bold: true, sz: 16 },
    };

    // Add title
    const title = [{ v: 'Ishchilar oylik davomati', t: 's', s: titleStyle }];
    XLSX.utils.sheet_add_aoa(worksheet, [title], { origin: 'A1' });
    worksheet['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 7 } }];

    // Add total earned amount
    const totalEarnedAmountRow = [
      {
        v: `Umumiy berilgan avans: ${totalSummary.totalEarnedAmount}`,
        t: 's',
        s: { ...cellStyle, font: { bold: true, sz: 12 } },
      },
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [totalEarnedAmountRow], { origin: 'A2' });
    worksheet['!merges'].push({ s: { r: 1, c: 0 }, e: { r: 1, c: 7 } });

    // Add total salary row below the total earned amount
    const totalSalaryRow = [
      {
        v: `Umumiy beriladigan summa: ${totalSummary.totalSalary}`,
        t: 's',
        s: { ...cellStyle, font: { bold: true, sz: 12 } },
      },
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [totalSalaryRow], { origin: 'A3' });
    worksheet['!merges'].push({ s: { r: 2, c: 0 }, e: { r: 2, c: 7 } });

    // Headers
    const headers = ['№', 'F.I.SH', '✔', '⏱', '✘', '☀', 'Olingan avans', 'Oylik maoshi'];
    const headerRow = headers.map((h) => ({ v: h, t: 's', s: cellStyle }));
    XLSX.utils.sheet_add_aoa(worksheet, [headerRow], { origin: 'A4' });

    let rowOffset = 5; // Start data from row 5

    // Data rows
    attendance.forEach((employee, index) => {
      let dataRow = [
        { v: index + 1, t: 'n', s: cellStyle },
        { v: `${employee.employee.firstname} ${employee.employee.lastname}`, t: 's', s: cellStyle },
      ];

      let presentCount = 0,
        tardyCount = 0,
        unexcusedCount = 0,
        excusedCount = 0;
      employee.results.forEach((result) => {
        switch (result.status) {
          case 'present':
            presentCount += 1;
            break;
          case 'half-day':
            tardyCount += 1;
            presentCount += 0.5;
            break;
          case 'absent':
            unexcusedCount += 1;
            break;
          case 'rest':
            excusedCount += 1;
            break;
        }
      });

      dataRow = dataRow.concat([
        { v: presentCount, t: 'n', s: cellStyle },
        { v: tardyCount, t: 'n', s: cellStyle },
        { v: unexcusedCount, t: 'n', s: cellStyle },
        { v: excusedCount, t: 'n', s: cellStyle },
        { v: employee.totalEarnedAmount, t: 'n', s: cellStyle },
        { v: employee.salary, t: 'n', s: cellStyle },
      ]);

      XLSX.utils.sheet_add_aoa(worksheet, [dataRow], { origin: `A${rowOffset}` });
      rowOffset++; // Move to the next row
    });

    // Column widths
    worksheet['!cols'] = [
      { wch: 5 },
      { wch: 20 },
      { wch: 5 },
      { wch: 5 },
      { wch: 5 },
      { wch: 5 },
      { wch: 12 },
      { wch: 12 },
    ];

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Davomat');
    XLSX.writeFile(workbook, `Davomat.xlsx`);
  };

  const closeMonth = async () => {
    setCloseLoading(true);
    try {
      const date = dayjs(selectedMonth);
      const response = await axios
        .post(`${API_BASE_URL}attendance/close-month`, {
          year: date.year(),
          month: date.month() + 1,
        })
        .then((res) => {
          message.success('Muvaffaqiyatli yopildi!');
          fetchAttendanceData();
          setCloseLoading(false);
        })
        .catch((e) => {
          setCloseLoading(false);
          return errorHandler(e);
        });
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error('Error fetching attendance data.');
      setCloseLoading(false);
    }
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
          // <Button
          //   onClick={openMoreAttendanceModal}
          //   color="default"
          //   variant="outlined"
          //   icon={<UnorderedListOutlined />}
          // >
          //   Barchasini belgilash
          // </Button>,
          <Button
            type="primary"
            danger
            icon={<IssuesCloseOutlined />}
            onClick={closeMonth}
            loading={closeLoading}
          >
            Oyni yopish
          </Button>,
          <Button
            icon={<DownloadOutlined />}
            type="primary"
            loading={downloadPdfLoading}
            onClick={downloadExcel}
          >
            XLSX yuklab olish
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

      {moreAttendanceModal && (
        <MoreAttendanceModal
          setIsModalVisible={setMoreAttendanceModal}
          isModalVisible={moreAttendanceModal}
        />
      )}
    </ErpLayout>
  );
};
