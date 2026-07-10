import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import CustomerDashboard from './pages/CustomerDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import Profile from './pages/Profile';
import ExploreVehicles from './pages/ExploreVehicles';
import VehicleDetails from './pages/VehicleDetails';
import MyVehicles from './pages/MyVehicles';
import AddVehicle from './pages/AddVehicle';
import EditVehicle from './pages/EditVehicle';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Toaster position="top-right" />
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/explore" element={<ExploreVehicles />} />
            <Route path="/vehicle/:id" element={<VehicleDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route 
              path="/customer-dashboard" 
              element={
                <ProtectedRoute allowedRoles={['Customer']}>
                  <CustomerDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/owner-dashboard" 
              element={
                <ProtectedRoute allowedRoles={['Owner']}>
                  <OwnerDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/my-vehicles" 
              element={
                <ProtectedRoute allowedRoles={['Owner']}>
                  <MyVehicles />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/add-vehicle" 
              element={
                <ProtectedRoute allowedRoles={['Owner']}>
                  <AddVehicle />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/edit-vehicle/:id" 
              element={
                <ProtectedRoute allowedRoles={['Owner']}>
                  <EditVehicle />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
