import { useDispatch, useSelector } from 'react-redux';
import { crud } from '@/redux/crud/actions';
import { useCrudContext } from '@/context/crud';
import { selectUpdatedItem } from '@/redux/crud/selectors';

import { useEffect } from 'react';
import dayjs from 'dayjs';
import { Button, Form } from 'antd';
import Loading from '@/shared/components/loading';

export default function UpdateForm({ config, formElements, withUpload = false }) {
  let { entity } = config;
  const dispatch = useDispatch();
  const { current, isLoading, isSuccess } = useSelector(selectUpdatedItem);
  const { crudContextAction } = useCrudContext();
  const [form] = Form.useForm();

  const { editBox } = crudContextAction;

  const onSubmit = (fieldsValue) => {
    const id = current._id;

    if (fieldsValue.file && withUpload) {
      fieldsValue.file = fieldsValue.file[0].originFileObj;
    }
    dispatch(crud.update({ entity, id, jsonData: fieldsValue, withUpload }));
  };

  useEffect(() => {
    if (current) {
      let newValues = { ...current };
      if (newValues.birthday) {
        newValues = {
          ...newValues,
          birthday: dayjs(newValues['birthday']).format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
        };
      }
      if (newValues.date) {
        newValues = {
          ...newValues,
          date: dayjs(newValues['date']).format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
        };
      }
      if (newValues.expiredDate) {
        newValues = {
          ...newValues,
          expiredDate: dayjs(newValues['expiredDate']).format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
        };
      }
      if (newValues.created) {
        newValues = {
          ...newValues,
          created: dayjs(newValues['created']).format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
        };
      }
      if (newValues.updated) {
        newValues = {
          ...newValues,
          updated: dayjs(newValues['updated']).format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
        };
      }
      form.resetFields();
      form.setFieldsValue(newValues);
    }
  }, [current]);

  useEffect(() => {
    if (isSuccess) {
      editBox.open();
      form.resetFields();
      dispatch(crud.resetAction({ actionType: 'update' }));
      dispatch(crud.list({ entity }));
      editBox.close();
    }
  }, [isSuccess]);

  const onReset = () => {
    form.resetFields();
  };
  return (
    <div>
      <Loading isLoading={isLoading}>
        <Form form={form} layout="vertical" onFinish={onSubmit}>
          {formElements}
          <Form.Item style={{ textAlign: 'right' }}>
            <Button htmlType="button" onClick={onReset} style={{ marginRight: '10px' }}>
              Tozalash
            </Button>
            <Button type="primary" htmlType="submit">
              Saqlash
            </Button>
          </Form.Item>
        </Form>
      </Loading>
    </div>
  );
}
