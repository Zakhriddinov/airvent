import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Form, Input, Switch } from 'antd';
const { TextArea } = Input;
export default function ProductCategoryForm() {
  return (
    <>
      <Form.Item
        name="code"
        label="Kod"
        rules={[
          {
            required: true,
            message: 'Kod kiritish majburiy',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="name"
        label="Nomi"
        rules={[
          {
            required: true,
            message: 'Nom kiritish majburiy',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item name="description" label="Tavsif">
        <TextArea rows={4} />
      </Form.Item>
      <Form.Item
        label="Holat"
        name="enabled"
        rules={[
          {
            required: true,
            message: 'Holatni kiritish majburiy',
          },
        ]}
        style={{
          display: 'inline-block',
          width: 'calc(50%)',
          paddingLeft: '5px',
        }}
      >
        <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} />
      </Form.Item>
    </>
  );
}
