import { Form, InputNumber } from 'antd';
// import { useMoney } from '@/settings';

export default function MoneyInputFormItem({ updatePrice, value = 0, readOnly = false }) {
  // const { amountFormatter, currency_symbol, currency_position, cent_precision, currency_code } =
  //   useMoney();
  return (
    <Form.Item>
      <InputNumber
        readOnly={readOnly}
        className="moneyInput"
        onChange={updatePrice}
        // precision={cent_precision ? cent_precision : 2}
        value={value}
        controls={false}
        style={{ width: '100%' }}
        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        parser={(value) => value.replace(/\$\s?|UZS|,/g, '')}
      />
    </Form.Item>
  );
}
