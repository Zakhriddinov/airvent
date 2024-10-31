import { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Row, Col, Select } from 'antd';

import { DeleteOutlined } from '@ant-design/icons';
import calculate from '@/utilities/calculate';
import AutoCompleteAsync from '@/components/AutoCompleteAsync';

export default function ItemRow({ field, remove, current = null, form, isCustom = false }) {
  const [totalState, setTotal] = useState(undefined);
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [maxQuantity, setMaxQuantity] = useState(null);
  const [product, setProduct] = useState({});
  const [discount, setDiscount] = useState(0);
  const [itemName, setItemName] = useState('');
  const [unit, setUnit] = useState('kg');

  const updateQt = (value) => {
    setQuantity(value);
  };

  const updateDiscount = (value) => {
    setDiscount(value);
  };

  const updatePrice = (value) => {
    setPrice(value);
  };

  const handleChangeProduct = (v, data) => {
    setProduct(data);
    setPrice(data?.price);
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
          if (item?.product) {
            setPrice(item?.product?.price);
            setUnit(item?.product?.quantityUnit);
          }
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
          if (item?.product) {
            setPrice(item?.product?.price);
            setUnit(item?.product?.quantityUnit);
          }
          if (item.itemName) {
            setItemName(item.itemName);
            setUnit(item.unit);
          }
        }
      }
    }
  }, [current]);

  useEffect(() => {
    const calculateDiscount = price - (price * discount) / 100;
    const currentTotal = calculate.multiply(calculateDiscount, quantity);
    setTotal(currentTotal);

    if (product?.quantity && !isCustom && !itemName) {
      setMaxQuantity(product.quantity);
    } else {
      setMaxQuantity(0);
    }
  }, [product, price, quantity, discount]);

  return (
    <Row gutter={[12, 12]} style={{ position: 'relative' }}>
      <Col className="gutter-row" span={6}>
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
              onChange={handleChangeProduct}
              urlToRedirect={'/product'}
            />
          </Form.Item>
        )}
      </Col>

      <Col className="gutter-row" span={3}>
        <Form.Item
          name={[field.name, 'quantity']}
          rules={[
            {
              required: true,
            },
          ]}
          style={{ marginBottom: 0 }}
          initialValue={quantity}
        >
          <InputNumber
            style={{ width: '100%' }}
            min={0}
            onChange={updateQt}
            max={maxQuantity || undefined}
          />
        </Form.Item>
        {!isCustom && !itemName && (
          <span style={{ color: 'gray', fontSize: '12px' }}>Maxsulot soni: {maxQuantity}</span>
        )}
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
            </Select>
          </Form.Item>
        ) : (
          <Form.Item initialValue={unit}>
            <Input value={unit} readOnly />
          </Form.Item>
        )}
      </Col>

      <Col className="gutter-row" span={5}>
        {isCustom || itemName ? (
          <Form.Item name={[field.name, 'price']}>
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
        ) : (
          <Form.Item name={[field.name, 'price']} initialValue={price}>
            <Form.Item>
              <InputNumber
                value={price}
                className="moneyInput"
                min={0}
                readOnly
                controls={false}
                style={{ width: '100%' }}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value.replace(/\$\s?|UZS|,/g, '')}
              />
            </Form.Item>
          </Form.Item>
        )}
      </Col>

      <Col className="gutter-row" span={3}>
        <Form.Item
          name={[field.name, 'discount']}
          rules={[
            {
              required: true,
            },
          ]}
          initialValue={discount}
        >
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
