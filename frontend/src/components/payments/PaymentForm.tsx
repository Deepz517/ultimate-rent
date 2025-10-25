import React, { useState } from 'react';
import { Form, Input, Modal, Select, DatePicker, InputNumber } from 'antd';
import moment from 'moment';

const { Option } = Select;

interface PaymentFormProps {
  visible: boolean;
  onCancel: () => void;
  onOk: (values: any) => void;
  leaseId: number | null;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ visible, onCancel, onOk, leaseId }) => {
  const [form] = Form.useForm();
  const [paymentMethod, setPaymentMethod] = useState<string>('');

  const handleOk = () => {
    form.validateFields().then(values => {
      // Add leaseId to the payload
      const payload = { ...values, lease: { id: leaseId } };
      onOk(payload);
      form.resetFields();
      setPaymentMethod('');
    });
  };

  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethod(value);
  };

  return (
    <Modal
      title="Add Payment"
      visible={visible}
      onOk={handleOk}
      onCancel={onCancel}
    >
      <Form form={form} layout="vertical" initialValues={{ paymentDate: moment() }}>
        <Form.Item name="amount" label="Amount (₹)" rules={[{ required: true }]}>
          <InputNumber style={{ width: '100%' }} min={0} />
        </Form.Item>
        <Form.Item name="paymentDate" label="Payment Date" rules={[{ required: true }]}>
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="paymentMethod" label="Payment Method" rules={[{ required: true }]}>
          <Select placeholder="Select a method" onChange={handlePaymentMethodChange}>
            <Option value="CASH">Cash</Option>
            <Option value="UPI">UPI</Option>
            <Option value="BANK_TRANSFER">Bank Transfer</Option>
          </Select>
        </Form.Item>
        {paymentMethod === 'CASH' && (
          <Form.Item
            name="note"
            label="Note / Receipt Reference"
            rules={[{ required: true, message: 'A note is required for cash payments.' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default PaymentForm;
