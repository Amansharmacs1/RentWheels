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

    const activeBookings = await Booking.countDocuments({ bookingStatus: 'Active' });
    const completedBookings = await Booking.countDocuments({ bookingStatus: 'Completed' });

    // Estimate Revenue (sum of grandTotal of completed bookings)
    const revenueData = await Booking.aggregate([
      { $match: { bookingStatus: 'Completed' } },
      { $group: { _id: null, totalRevenue: { $sum: '$grandTotal' } } }
    ]);
    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const monthlyData = await Booking.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
          bookings: { $sum: 1 },
          revenue: { $sum: { $cond: [{ $eq: ["$bookingStatus", "Completed"] }, "$grandTotal", 0] } }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const formattedMonthlyData = monthlyData.map(data => {
      const date = new Date(data._id.year, data._id.month - 1);
      return {
        name: date.toLocaleString('default', { month: 'short' }),
        bookings: data.bookings,
        revenue: data.revenue
      };
    });

    res.json({
      users: { total: totalUsers, customers, owners },
      vehicles: { total: totalVehicles, verified: verifiedVehicles, pending: pendingVehicles },
      bookings: { active: activeBookings, completed: completedBookings },
      revenue: totalRevenue,
      monthlyData: formattedMonthlyData
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Users Management
const getUsers = async (req, res) => {
  try {
    const { role, search, page = 1, limit = 10 } = req.query;
    let query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    res.json({
      users,
      page: pageNumber,
      pages: Math.ceil(total / limitNumber),
      total
    });
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
    const { status, search, page = 1, limit = 10 } = req.query;
    let query = {};
    if (status) query.verificationStatus = status;
    if (search) {
      query.$or = [
        { brand: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } },
        { registrationNumber: { $regex: search, $options: 'i' } }
      ];
    }
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    const total = await Vehicle.countDocuments(query);
    const vehicles = await Vehicle.find(query)
      .populate('owner', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    res.json({
      vehicles,
      page: pageNumber,
      pages: Math.ceil(total / limitNumber),
      total
    });
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
    const { status, page = 1, limit = 10 } = req.query;
    let query = {};
    if (status) query.bookingStatus = status;
    
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    const total = await Booking.countDocuments(query);
    const bookings = await Booking.find(query)
      .populate('customer', 'name email')
      .populate('owner', 'name email')
      .populate('vehicle', 'brand model type')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);
      
    res.json({
      bookings,
      page: pageNumber,
      pages: Math.ceil(total / limitNumber),
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const { parse } = require('json2csv');

const exportReportsCSV = async (req, res) => {
  try {
    const { type } = req.params;
    let data = [];
    let fields = [];

    if (type === 'users') {
      const users = await User.find({}).lean();
      data = users;
      fields = ['name', 'email', 'phone', 'role', 'accountStatus', 'createdAt'];
    } else if (type === 'vehicles') {
      const vehicles = await Vehicle.find({}).populate('owner', 'name').lean();
      data = vehicles.map(v => ({ ...v, ownerName: v.owner ? v.owner.name : 'Unknown' }));
      fields = ['brand', 'model', 'type', 'pricePerDay', 'verificationStatus', 'ownerName'];
    } else if (type === 'bookings') {
      const bookings = await Booking.find({}).populate('customer', 'name').populate('vehicle', 'brand model').lean();
      data = bookings.map(b => ({
        ...b,
        customerName: b.customer ? b.customer.name : 'Unknown',
        vehicleDetails: b.vehicle ? `${b.vehicle.brand} ${b.vehicle.model}` : 'Unknown'
      }));
      fields = ['customerName', 'vehicleDetails', 'pickupDate', 'returnDate', 'grandTotal', 'bookingStatus'];
    } else {
      return res.status(400).json({ message: 'Invalid report type' });
    }

    const csv = parse(data, { fields });
    res.header('Content-Type', 'text/csv');
    res.attachment(`${type}_report.csv`);
    return res.send(csv);
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
  getBookings,
  exportReportsCSV
};
