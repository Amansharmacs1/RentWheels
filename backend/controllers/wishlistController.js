const User = require('../models/User');

const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const addToWishlist = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const user = await User.findById(req.user._id);

    if (!user.wishlist.includes(vehicleId)) {
      user.wishlist.push(vehicleId);
      await user.save();
    }

    res.json({ message: 'Added to wishlist' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const user = await User.findById(req.user._id);

    user.wishlist = user.wishlist.filter(id => id.toString() !== vehicleId);
    await user.save();

    res.json({ message: 'Removed from wishlist' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist
};
