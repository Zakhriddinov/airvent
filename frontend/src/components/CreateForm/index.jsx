import React, { useEffect } from 'react';
import Loading from '@/shared/components/loading';
import { Button, Form } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { selectCreatedItem } from '@/redux/crud/selectors';
import { useCrudContext } from '@/context/crud';
import { crud } from '@/redux/crud/actions';

export default function CreateForm({ config, formElements, withUpload = false }) {
  let { entity } = config;
  const dispatch = useDispatch();
  const { isLoading, isSuccess } = useSelector(selectCreatedItem);
  const { crudContextAction } = useCrudContext();
  const { advancedBox } = crudContextAction;
  const [form] = Form.useForm();

  const onSubmit = (fieldsValue) => {
    if (fieldsValue.file && withUpload) {
      fieldsValue.file = fieldsValue.file[0].originFileObj;
    }
    dispatch(crud.create({ entity, jsonData: fieldsValue, withUpload }));
  };

  useEffect(() => {
    if (isSuccess) {
      advancedBox.open();
      form.resetFields();
      dispatch(crud.resetAction({ actionType: 'create' }));
      dispatch(crud.list({ entity }));
      advancedBox.close();
    }
  }, [isSuccess]);

  const onReset = () => {
    form.resetFields();
  };
  return (
    <Loading isLoading={isLoading}>
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        {formElements}
        <Form.Item style={{ textAlign: 'right' }}>
          <Button htmlType="button" onClick={onReset} style={{ marginRight: '10px' }}>
            Tozalash
          </Button>
          <Button type="primary" htmlType="submit">
            Yaratish
          </Button>
        </Form.Item>
      </Form>
    </Loading>
  );
}
