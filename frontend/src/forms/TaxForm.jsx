import React from 'react';
import { Switch, Form, Input, InputNumber } from 'antd';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';

export default function TaxForm({ isUpdateForm = false }) {
  return (
    <>
      <Form.Item
        label={'Nomi'}
        name="taxName"
        rules={[
          {
            required: true,
            message: 'Iltimos, soliq nomini kiriting!',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={'Qiymati'}
        name="taxValue"
        rules={[
          {
            required: true,
            message: 'Iltimos, soliq qiymatini kiriting!',
            type: 'number',
            min: 0,
            max: 100,
          },
        ]}
      >
        <InputNumber min={0} max={100} suffix={'%'} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        label={'Holat'}
        name="enabled"
        style={{
          display: 'inline-block',
          width: 'calc(50%)',
          paddingRight: '5px',
        }}
        valuePropName="checked"
        initialValue={true}
      >
        <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} />
      </Form.Item>
      <Form.Item
        label={'Standart'}
        name="isDefault"
        style={{
          display: 'inline-block',
          width: 'calc(50%)',
          paddingLeft: '5px',
        }}
        valuePropName="checked"
      >
        <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} />
      </Form.Item>
    </>
  );
}
