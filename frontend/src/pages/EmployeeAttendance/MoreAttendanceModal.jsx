import { List, Modal, Radio, DatePicker } from 'antd';
import React, { useState } from 'react';
const { RangePicker } = DatePicker;

const data = [
  {
    employeeId: '66aa5d9e9ef7a237105f0638',
    date: '2024-10-03',
    status: 'not-started',
    earnedAmount: 999999,
  },
  {
    employeeId: '66aa5d9e9ef7a237105f0638',
    date: '2024-10-03',
    status: 'not-started',
    earnedAmount: 999999,
  },
  {
    employeeId: '66aa5d9e9ef7a237105f0638',
    date: '2024-10-03',
    status: 'not-started',
    earnedAmount: 999999,
  },
  {
    employeeId: '66aa5d9e9ef7a237105f0638',
    date: '2024-10-03',
    status: 'not-started',
    earnedAmount: 999999,
  },
];

const statusOptions = ['half-day', 'absent', 'present', 'not-started', 'rest'];
const statusLabel = {
  'not-started': 'Hali boshlanmadi',
  rest: 'Dam olish',
  'half-day': 'Yarim kun ishladi',
  absent: 'Kelmadi',
  present: 'Keldi',
};

const MoreAttendanceModal = ({ setIsModalVisible, isModalVisible }) => {
  const [status, setStatus] = useState(data.map((item) => item.status));

  const handleStatusChange = (index, newStatus) => {
    const updatedStatus = [...status];
    updatedStatus[index] = newStatus;
    setStatus(updatedStatus);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  return (
    <Modal
      title="Employee Status List"
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Saqlash"
      cancelText="Yopish"
      width={1000}
      centered
    >
      <RangePicker style={{ }} />
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item, index) => (
          <List.Item>
            <List.Item.Meta title={`${item.employeeId}`} />
            <Radio.Group
              onChange={(e) => handleStatusChange(index, e.target.value)}
              value={status[index]}
            >
              {statusOptions.map((option) => (
                <Radio key={option} value={option}>
                  {statusLabel[option]}
                </Radio>
              ))}
            </Radio.Group>
          </List.Item>
        )}
      />
    </Modal>
  );
};

export default MoreAttendanceModal;
