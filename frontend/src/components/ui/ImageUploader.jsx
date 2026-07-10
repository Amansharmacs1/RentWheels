import React, { useRef, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import Button from './Button';
import './ImageUploader.css';

const ImageUploader = ({ existingImages = [], onImagesChange }) => {
  const fileInputRef = useRef(null);
  const [images, setImages] = useState(existingImages);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    
    if (images.length + files.length > 5) {
      toast.error('You can upload a maximum of 5 images.');
      return;
    }

    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });

    setIsUploading(true);
    const uploadToastId = toast.loading('Uploading images...');

    try {
      const response = await api.post('/upload', formData);
      
      const newImages = [...images, ...response.data.urls];
      setImages(newImages);
      onImagesChange(newImages);
      toast.success('Images uploaded successfully', { id: uploadToastId });
    } catch (error) {
      toast.error('Image upload failed', { id: uploadToastId });
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (indexToRemove) => {
    const newImages = images.filter((_, index) => index !== indexToRemove);
    setImages(newImages);
    onImagesChange(newImages);
  };

  return (
    <div className="image-uploader">
      <div className="image-preview-grid">
        {images.map((url, index) => (
          <div key={index} className="image-preview-item">
            <img src={url} alt={`Preview ${index + 1}`} />
            <button 
              type="button" 
              className="remove-image-btn"
              onClick={() => removeImage(index)}
            >
              &times;
            </button>
          </div>
        ))}
        {images.length < 5 && (
          <div className="upload-placeholder" onClick={() => fileInputRef.current?.click()}>
            <div className="upload-icon">+</div>
            <p>Add Image</p>
            <p className="upload-limit">({images.length}/5)</p>
          </div>
        )}
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg, image/png, image/webp"
        multiple
        className="hidden-file-input"
        disabled={isUploading}
      />
    </div>
  );
};

export default ImageUploader;
