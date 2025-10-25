import React from 'react';
import { Form, Input, Modal } from 'antd';

interface TenantFormProps {
  visible: boolean;
  onCancel: () => void;
  onOk: (values: any) => void;
  initialValues?: any;
}

const TenantForm: React.FC<TenantFormProps> = ({ visible, onCancel, onOk, initialValues }) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form
      .validateFields()
      .then(values => {
        form.resetFields();
        onOk(values);
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Modal
      title={initialValues ? 'Edit Tenant' : 'Add Tenant'}
      visible={visible}
      onOk={handleOk}
      onCancel={onCancel}
      okText="Save"
      cancelText="Cancel"
    >
      <Form form={form} layout="vertical" initialValues={initialValues}>
        <Form.Item
          name="name"
          label="Tenant Name"
          rules={[{ required: true, message: 'Please input the tenant\'s name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="unit"
          label="Unit / Apartment Number"
          rules={[{ required: true, message: 'Please input the unit number!' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TenantForm;
