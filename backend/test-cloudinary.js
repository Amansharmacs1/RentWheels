require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

cloudinary.uploader.upload('../frontend/public/favicon.jpg', { folder: 'rentwheels_test' })
  .then(result => console.log('Upload Success:', result.secure_url))
  .catch(err => console.error('Upload Error:', err));
