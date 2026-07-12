const User = require('../models/User');

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.phone = req.body.phone || user.phone;
      if (req.body.profileImage !== undefined) {
        user.profileImage = req.body.profileImage;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        profileImage: updatedUser.profileImage,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const changePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      const isMatch = await user.matchPassword(req.body.oldPassword);
      if (!isMatch) {
        return res.status(400).json({ message: 'Incorrect old password' });
      }

      user.password = req.body.newPassword;
      await user.save();
      res.json({ message: 'Password updated successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { updateUserProfile, changePassword };
