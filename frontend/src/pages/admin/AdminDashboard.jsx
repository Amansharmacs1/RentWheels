import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import AdminSidebar from '../../components/ui/AdminSidebar';
import Card from '../../components/ui/Card';
import AnalyticsChart from '../../components/ui/AnalyticsChart';
import Loader from '../../components/ui/Loader';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/admin/dashboard');
        setStats(data);
      } catch (error) {
        toast.error('Failed to load admin stats');
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) return <div className="page-wrapper"><Loader /></div>;
  if (!stats) return null;

  const mockGrowthData = [
    { name: 'Jan', users: Math.round(stats.users.total * 0.2) },
    { name: 'Feb', users: Math.round(stats.users.total * 0.4) },
    { name: 'Mar', users: Math.round(stats.users.total * 0.6) },
    { name: 'Apr', users: Math.round(stats.users.total * 0.8) },
    { name: 'May', users: stats.users.total },
  ];

  const mockRevenueData = [
    { name: 'Jan', amount: Math.round(stats.revenue * 0.1) },
    { name: 'Feb', amount: Math.round(stats.revenue * 0.2) },
    { name: 'Mar', amount: Math.round(stats.revenue * 0.3) },
    { name: 'Apr', amount: Math.round(stats.revenue * 0.4) },
    { name: 'May', amount: stats.revenue },
  ];

  return (
    <div className="page-wrapper" style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem', padding: '2rem' }}>
      <AdminSidebar />
      <div className="admin-content">
        <h2 style={{ marginBottom: '2rem', color: 'var(--text-dark)' }}>Admin Dashboard</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <Card style={{ padding: '1.5rem', textAlign: 'center' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#6b7280' }}>Total Users</h4>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0, color: 'var(--primary-color)' }}>{stats.users.total}</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '0.5rem', fontSize: '0.9rem' }}>
              <span style={{ color: '#10b981' }}>{stats.users.customers} Cust</span>
              <span style={{ color: '#f59e0b' }}>{stats.users.owners} Own</span>
            </div>
          </Card>

          <Card style={{ padding: '1.5rem', textAlign: 'center' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#6b7280' }}>Total Vehicles</h4>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0, color: 'var(--primary-color)' }}>{stats.vehicles.total}</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '0.5rem', fontSize: '0.9rem' }}>
              <span style={{ color: '#10b981' }}>{stats.vehicles.verified} Verif</span>
              <span style={{ color: '#ef4444' }}>{stats.vehicles.pending} Pend</span>
            </div>
          </Card>

          <Card style={{ padding: '1.5rem', textAlign: 'center' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#6b7280' }}>Active Bookings</h4>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0, color: '#10b981' }}>{stats.bookings.active}</p>
          </Card>

          <Card style={{ padding: '1.5rem', textAlign: 'center' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#6b7280' }}>Total Revenue (Est)</h4>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0 0 0', color: '#8b5cf6' }}>₹{stats.revenue.toLocaleString()}</p>
          </Card>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <AnalyticsChart 
            title="User Growth (Simulated)" 
            type="line" 
            data={mockGrowthData} 
            xKey="name" 
            yKey="users" 
            color="var(--primary-color)" 
          />
          <AnalyticsChart 
            title="Monthly Revenue (Simulated)" 
            type="bar" 
            data={mockRevenueData} 
            xKey="name" 
            yKey="amount" 
            color="#8b5cf6" 
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
