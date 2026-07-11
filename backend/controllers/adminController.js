const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const Booking = require('../models/Booking');

// Get Dashboard Stats
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const customers = await User.countDocuments({ role: 'Customer' });
    const owners = await User.countDocuments({ role: 'Owner' });
    
    const totalVehicles = await Vehicle.countDocuments();
    const verifiedVehicles = await Vehicle.countDocuments({ verificationStatus: 'Verified' });
    const pendingVehicles = await Vehicle.countDocuments({ verificationStatus: 'Pending' });

    const activeBookings = await Booking.countDocuments({ status: 'Active' });
    const completedBookings = await Booking.countDocuments({ status: 'Completed' });

    // Estimate Revenue (sum of grandTotal of completed bookings)
    const revenueData = await Booking.aggregate([
      { $match: { status: 'Completed' } },
      { $group: { _id: null, totalRevenue: { $sum: '$grandTotal' } } }
    ]);
    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    // Optional: Get chart data (group by month, etc.)
    // For simplicity, we just return the aggregates
    res.json({
      users: { total: totalUsers, customers, owners },
      vehicles: { total: totalVehicles, verified: verifiedVehicles, pending: pendingVehicles },
      bookings: { active: activeBookings, completed: completedBookings },
      revenue: totalRevenue
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Users Management
const getUsers = async (req, res) => {
  try {
    const { role, search } = req.query;
    let query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    const users = await User.find(query).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Active', 'Suspended'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    user.accountStatus = status;
    await user.save();
    res.json({ message: `User status updated to ${status}`, user });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Vehicle Management
const getVehicles = async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = {};
    if (status) query.verificationStatus = status;
    if (search) {
      query.$or = [
        { brand: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } },
        { registrationNumber: { $regex: search, $options: 'i' } }
      ];
    }
    const vehicles = await Vehicle.find(query).populate('owner', 'name email').sort({ createdAt: -1 });
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const verifyVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

    vehicle.verificationStatus = 'Verified';
    vehicle.verifiedBy = req.user._id;
    vehicle.verifiedAt = Date.now();
    await vehicle.save();
    
    // Need to populate owner for email sending
    await vehicle.populate('owner', 'name email');
    res.json({ message: 'Vehicle verified successfully', vehicle });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const rejectVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

    vehicle.verificationStatus = 'Rejected';
    vehicle.verifiedBy = req.user._id;
    vehicle.verifiedAt = Date.now();
    await vehicle.save();
    
    await vehicle.populate('owner', 'name email');
    res.json({ message: 'Vehicle rejected', vehicle });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Bookings Management
const getBookings = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    if (status) query.status = status;
    
    const bookings = await Booking.find(query)
      .populate('customer', 'name email')
      .populate('owner', 'name email')
      .populate('vehicle', 'brand model type')
      .sort({ createdAt: -1 });
      
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getDashboardStats,
  getUsers,
  updateUserStatus,
  getVehicles,
  verifyVehicle,
  rejectVehicle,
  getBookings
};
