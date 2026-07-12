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

  const handleExport = (type) => {
    const token = localStorage.getItem('token');
    window.open(`http://localhost:5000/api/admin/reports/${type}/csv?token=${token}`, '_blank');
    // Note: Since we are using token in localStorage, a better way for production is to fetch as blob and trigger download:
    api.get(`/admin/reports/${type}/csv`, { responseType: 'blob' })
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${type}_report.csv`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      })
      .catch(() => toast.error('Failed to export report'));
  };

  return (
    <div className="page-wrapper page-enter page-enter-active" style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem', padding: '2rem' }}>
      <AdminSidebar />
      <div className="admin-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ margin: 0, color: 'var(--text-dark)' }}>Admin Dashboard</h2>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={() => handleExport('users')} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Export Users</button>
            <button onClick={() => handleExport('vehicles')} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Export Vehicles</button>
            <button onClick={() => handleExport('bookings')} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Export Bookings</button>
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <Card className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#6b7280' }}>Total Users</h4>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0, color: 'var(--primary-color)' }}>{stats.users.total}</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '0.5rem', fontSize: '0.9rem' }}>
              <span style={{ color: '#10b981' }}>{stats.users.customers} Cust</span>
              <span style={{ color: '#f59e0b' }}>{stats.users.owners} Own</span>
            </div>
          </Card>

          <Card className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#6b7280' }}>Total Vehicles</h4>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0, color: 'var(--primary-color)' }}>{stats.vehicles.total}</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '0.5rem', fontSize: '0.9rem' }}>
              <span style={{ color: '#10b981' }}>{stats.vehicles.verified} Verif</span>
              <span style={{ color: '#ef4444' }}>{stats.vehicles.pending} Pend</span>
            </div>
          </Card>

          <Card className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#6b7280' }}>Active Bookings</h4>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0, color: '#10b981' }}>{stats.bookings.active}</p>
          </Card>

          <Card className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#6b7280' }}>Total Revenue (Est)</h4>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0 0 0', color: '#8b5cf6' }}>₹{stats.revenue.toLocaleString()}</p>
          </Card>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <AnalyticsChart 
            title="Booking Trends (Last 6 Months)" 
            type="line" 
            data={stats.monthlyData || []} 
            xKey="name" 
            yKey="bookings" 
            color="var(--primary-color)" 
          />
          <AnalyticsChart 
            title="Monthly Revenue" 
            type="bar" 
            data={stats.monthlyData || []} 
            xKey="name" 
            yKey="revenue" 
            color="#8b5cf6" 
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
