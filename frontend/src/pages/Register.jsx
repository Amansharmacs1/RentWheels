import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { sendWelcomeEmail } from '../services/emailService';
import toast from 'react-hot-toast';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setIsLoading(false);
      return toast.error('Passwords do not match');
    }

    try {
      const { confirmPassword, ...registerData } = formData;
      // Force role to Customer to satisfy backend schema
      registerData.role = 'Customer';
      
      const user = await register(registerData);
      
      // Send welcome email
      await sendWelcomeEmail(user.name, user.email, 'User');
      toast.success('Account created successfully!');

      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page page-wrapper">
      <div className="container">
        <Card className="register-card">
          <h2>Create Account</h2>
          <p className="register-subtitle">Join RentWheels today.</p>
          <form onSubmit={handleSubmit}>
            <Input
              label="Full Name"
              type="text"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <Input
              label="Email"
              type="email"
              name="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <Input
              label="Phone Number"
              type="tel"
              name="phone"
              placeholder="+1 234 567 8900"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <div className="form-row">
              <div className="half">
                <Input
                  label="Password"
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="half">
                <Input
                  label="Confirm"
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <Button type="submit" variant="primary" isFullWidth disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
          <div className="register-footer">
            <p>Already have an account? <Link to="/login">Sign in</Link></p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Register;
