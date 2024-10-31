import { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Row, Col, Select } from 'antd';
import AutoCompleteAsync from '@/components/AutoCompleteAsync';

import { DeleteOutlined } from '@ant-design/icons';
import calculate from '@/utilities/calculate';

export default function ItemRow({ field, remove, current = null, isCustom }) {
  const [totalState, setTotal] = useState(undefined);
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [productPrice, setProductPrice] = useState(0);
  const [itemName, setItemName] = useState('');
  const [unit, setUnit] = useState('kg');
  const [product, setProduct] = useState({});

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
          setDiscount(item.discount);
          if (item?.product) setUnit(item?.product?.quantityUnit);
          // else setUnit(item.unit);
          setUnit(item.unit);
          if (item.itemName) {
            setItemName(item.itemName);
            setUnit(item.unit);
          }
        }
      } else {
        const item = items[field.fieldKey];
        if (item) {
          setQuantity(item.quantity);
          setPrice(item.price);
          setDiscount(item.discount);
          if (item?.product) setUnit(item?.product?.quantityUnit);
          // else setUnit(item.unit);
          if (item.itemName) {
            setItemName(item.itemName);
            setUnit(item.unit);
          }
        }
      }
    }
  }, [current]);

  useEffect(() => {
    const currentTotal = calculate.multiply(price, quantity);

    setTotal(currentTotal);
    setProductPrice((price * discount) / 100 + price);
  }, [quantity, price, discount, product]);

  const productHandleChange = (v, data) => {
    setUnit(data?.quantityUnit);
  };

  return (
    <Row gutter={[12, 12]} style={{ position: 'relative' }}>
      <Col className="gutter-row" span={5}>
        {isCustom || itemName ? (
          <Form.Item
            name={[field.name, 'itemName']}
            rules={[
              {
                required: true,
              },
            ]}
            initialValue={itemName}
          >
            <Input placeholder="Mahsulot nomi" onChange={(e) => setItemName(e.target.value)} />
          </Form.Item>
        ) : (
          <Form.Item
            name={[field.name, 'product']}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <AutoCompleteAsync
              entity={'products'}
              displayLabels={['name']}
              searchFields={'name'}
              redirectLabel={'Yangi maxsulot yaratish'}
              withRedirect
              onChange={productHandleChange}
              urlToRedirect={'/product'}
            />
          </Form.Item>
        )}
      </Col>

      <Col className="gutter-row" span={3}>
        <Form.Item name={[field.name, 'quantity']} rules={[{ required: true }]}>
          <InputNumber style={{ width: '100%' }} min={0} onChange={updateQt} />
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={2}>
        {isCustom || itemName ? (
          <Form.Item
            name={[field.name, 'unit']}
            rules={[
              {
                required: true,
              },
            ]}
            initialValue={unit}
          >
            <Select defaultValue={unit} onChange={setUnit} style={{ width: '100%' }}>
              <Select.Option value="kg">kg</Select.Option>
              <Select.Option value="m">metr</Select.Option>
              <Select.Option value="l">litr</Select.Option>
              <Select.Option value="dona">dona</Select.Option>
              <Select.Option value="m2">m2</Select.Option>
            </Select>
          </Form.Item>
        ) : (
          <Form.Item initialValue={unit}>
            <Input value={unit} readOnly />
          </Form.Item>
        )}
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
      <Col className="gutter-row" span={2}>
        <Form.Item name={[field.name, 'discount']}>
          <InputNumber
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

      <Col className="gutter-row" span={4}>
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
