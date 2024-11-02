import { useState, useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import { Form, Input, InputNumber, Button, Select, Divider, Row, Col, Space, Tooltip } from 'antd';

import { EditOutlined, PlusOutlined, SwapOutlined, UnorderedListOutlined } from '@ant-design/icons';

import { DatePicker } from 'antd';

import AutoCompleteAsync from '@/components/AutoCompleteAsync';

import ItemRow from '@/module/ClientErpPanelModule/ItemRow';

import MoneyInputFormItem from '@/components/MoneyInputFormItem';

import calculate from '@/utilities/calculate';
import SelectAsync from '@/components/SelectAsync';

export default function InvoiceForm({ subTotal = 0, current = null, form }) {
  return <LoadInvoiceForm subTotal={subTotal} current={current} form={form} />;
}

function LoadInvoiceForm({ subTotal = 0, current = null, form = { form } }) {
  const [total, setTotal] = useState(0);
  const [taxRate, setTaxRate] = useState(0);
  const [taxTotal, setTaxTotal] = useState(0);
  const [currentYear, setCurrentYear] = useState(() => new Date().getFullYear());
  const [lastNumber, setLastNumber] = useState(() => 1);
  const [currency, setCurrency] = useState();
  const [client, setClient] = useState({});

  const handelTaxChange = (value) => {
    setTaxRate(value / 100);
  };

  const handleChangeClient = (v, data) => {
    setClient(data);
  };

  useEffect(() => {
    if (current) {
      const { taxRate = 0, year, number, currency } = current;
      setTaxRate(taxRate / 100);
      setCurrentYear(year);
      setLastNumber(number);
      setCurrency(currency ?? '');
    }
  }, [current]);
  useEffect(() => {
    const currentTotal = calculate.add(calculate.multiply(subTotal, taxRate), subTotal);
    setTaxTotal(Number.parseFloat(calculate.multiply(subTotal, taxRate)));
    setTotal(Number.parseFloat(currentTotal));

    client?.currency && setCurrency(client?.currency);
  }, [subTotal, taxRate, client]);

  const addField = useRef(false);

  useEffect(() => {
    addField.current.click();
  }, []);
  return (
    <>
      <Row gutter={[12, 0]}>
        <Col className="gutter-row" span={8}>
          {current ? (
            <Form.Item
              label={'Mijoz'}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input value={current?.client.name} readOnly />
            </Form.Item>
          ) : (
            <Form.Item
              name="client"
              label={'Mijoz'}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <AutoCompleteAsync
                entity={'client'}
                displayLabels={['name']}
                searchFields={'name'}
                redirectLabel={'Yangi mijoz yaratish'}
                withRedirect
                urlToRedirect={'/client/list'}
                onChange={handleChangeClient}
              />
            </Form.Item>
          )}
        </Col>
        <Col className="gutter-row" span={3}>
          <Form.Item
            label={'Raqam'}
            name="number"
            initialValue={lastNumber}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={3}>
          <Form.Item
            label={'Yil'}
            name="year"
            initialValue={currentYear}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>

        <Col className="gutter-row" span={5}>
          <Form.Item label={'Valyuta'} name={'currency'}>
            <Form.Item>
              <Input value={currency} readOnly />
            </Form.Item>
          </Form.Item>
        </Col>

        <Col className="gutter-row" span={4}>
          <Form.Item
            label={'Holat'}
            name="status"
            rules={[
              {
                required: false,
              },
            ]}
            initialValue={'draft'}
          >
            <Select
              options={[
                { value: 'draft', label: 'Qoralama' },
                { value: 'pending', label: 'Kutilmoqda' },
                { value: 'sent', label: 'Yuborilgan' },
              ]}
            ></Select>
          </Form.Item>
        </Col>

        <Col className="gutter-row" span={8}>
          <Form.Item
            name="date"
            label={'Sana'}
            rules={[
              {
                required: true,
                type: 'object',
              },
            ]}
            initialValue={dayjs()}
          >
            <DatePicker style={{ width: '100%' }} format={'DD/MM/YYYY'} />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={6}>
          <Form.Item
            name="expiredDate"
            label={'Muddati'}
            rules={[
              {
                required: true,
                type: 'object',
              },
            ]}
            initialValue={dayjs().add(30, 'days')}
          >
            <DatePicker style={{ width: '100%' }} format={'DD/MM/YYYY'} />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={10}>
          <Form.Item label={'Izoh'} name="notes">
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Divider dashed />
      <Row gutter={[12, 12]} style={{ position: 'relative' }}>
        <Col className="gutter-row" span={6}>
          <p>{'Maxsulot'}</p>
        </Col>
        <Col className="gutter-row" span={3}>
          <p>{'Miqdor'}</p>{' '}
        </Col>
        <Col className="gutter-row" span={2}>
          <p>{'Birlik'}</p>{' '}
        </Col>
        <Col className="gutter-row" span={5}>
          <p>{'Narx'}</p>
        </Col>
        <Col className="gutter-row" span={3}>
          <p>{'Chegirma (%)'}</p>
        </Col>
        <Col className="gutter-row" span={5}>
          <p>{'Jami'}</p>
        </Col>
      </Row>
      <Form.List name="items">
        {(fields, { add, remove }) => (
          <>
            {fields.map(
              (field) => (
                // form.getFieldValue(['items', field.name, 'isCustom']) ? (
                //   <CustomItemRow
                //     key={field.key}
                //     remove={remove}
                //     field={field}
                //     current={current}
                //     form={form}
                //   />
                // ) : (
                <ItemRow
                  key={field.key}
                  remove={remove}
                  field={field}
                  current={current}
                  form={form}
                  isCustom={form.getFieldValue(['items', field.name, 'isCustom'])}
                />
              )
              // )
            )}
            {/* Button to add regular ItemRow */}
            <Form.Item>
              <Space>
                <Button
                  type="dashed"
                  onClick={() => add()} // Regular ItemRow (no isCustom)
                  block
                  icon={<PlusOutlined />}
                  ref={addField}
                >
                  Mahsulotdan olish
                </Button>

                <Button
                  type="dashed"
                  onClick={() => add({ isCustom: true })} // Custom ItemRow (with isCustom)
                  block
                  icon={<PlusOutlined />}
                >
                  Qo'lda kiritish
                </Button>
              </Space>
            </Form.Item>
          </>
        )}
      </Form.List>

      <Divider dashed />
      <div style={{ position: 'relative', width: ' 100%', float: 'right' }}>
        <Row gutter={[12, -5]}>
          <Col className="gutter-row" span={5}>
            <Form.Item>
              <Button type="primary" htmlType="submit" icon={<PlusOutlined />} block>
                Saqlash
              </Button>
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={4} offset={10}>
            <p
              style={{
                paddingLeft: '12px',
                paddingTop: '5px',
                margin: 0,
                textAlign: 'right',
              }}
            >
              {'Jami'} :
            </p>
          </Col>
          <Col className="gutter-row" span={5}>
            <MoneyInputFormItem readOnly value={subTotal} />
          </Col>
        </Row>
        <Row gutter={[12, -5]}>
          <Col className="gutter-row" span={4} offset={15}>
            <Form.Item
              name="taxRate"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <SelectAsync
                value={taxRate}
                onChange={handelTaxChange}
                entity={'taxes'}
                outputValue={'taxValue'}
                displayLabels={['taxName']}
                withRedirect={true}
                urlToRedirect="/taxes"
                redirectLabel={'Yangi soliq yaratish'}
                placeholder={'Soliq qiymatini tanlang'}
              />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={5}>
            <MoneyInputFormItem readOnly value={taxTotal} />
          </Col>
        </Row>
        <Row gutter={[12, -5]}>
          <Col className="gutter-row" span={4} offset={15}>
            <p
              style={{
                paddingLeft: '12px',
                paddingTop: '5px',
                margin: 0,
                textAlign: 'right',
              }}
            >
              {'Jami'} :
            </p>
          </Col>
          <Col className="gutter-row" span={5}>
            <MoneyInputFormItem readOnly value={total} />
          </Col>
        </Row>
      </div>
    </>
  );
}
