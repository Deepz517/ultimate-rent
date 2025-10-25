import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Typography, Spin, Modal, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import api from '../../services/api';
import LeaseForm from '../../components/leases/LeaseForm';
import moment from 'moment';

const { Title } = Typography;
const { confirm } = Modal;

interface Lease {
  id: number;
  tenant: { id: number; name: string };
  rentAmount: number;
  startDate: string;
  endDate: string;
}

const LeasesPage: React.FC = () => {
  const [leases, setLeases] = useState<Lease[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingLease, setEditingLease] = useState<any>(undefined);

  const fetchLeases = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/leases/landlord');
      setLeases(response.data);
    } catch (error) {
      message.error('Failed to fetch leases.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeases();
  }, []);

  const handleAdd = () => {
    setEditingLease(undefined);
    setIsModalVisible(true);
  };

  const handleEdit = (lease: Lease) => {
    setEditingLease({
        ...lease,
        tenantId: lease.tenant.id,
        startDate: moment(lease.startDate),
        endDate: moment(lease.endDate),
    });
    setIsModalVisible(true);
  };

  const handleDelete = (id: number) => {
    confirm({
      title: 'Are you sure you want to delete this lease?',
      onOk: async () => {
        try {
          await api.delete(`/api/leases/${id}`);
          message.success('Lease deleted successfully.');
          fetchLeases();
        } catch (error) {
          message.error('Failed to delete lease.');
        }
      },
    });
  };

  const handleModalOk = async (values: any) => {
    const payload = {
      ...values,
      tenant: { id: values.tenantId },
      startDate: values.startDate.format('YYYY-MM-DD'),
      endDate: values.endDate.format('YYYY-MM-DD'),
    };

    try {
      if (editingLease) {
        await api.put(`/api/leases/${editingLease.id}`, payload);
        message.success('Lease updated successfully.');
      } else {
        await api.post('/api/leases', payload);
        message.success('Lease created successfully.');
      }
      setIsModalVisible(false);
      fetchLeases();
    } catch (error) {
      message.error('Failed to save lease.');
    }
  };

  const columns = [
    { title: 'Tenant Name', dataIndex: ['tenant', 'name'], key: 'tenantName' },
    { title: 'Rent Amount', dataIndex: 'rentAmount', key: 'rentAmount', render: (amount) => `₹${amount}` },
    { title: 'Start Date', dataIndex: 'startDate', key: 'startDate', render: (date) => new Date(date).toLocaleDateString() },
    { title: 'End Date', dataIndex: 'endDate', key: 'endDate', render: (date) => new Date(date).toLocaleDateString() },
    {
      title: 'Action',
      key: 'action',
      render: (_, record: Lease) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>Edit</Button>
          <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.id)}>Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={2}>Leases</Title>
      <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} style={{ marginBottom: 16 }}>
        Add Lease
      </Button>
      {loading ? <Spin /> : <Table columns={columns} dataSource={leases} rowKey="id" />}
      <LeaseForm
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleModalOk}
        initialValues={editingLease}
      />
    </div>
  );
};

export default LeasesPage;
