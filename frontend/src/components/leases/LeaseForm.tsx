import React, { useEffect, useState } from 'react';
import { Form, Input, Modal, Select, DatePicker, InputNumber } from 'antd';
import api from '../../services/api';

const { Option } = Select;

interface LeaseFormProps {
  visible: boolean;
  onCancel: () => void;
  onOk: (values: any) => void;
  initialValues?: any;
}

interface Tenant {
  id: number;
  name: string;
}

const LeaseForm: React.FC<LeaseFormProps> = ({ visible, onCancel, onOk, initialValues }) => {
  const [form] = Form.useForm();
  const [tenants, setTenants] = useState<Tenant[]>([]);

  useEffect(() => {
    if (visible) {
      // Fetch tenants to populate the dropdown
      const fetchTenants = async () => {
        try {
          const response = await api.get('/api/tenants');
          setTenants(response.data);
        } catch (error) {
          console.error('Failed to fetch tenants for form', error);
        }
      };
      fetchTenants();
    }
  }, [visible]);

  const handleOk = () => {
    form.validateFields().then(values => {
      form.resetFields();
      onOk(values);
    });
  };

  return (
    <Modal
      title={initialValues ? 'Edit Lease' : 'Add Lease'}
      visible={visible}
      onOk={handleOk}
      onCancel={onCancel}
      width={600}
    >
      <Form form={form} layout="vertical" initialValues={initialValues}>
        <Form.Item name="tenantId" label="Tenant" rules={[{ required: true }]}>
          <Select placeholder="Select a tenant">
            {tenants.map(tenant => (
              <Option key={tenant.id} value={tenant.id}>{tenant.name}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="rentAmount" label="Rent Amount (₹)" rules={[{ required: true }]}>
          <InputNumber style={{ width: '100%' }} min={0} />
        </Form.Item>
        <Form.Item name="startDate" label="Start Date" rules={[{ required: true }]}>
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="endDate" label="End Date" rules={[{ required: true }]}>
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default LeaseForm;
