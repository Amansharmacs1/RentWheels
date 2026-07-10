import React from 'react';
import Modal from './Modal';
import Button from './Button';

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, itemName = 'this item', isDeleting = false }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Deletion">
      <p style={{ marginBottom: '1.5rem', color: 'var(--text-dark)' }}>
        Are you sure you want to delete {itemName}? This action cannot be undone.
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
        <Button variant="secondary" onClick={onClose} disabled={isDeleting}>Cancel</Button>
        <Button variant="primary" style={{ backgroundColor: 'var(--error-color)', borderColor: 'var(--error-color)' }} onClick={onConfirm} disabled={isDeleting}>
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmDeleteModal;
