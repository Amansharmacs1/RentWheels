import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import VehicleForm from '../components/ui/VehicleForm';
import Card from '../components/ui/Card';

const AddVehicle = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      await api.post('/vehicles', formData);
      toast.success('Vehicle listed successfully!');
      navigate('/my-vehicles');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add vehicle');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: '800px' }}>
        <Card>
          <h2 style={{ marginBottom: '2rem' }}>Add New Vehicle</h2>
          <VehicleForm onSubmit={handleSubmit} isLoading={isSubmitting} />
        </Card>
      </div>
    </div>
  );
};

export default AddVehicle;
