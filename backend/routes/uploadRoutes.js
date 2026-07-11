const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, (req, res) => {
  upload.array('images', 5)(req, res, function (err) {
    if (err) {
      console.error('Multer/Cloudinary Error:', err);
      return res.status(500).json({ message: 'Image upload failed on server', error: err.message || err });
    }
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const urls = req.files.map(file => `http://localhost:5001/uploads/${file.filename}`);

    res.json({
      message: 'Images uploaded successfully',
      urls: urls,
    });
  });
});

module.exports = router;
