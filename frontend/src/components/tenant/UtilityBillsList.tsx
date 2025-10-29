import React, { useEffect, useState } from 'react';
import { Table, Typography, Spin, message, Button, Space } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import api from '../../services/api';

const { Title } = Typography;

interface UtilityBillsListProps {
  leaseId: number;
}

interface UtilityBill {
  id: number;
  billType: string;
  amount: number;
  dueDate: string;
  billingPeriod: string;
  imageUrl: string;
}

const UtilityBillsList: React.FC<UtilityBillsListProps> = ({ leaseId }) => {
  const [bills, setBills] = useState<UtilityBill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (leaseId) {
      const fetchBills = async () => {
        try {
          setLoading(true);
          const response = await api.get(`/api/utility-bills/lease/${leaseId}`);
          setBills(response.data);
        } catch (error) {
          message.error('Failed to fetch utility bills.');
        } finally {
          setLoading(false);
        }
      };
      fetchBills();
    }
  }, [leaseId]);

  const columns = [
    { title: 'Bill Type', dataIndex: 'billType', key: 'billType' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (amount: any) => `₹${new Intl.NumberFormat('en-IN').format(amount)}` },
    { title: 'Due Date', dataIndex: 'dueDate', key: 'dueDate', render: (date: any) => new Date(date).toLocaleDateString() },
    { title: 'Billing Period', dataIndex: 'billingPeriod', key: 'billingPeriod' },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: UtilityBill) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => window.open(`http://localhost:8080/uploads/${record.imageUrl}`, '_blank')}>View Bill</Button>
        </Space>
      ),
    },
  ];

  if (loading) {
    return <Spin />;
  }

  return (
    <div style={{ marginTop: '2rem' }}>
      <Title level={3}>Utility Bills</Title>
      <Table columns={columns} dataSource={bills} rowKey="id" pagination={false} />
    </div>
  );
};

export default UtilityBillsList;
