import React from 'react';
import { AlertCircle } from 'lucide-react';
import Button from './Button';

const ErrorState = ({ message = 'Something went wrong', onRetry, className = '' }) => {
  return (
    <div className={`empty-state ${className}`}>
      <AlertCircle className="empty-state-icon" style={{ color: 'var(--error-color)', opacity: 1 }} />
      <h3 style={{ marginBottom: '0.5rem' }}>Oops!</h3>
      <p style={{ marginBottom: '1.5rem' }}>{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="primary">
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
