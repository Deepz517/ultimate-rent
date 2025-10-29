import React, { useEffect, useState } from 'react';
import { Table, Button, Select, Typography, Spin, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import api from '../services/api';
import PaymentForm from '../components/payments/PaymentForm';

const { Title } = Typography;
const { Option } = Select;

interface Lease {
  id: number;
  tenant: { name: string };
}

interface Payment {
  id: number;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  note?: string;
}

const PaymentsPage: React.FC = () => {
  const [leases, setLeases] = useState<Lease[]>([]);
  const [selectedLeaseId, setSelectedLeaseId] = useState<number | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    // Fetch all leases for the landlord to populate the dropdown
    const fetchLeases = async () => {
      try {
        const response = await api.get('/api/leases/landlord');
        setLeases(response.data);
      } catch (error) {
        message.error('Failed to fetch leases.');
      }
    };
    fetchLeases();
  }, []);

  const handleLeaseChange = async (leaseId: number) => {
    setSelectedLeaseId(leaseId);
    try {
      setLoading(true);
      const response = await api.get(`/api/payments/lease/${leaseId}`);
      setPayments(response.data);
    } catch (error) {
      message.error('Failed to fetch payments for this lease.');
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPayment = async (values: any) => {
    try {
        await api.post('/api/payments', values);
        message.success('Payment added successfully.');
        setIsModalVisible(false);
        if (selectedLeaseId) {
            handleLeaseChange(selectedLeaseId); // Refresh the payments list
        }
    } catch (error) {
        message.error('Failed to add payment.');
    }
  };

  const columns = [
    { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (amount: any) => `₹${amount}` },
    { title: 'Payment Date', dataIndex: 'paymentDate', key: 'paymentDate', render: (date: any) => new Date(date).toLocaleDateString() },
    { title: 'Payment Method', dataIndex: 'paymentMethod', key: 'paymentMethod' },
    { title: 'Note', dataIndex: 'note', key: 'note' },
  ];

  return (
    <div>
      <Title level={2}>Payments</Title>
      <Select
        placeholder="Select a lease to view payments"
        style={{ width: 300, marginBottom: 16 }}
        onChange={handleLeaseChange}
      >
        {leases.map(lease => (
          <Option key={lease.id} value={lease.id}>
            {lease.tenant.name}
          </Option>
        ))}
      </Select>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setIsModalVisible(true)}
        disabled={!selectedLeaseId}
        style={{ marginLeft: 16 }}
      >
        Add Payment
      </Button>

      {loading ? <Spin /> : <Table columns={columns} dataSource={payments} rowKey="id" />}

      <PaymentForm
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleAddPayment}
        leaseId={selectedLeaseId}
      />
    </div>
  );
};

export default PaymentsPage;
