import React, { useEffect, useState } from 'react';
import { Table, Typography, Spin, message } from 'antd';
import api from '../../services/api';

const { Title } = Typography;

interface PaymentHistoryProps {
  leaseId: number;
}

interface Payment {
  id: number;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  note?: string;
}

const PaymentHistory: React.FC<PaymentHistoryProps> = ({ leaseId }) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (leaseId) {
      const fetchPayments = async () => {
        try {
          setLoading(true);
          const response = await api.get(`/api/payments/lease/${leaseId}`);
          setPayments(response.data);
        } catch (error) {
          message.error('Failed to fetch payment history.');
        } finally {
          setLoading(false);
        }
      };
      fetchPayments();
    }
  }, [leaseId]);

  const columns = [
    { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (amount) => `₹${new Intl.NumberFormat('en-IN').format(amount)}` },
    { title: 'Payment Date', dataIndex: 'paymentDate', key: 'paymentDate', render: (date) => new Date(date).toLocaleDateString() },
    { title: 'Payment Method', dataIndex: 'paymentMethod', key: 'paymentMethod' },
    { title: 'Note', dataIndex: 'note', key: 'note', render: (note) => note || '-' },
  ];

  if (loading) {
    return <Spin />;
  }

  return (
    <div style={{ marginTop: '2rem' }}>
      <Title level={3}>Payment History</Title>
      <Table columns={columns} dataSource={payments} rowKey="id" pagination={false} />
    </div>
  );
};

export default PaymentHistory;
