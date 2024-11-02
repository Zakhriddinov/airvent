import React, { useState } from 'react';
import dayjs from 'dayjs';
import { Form, Input, InputNumber, Select } from 'antd';
import { DatePicker } from 'antd';

export default function PaymentForm({ maxAmount = null, isUpdateForm = false }) {
  const { TextArea } = Input;
  const [paymentMode, setPaymentModeCurrency] = useState('cash');
  
  return (
    <>
      <Form.Item
        label={'Raqam'}
        name="number"
        initialValue={1}
        rules={[
          {
            required: true,
          },
        ]}
        style={{ width: '50%', float: 'left', paddingRight: '20px' }}
      >
        <InputNumber min={1} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item
        name="date"
        label={'Sana'}
        rules={[
          {
            required: true,
            type: 'object',
          },
        ]}
        initialValue={dayjs().add(30, 'days')}
        style={{ width: '100%' }}
      >
        <DatePicker style={{ width: '100%' }} format={'DD/MM/YYYY'}/>
      </Form.Item>

      <Form.Item label={"To'lov turi"} name={`paymentMode`} initialValue={paymentMode}>
        <Select defaultValue="cash" onChange={setPaymentModeCurrency} style={{ width: '100%' }}>
          <Select.Option value="cash">Naqd</Select.Option>
          <Select.Option value="transfer">Transfer</Select.Option>
          <Select.Option value="click">Click</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item label={'Summa'} name="amount" rules={[{ required: true }]}>
        <InputNumber
          className="moneyInput"
          min={0}
          controls={false}
          style={{ width: '100%' }}
          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={(value) => value.replace(/\$\s?|UZS|,/g, '')}
        />
      </Form.Item>
      <Form.Item label={'Description'} name="description">
        <TextArea />
      </Form.Item>
    </>
  );
}
