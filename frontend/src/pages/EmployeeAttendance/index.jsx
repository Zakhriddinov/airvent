import React, { useState, useEffect } from 'react';
import {
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
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

  const fetchAttendanceData = async () => {
    setLoading(true);
    try {
      const date = dayjs(selectedMonth);
      const response = await axios.get(
        `${API_BASE_URL}attendance/${date.year()}/${date.month() + 1}`
      );
      setAttendanceData(response.data);
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

  const dataSource = attendance.map((employeeRecord) => ({
    key: employeeRecord.employee._id,
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
    },
    {
      title: 'Oylik maoshi',
      dataIndex: 'salary',
      key: 'salary',
      fixed: 'right',
      width: 150,
    },
  ];

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
