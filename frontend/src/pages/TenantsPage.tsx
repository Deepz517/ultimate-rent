import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Typography, Spin, Modal, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import api from '../../services/api';
import TenantForm from '../../components/tenants/TenantForm';

const { Title } = Typography;
const { confirm } = Modal;

interface Tenant {
  id: number;
  name: string;
  unit: string;
  leaseStartDate?: string;
  leaseEndDate?: string;
}

const TenantsPage: React.FC = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | undefined>(undefined);

  const fetchTenants = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/tenants');
      setTenants(response.data);
    } catch (error) {
      console.error('Failed to fetch tenants:', error);
      message.error('Failed to fetch tenants.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const handleAdd = () => {
    setEditingTenant(undefined);
    setIsModalVisible(true);
  };

  const handleEdit = (tenant: Tenant) => {
    setEditingTenant(tenant);
    setIsModalVisible(true);
  };

  const handleDelete = (id: number) => {
    confirm({
      title: 'Are you sure you want to delete this tenant?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await api.delete(`/api/tenants/${id}`);
          message.success('Tenant deleted successfully.');
          fetchTenants();
        } catch (error) {
          console.error('Failed to delete tenant:', error);
          message.error('Failed to delete tenant.');
        }
      },
    });
  };

  const handleModalOk = async (values: any) => {
    try {
      if (editingTenant) {
        await api.put(`/api/tenants/${editingTenant.id}`, values);
        message.success('Tenant updated successfully.');
      } else {
        await api.post('/api/tenants', values);
        message.success('Tenant added successfully.');
      }
      setIsModalVisible(false);
      fetchTenants();
    } catch (error) {
      console.error('Failed to save tenant:', error);
      message.error('Failed to save tenant.');
    }
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Unit', dataIndex: 'unit', key: 'unit' },
    { title: 'Lease Start', dataIndex: 'leaseStartDate', key: 'leaseStartDate', render: (date) => date ? new Date(date).toLocaleDateString() : 'N/A' },
    { title: 'Lease End', dataIndex: 'leaseEndDate', key: 'leaseEndDate', render: (date) => date ? new Date(date).toLocaleDateString() : 'N/A' },
    {
      title: 'Action',
      key: 'action',
      render: (_, record: Tenant) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>Edit</Button>
          <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.id)}>Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={2}>Tenants</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Add Tenant
        </Button>
      </div>
      {loading ? (
        <Spin size="large" style={{ display: 'block', margin: 'auto' }} />
      ) : (
        <Table columns={columns} dataSource={tenants} rowKey="id" />
      )}
      <TenantForm
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleModalOk}
        initialValues={editingTenant}
      />
    </div>
  );
};

export default TenantsPage;
