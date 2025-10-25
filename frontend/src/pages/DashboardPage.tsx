import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Typography, Spin } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import api from '../../services/api';

const { Title } = Typography;

interface DashboardMetrics {
  totalMonthlyRentDue: number;
  totalOverdueAmount: number;
  collectionRate: number;
}

const DashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/dashboard/metrics');
        setMetrics(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard metrics:', error);
        // Handle error, e.g., show a notification
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  const formatCurrency = (value: number) => `₹${new Intl.NumberFormat('en-IN').format(value)}`;

  if (loading) {
    return <Spin size="large" style={{ display: 'block', margin: 'auto' }} />;
  }

  return (
    <div>
      <Title level={2}>Dashboard</Title>
      <Row gutter={16}>
        <Col xs={24} sm={24} md={8}>
          <Card>
            <Statistic
              title="Total Monthly Rent Due"
              value={metrics ? formatCurrency(metrics.totalMonthlyRentDue) : '...'}
              precision={2}
              valueStyle={{ color: '#3f8600', fontSize: '2rem', fontWeight: 'bold' }}
              prefix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={24} md={8}>
          <Card>
            <Statistic
              title="Total Overdue Amount"
              value={metrics ? formatCurrency(metrics.totalOverdueAmount) : '...'}
              precision={2}
              valueStyle={{ color: '#cf1322', fontSize: '2rem', fontWeight: 'bold' }}
              prefix={<ArrowDownOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={24} md={8}>
          <Card>
            <Statistic
              title="Collection Rate"
              value={metrics ? metrics.collectionRate : 0}
              precision={2}
              valueStyle={{ color: '#3f8600', fontSize: '2rem', fontWeight: 'bold' }}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
