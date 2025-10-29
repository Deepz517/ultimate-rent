import React, { useEffect, useState } from 'react';
import { Card, Descriptions, Typography, Spin, Alert } from 'antd';
import api from '../services/api';
import PaymentHistory from '../components/tenant/PaymentHistory';
import UtilityBillsList from '../components/tenant/UtilityBillsList';

const { Title } = Typography;

interface Lease {
  id: number;
  rentAmount: number;
  startDate: string;
  endDate: string;
  landlord: { username: string };
}

const TenantDashboardPage: React.FC = () => {
  const [lease, setLease] = useState<Lease | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLease = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/leases/tenant');
        // Assuming the endpoint returns a list and we take the first active lease
        if (response.data && response.data.length > 0) {
          setLease(response.data[0]);
        }
      } catch (error) {
        console.error('Failed to fetch lease details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLease();
  }, []);

  if (loading) {
    return <Spin />;
  }

  if (!lease) {
    return <Alert message="No active lease found." type="info" />;
  }

  return (
    <div>
      <Title level={2}>My Dashboard</Title>
      <Card>
        <Descriptions title="Lease Details" bordered column={1}>
          <Descriptions.Item label="Landlord">{lease.landlord.username}</Descriptions.Item>
          <Descriptions.Item label="Monthly Rent">₹{new Intl.NumberFormat('en-IN').format(lease.rentAmount)}</Descriptions.Item>
          <Descriptions.Item label="Lease Start Date">{new Date(lease.startDate).toLocaleDateString()}</Descriptions.Item>
          <Descriptions.Item label="Lease End Date">{new Date(lease.endDate).toLocaleDateString()}</Descriptions.Item>
        </Descriptions>
      </Card>

      <PaymentHistory leaseId={lease.id} />

      <UtilityBillsList leaseId={lease.id} />
    </div>
  );
};

export default TenantDashboardPage;
