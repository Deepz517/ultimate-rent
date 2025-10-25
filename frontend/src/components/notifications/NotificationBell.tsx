import React, { useEffect, useState } from 'react';
import { Badge, Dropdown, Menu, Spin, Empty } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import api from '../../services/api';
import moment from 'moment';

interface Notification {
  id: number;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/notifications');
      setNotifications(response.data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Poll every minute
    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = async (id: number) => {
    try {
        await api.post(`/api/notifications/${id}/mark-read`);
        fetchNotifications(); // Refresh notifications
    } catch (error) {
        console.error('Failed to mark notification as read:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const menu = (
    <Menu style={{ width: 350 }}>
      <Menu.ItemGroup title="Notifications">
        {loading ? <Spin style={{display: 'block', margin: 'auto'}}/> :
        notifications.length > 0 ? (
          notifications.map(n => (
            <Menu.Item key={n.id} onClick={() => !n.isRead && handleMarkAsRead(n.id)} style={{ whiteSpace: 'normal', height: 'auto' }}>
                <div><strong>{n.message}</strong></div>
                <div style={{ fontSize: '0.8em', color: 'gray' }}>{moment(n.createdAt).fromNow()}</div>
            </Menu.Item>
          ))
        ) : (
          <Empty description="No notifications" />
        )}
      </Menu.ItemGroup>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={['click']}>
      <Badge count={unreadCount}>
        <BellOutlined style={{ fontSize: '20px' }} />
      </Badge>
    </Dropdown>
  );
};

export default NotificationBell;
