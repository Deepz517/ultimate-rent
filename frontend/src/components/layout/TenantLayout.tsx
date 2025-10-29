import React from 'react';
import { Layout, Button, Typography, Avatar } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { Route, Routes, Outlet } from 'react-router-dom';
import TenantDashboardPage from '../../pages/TenantDashboardPage';
import { useAuth } from '../../context/AuthContext';
import NotificationBell from '../notifications/NotificationBell';

const { Header, Content } = Layout;
const { Title } = Typography;

const TenantLayout: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={3} style={{ margin: 0 }}>RentRoll Tenant Portal</Title>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <NotificationBell />
          <Avatar icon={<UserOutlined />} style={{ marginLeft: '24px', marginRight: '8px' }}/>
          <span style={{ marginRight: '16px' }}>{user?.username}</span>
          <Button type="primary" icon={<LogoutOutlined />} onClick={logout}>
            Logout
          </Button>
        </div>
      </Header>
      <Content style={{ padding: '50px' }}>
        <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
          <Routes>
            <Route path="/" element={<TenantDashboardPage />} />
          </Routes>
        </div>
      </Content>
    </Layout>
  );
};

export default TenantLayout;
