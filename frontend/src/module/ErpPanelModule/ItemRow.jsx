import { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Row, Col, Select } from 'antd';
import AutoCompleteAsync from '@/components/AutoCompleteAsync';

import { DeleteOutlined } from '@ant-design/icons';
import calculate from '@/utilities/calculate';
import SelectAsync from '@/components/SelectAsync';

export default function ItemRow({
  field,
  remove,
  current = null,
  loading = false,
  productData = [],
}) {
  const [totalState, setTotal] = useState(undefined);
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [productPrice, setProductPrice] = useState(0);

  const updateQt = (value) => {
    setQuantity(value);
  };
  const updatePrice = (value) => {
    setPrice(value);
  };
  const updateDiscount = (value) => {
    setDiscount(value);
  };

  useEffect(() => {
    if (current) {
      const { items, invoice } = current;

      if (invoice) {
        const item = invoice[field.fieldKey];

        if (item) {
          setQuantity(item.quantity);
          setPrice(item.price);
        }
      } else {
        const item = items[field.fieldKey];

        if (item) {
          setQuantity(item.quantity);
          setPrice(item.price);
        }
      }
    }
  }, [current]);

  useEffect(() => {
    const currentTotal = calculate.multiply(price, quantity);

    setTotal(currentTotal);
    setProductPrice((price * discount) / 100 + price);
  }, [quantity, price, discount]);

  const productHandleChange = (v, data) => {
    // setPrice(data.price);
  };

  return (
    <Row gutter={[12, 12]} style={{ position: 'relative' }}>
      <Col className="gutter-row" span={5}>
        <Form.Item
          name={[field.name, 'product']}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select loading={loading} disabled={loading} onChange={productHandleChange}>
            {productData?.map((option) => {
              return <Select.Option value={option._id}>{option.name}</Select.Option>;
            })}
          </Select>
        </Form.Item>
      </Col>

      <Col className="gutter-row" span={3}>
        <Form.Item name={[field.name, 'quantity']} rules={[{ required: true }]}>
          <InputNumber style={{ width: '100%' }} min={0} onChange={updateQt} />
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={4}>
        <Form.Item name={[field.name, 'price']} rules={[{ required: true }]}>
          <InputNumber
            onChange={updatePrice}
            className="moneyInput"
            min={0}
            controls={false}
            style={{ width: '100%' }}
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value.replace(/\$\s?|UZS|,/g, '')}
          />
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={3}>
        <Form.Item name={[field.name, 'discount']}>
          {/* <Input placeholder="description Name" /> */}
          <InputNumber
            defaultValue={0}
            min={0}
            max={100}
            formatter={(value) => `${value}%`}
            parser={(value) => value?.replace('%', '')}
            className="moneyInput"
            controls={false}
            style={{ width: '100%' }}
            onChange={updateDiscount}
          />
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={4}>
        <Form.Item name={[field.name, 'productPrice']}>
          <Form.Item>
            <InputNumber
              readOnly
              className="moneyInput"
              value={productPrice}
              min={0}
              controls={false}
              style={{ width: '100%' }}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value.replace(/\$\s?|UZS|,/g, '')}
            />
          </Form.Item>
        </Form.Item>
      </Col>

      <Col className="gutter-row" span={5}>
        <Form.Item name={[field.name, 'total']}>
          <Form.Item>
            <InputNumber
              readOnly
              className="moneyInput"
              value={totalState}
              min={0}
              controls={false}
              style={{ width: '100%' }}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value.replace(/\$\s?|UZS|,/g, '')}
            />
          </Form.Item>
        </Form.Item>
      </Col>

      <div style={{ position: 'absolute', right: '-20px', top: ' 5px' }}>
        <DeleteOutlined onClick={() => remove(field.name)} />
      </div>
    </Row>
  );
}
