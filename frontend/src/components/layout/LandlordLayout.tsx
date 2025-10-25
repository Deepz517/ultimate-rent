import React, { useState } from 'react';
import { Layout, Menu, Button, Typography, Avatar } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  FileTextOutlined,
  DollarCircleOutlined,
  ToolOutlined,
  PieChartOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NotificationBell from '../notifications/NotificationBell';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

const menuItems = [
  { key: 'dashboard', icon: <DashboardOutlined />, label: 'Dashboard', path: '/landlord/dashboard' },
  { key: 'tenants', icon: <UserOutlined />, label: 'Tenants', path: '/landlord/tenants' },
  { key: 'leases', icon: <FileTextOutlined />, label: 'Leases', path: '/landlord/leases' },
  { key: 'payments', icon: <DollarCircleOutlined />, label: 'Payments', path: '/landlord/payments' },
  { key: 'bills', icon: <ToolOutlined />, label: 'Utility Bills', path: '/landlord/bills' },
  { key: 'reports', icon: <PieChartOutlined />, label: 'Reports', path: '/landlord/reports' },
];

const LandlordLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const selectedKey = menuItems.find(item => location.pathname.startsWith(item.path))?.key || 'dashboard';

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div style={{ height: '32px', margin: '16px', color: 'white', textAlign: 'center' }}>
          <Title level={4} style={{ color: 'white' }}>RentRoll</Title>
        </div>
        <Menu theme="dark" selectedKeys={[selectedKey]} mode="inline">
          {menuItems.map(item => (
            <Menu.Item key={item.key} icon={item.icon}>
              <Link to={item.path}>{item.label}</Link>
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ padding: '0 16px', background: '#fff', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <NotificationBell />
          <Avatar icon={<UserOutlined />} style={{ marginLeft: '16px', marginRight: '8px' }}/>
          <span style={{ marginRight: '16px' }}>{user?.username}</span>
          <Button type="primary" icon={<LogoutOutlined />} onClick={logout}>
            Logout
          </Button>
        </Header>
        <Content style={{ margin: '16px' }}>
          <div style={{ padding: 24, minHeight: 360, background: '#fff' }}>
            <Outlet /> {/* Child routes will be rendered here */}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default LandlordLayout;
