import React, { useEffect, useState } from 'react';
import { Table, Button, Select, Typography, Spin, message, Modal, Space } from 'antd';
import { PlusOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import api from '../../services/api';
import UtilityBillForm from '../../components/utility-bills/UtilityBillForm';

const { Title } = Typography;
const { Option } = Select;
const { confirm } = Modal;

interface Lease {
  id: number;
  tenant: { name: string };
}

interface UtilityBill {
  id: number;
  billType: string;
  amount: number;
  dueDate: string;
  billingPeriod: string;
  imageUrl: string;
}

const UtilityBillsPage: React.FC = () => {
  const [leases, setLeases] = useState<Lease[]>([]);
  const [selectedLeaseId, setSelectedLeaseId] = useState<number | null>(null);
  const [bills, setBills] = useState<UtilityBill[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchLeases = async () => {
      const response = await api.get('/api/leases/landlord');
      setLeases(response.data);
    };
    fetchLeases();
  }, []);

  const fetchBills = async (leaseId: number) => {
    setLoading(true);
    try {
      const response = await api.get(`/api/utility-bills/lease/${leaseId}`);
      setBills(response.data);
    } catch (error) {
      message.error('Failed to fetch utility bills.');
    } finally {
      setLoading(false);
    }
  };

  const handleLeaseChange = (leaseId: number) => {
    setSelectedLeaseId(leaseId);
    fetchBills(leaseId);
  };

  const handleAddBill = async (values: any) => {
    const formData = new FormData();
    const billData = {
        ...values,
        lease: { id: selectedLeaseId },
        dueDate: values.dueDate.format('YYYY-MM-DD'),
    };
    delete billData.upload; // Don't send the upload field in the JSON part

    formData.append('utilityBill', new Blob([JSON.stringify(billData)], { type: 'application/json' }));
    formData.append('file', values.file);

    try {
      await api.post('/api/utility-bills', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      message.success('Utility bill added successfully.');
      setIsModalVisible(false);
      if (selectedLeaseId) fetchBills(selectedLeaseId);
    } catch (error) {
      message.error('Failed to add utility bill.');
    }
  };

  const handleDelete = (id: number) => {
    confirm({
        title: 'Are you sure you want to delete this bill?',
        onOk: async () => {
            try {
                await api.delete(`/api/utility-bills/${id}`);
                message.success('Utility bill deleted.');
                if (selectedLeaseId) fetchBills(selectedLeaseId);
            } catch (error) {
                message.error('Failed to delete bill.');
            }
        }
    });
  };

  const columns = [
    { title: 'Bill Type', dataIndex: 'billType', key: 'billType' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (amount) => `₹${amount}` },
    { title: 'Due Date', dataIndex: 'dueDate', key: 'dueDate', render: (date) => new Date(date).toLocaleDateString() },
    { title: 'Billing Period', dataIndex: 'billingPeriod', key: 'billingPeriod' },
    {
      title: 'Action',
      key: 'action',
      render: (_, record: UtilityBill) => (
        <Space>
            <Button icon={<EyeOutlined />} onClick={() => window.open(`http://localhost:8080/uploads/${record.imageUrl}`, '_blank')}>View</Button>
            <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.id)}>Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={2}>Utility Bills</Title>
      <Select placeholder="Select a lease" style={{ width: 300, marginBottom: 16 }} onChange={handleLeaseChange}>
        {leases.map(lease => <Option key={lease.id} value={lease.id}>{lease.tenant.name}</Option>)}
      </Select>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)} disabled={!selectedLeaseId} style={{ marginLeft: 16 }}>
        Add Bill
      </Button>

      {loading ? <Spin /> : <Table columns={columns} dataSource={bills} rowKey="id" />}

      <UtilityBillForm
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleAddBill}
      />
    </div>
  );
};

export default UtilityBillsPage;
