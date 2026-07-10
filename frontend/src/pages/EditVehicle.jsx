import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import VehicleForm from '../components/ui/VehicleForm';
import Card from '../components/ui/Card';
import Loader from '../components/ui/Loader';

const EditVehicle = () => {
  const { id } = useParams();
  const [initialData, setInitialData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const { data } = await api.get(`/vehicles/${id}`);
        setInitialData(data);
      } catch (error) {
        toast.error('Failed to load vehicle details');
        navigate('/my-vehicles');
      } finally {
        setIsLoading(false);
      }
    };
    fetchVehicle();
  }, [id, navigate]);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      await api.put(`/vehicles/${id}`, formData);
      toast.success('Vehicle updated successfully!');
      navigate('/my-vehicles');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update vehicle');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="page-wrapper"><Loader /></div>;

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: '800px' }}>
        <Card>
          <h2 style={{ marginBottom: '2rem' }}>Edit Vehicle</h2>
          <VehicleForm 
            initialData={initialData} 
            onSubmit={handleSubmit} 
            isLoading={isSubmitting} 
          />
        </Card>
      </div>
    </div>
  );
};

export default EditVehicle;
