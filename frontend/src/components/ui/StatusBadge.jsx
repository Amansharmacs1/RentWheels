import React from 'react';

const StatusBadge = ({ status, type = 'booking' }) => {
  let badgeClass = '';

  if (type === 'booking') {
    switch (status) {
      case 'Pending':
        badgeClass = 'bg-yellow-100 text-yellow-800';
        break;
      case 'Accepted':
      case 'Active':
        badgeClass = 'bg-blue-100 text-blue-800';
        break;
      case 'Completed':
        badgeClass = 'bg-green-100 text-green-800';
        break;
      case 'Rejected':
      case 'Cancelled':
        badgeClass = 'bg-red-100 text-red-800';
        break;
      default:
        badgeClass = 'bg-gray-100 text-gray-800';
    }
  } else if (type === 'payment') {
    switch (status) {
      case 'Pending':
        badgeClass = 'bg-yellow-100 text-yellow-800';
        break;
      case 'Received':
        badgeClass = 'bg-green-100 text-green-800';
        break;
      default:
        badgeClass = 'bg-gray-100 text-gray-800';
    }
  }

  return (
    <span style={{ 
      padding: '0.25rem 0.75rem', 
      borderRadius: '9999px', 
      fontSize: '0.875rem',
      fontWeight: '500',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...getStatusStyles(status, type)
    }}>
      {status}
    </span>
  );
};

// Fallback inline styles if tailwind classes aren't used in this project
const getStatusStyles = (status, type) => {
  if (type === 'booking') {
    switch (status) {
      case 'Pending': return { backgroundColor: '#fef3c7', color: '#92400e' };
      case 'Accepted':
      case 'Active': return { backgroundColor: '#dbeafe', color: '#1e40af' };
      case 'Completed': return { backgroundColor: '#d1fae5', color: '#065f46' };
      case 'Rejected':
      case 'Cancelled': return { backgroundColor: '#fee2e2', color: '#b91c1c' };
      default: return { backgroundColor: '#f3f4f6', color: '#374151' };
    }
  } else {
    switch (status) {
      case 'Pending': return { backgroundColor: '#fef3c7', color: '#92400e' };
      case 'Received': return { backgroundColor: '#d1fae5', color: '#065f46' };
      default: return { backgroundColor: '#f3f4f6', color: '#374151' };
    }
  }
};

export default StatusBadge;
