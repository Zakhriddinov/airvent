import { useState, useEffect } from 'react';
import { Form, Button } from 'antd';
import dayjs from 'dayjs';
import { useSelector, useDispatch } from 'react-redux';
import { erp } from '@/redux/erp/actions';
import { selectUpdatedItem } from '@/redux/erp/selectors';

import Loading from '@/components/Loading';

import calculate from '@/utilities/calculate';
import PaymentForm from '@/forms/PaymentForm';
import { useNavigate } from 'react-router-dom';

export default function UpdatePayment({ config, currentInvoice }) {
  const navigate = useNavigate();
  let { entity } = config;
  const dispatch = useDispatch();

  const { isLoading, isSuccess } = useSelector(selectUpdatedItem);

  const [form] = Form.useForm();

  const [maxAmount, setMaxAmount] = useState(0);

  useEffect(() => {
    if (currentInvoice) {
      const { credit, total, discount = 0, amount } = currentInvoice;

      setMaxAmount(
        calculate.sub(calculate.sub(total, discount), calculate.sub(calculate.sub(credit, amount)))
      );
      const newInvoiceValues = { ...currentInvoice };
      if (newInvoiceValues.date) {
        newInvoiceValues.date = dayjs(newInvoiceValues.date);
      }
      form.setFieldsValue(newInvoiceValues);
    }
  }, [currentInvoice]);

  useEffect(() => {
    if (isSuccess) {
      form.resetFields();
      dispatch(erp.resetAction({ actionType: 'recordPayment' }));
      dispatch(erp.list({ entity }));
      navigate(`/supplier/payment`);
    }
  }, [isSuccess]);

  const onSubmit = (fieldsValue) => {
    if (currentInvoice) {
      const { _id: invoice } = currentInvoice;
      console.log(currentInvoice);

      const supplier = currentInvoice.supplier && currentInvoice.supplier._id;
      fieldsValue = {
        ...fieldsValue,
        invoice,
        supplier,
      };
    }

    dispatch(
      erp.update({
        entity,
        id: currentInvoice.paymentId,
        jsonData: fieldsValue,
      })
    );
  };

  return (
    <>
      <Loading isLoading={isLoading}>
        <Form form={form} layout="vertical" onFinish={onSubmit}>
          <PaymentForm maxAmount={maxAmount} />
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Yangilash
            </Button>
          </Form.Item>
        </Form>
      </Loading>
    </>
  );
}
