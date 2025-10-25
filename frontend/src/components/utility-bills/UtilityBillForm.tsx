import React, { useState } from 'react';
import { Form, Input, Modal, Select, DatePicker, InputNumber, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Option } = Select;

interface UtilityBillFormProps {
  visible: boolean;
  onCancel: () => void;
  onOk: (values: any) => void;
  initialValues?: any;
}

const UtilityBillForm: React.FC<UtilityBillFormProps> = ({ visible, onCancel, onOk, initialValues }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  const handleOk = () => {
    form.validateFields().then(values => {
      const payload = { ...values, file: fileList[0] };
      onOk(payload);
      form.resetFields();
      setFileList([]);
    });
  };

  const uploadProps = {
    onRemove: file => {
      setFileList([]);
    },
    beforeUpload: file => {
      setFileList([file]);
      return false; // Prevent automatic upload
    },
    fileList,
  };

  return (
    <Modal
      title={initialValues ? 'Edit Utility Bill' : 'Add Utility Bill'}
      visible={visible}
      onOk={handleOk}
      onCancel={onCancel}
    >
      <Form form={form} layout="vertical" initialValues={initialValues}>
        <Form.Item name="billType" label="Bill Type" rules={[{ required: true }]}>
          <Select placeholder="Select a bill type">
            <Option value="ELECTRICITY">Electricity</Option>
            <Option value="WATER">Water</Option>
            <Option value="GAS">Gas</Option>
            <Option value="INTERNET">Internet</Option>
            <Option value="MAINTENANCE">Maintenance</Option>
          </Select>
        </Form.Item>
        <Form.Item name="amount" label="Amount (₹)" rules={[{ required: true }]}>
          <InputNumber style={{ width: '100%' }} min={0} />
        </Form.Item>
        <Form.Item name="dueDate" label="Due Date" rules={[{ required: true }]}>
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="billingPeriod" label="Billing Period" rules={[{ required: true }]}>
          <Input placeholder="e.g., January 2024" />
        </Form.Item>
        <Form.Item
          name="upload"
          label="Upload Bill Document"
          valuePropName="fileList"
          getValueFromEvent={e => Array.isArray(e) ? e : e && e.fileList}
          rules={[{ required: !initialValues, message: 'Please upload a bill document!' }]}
        >
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>Select File</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UtilityBillForm;
