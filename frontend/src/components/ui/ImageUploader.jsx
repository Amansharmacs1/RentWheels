import React, { useRef, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { X, Star, ImagePlus, GripVertical } from 'lucide-react';
import './ImageUploader.css';

const ImageUploader = ({ existingImages = [], onImagesChange, featuredImage, onFeaturedChange }) => {
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
    files.forEach(file => formData.append('images', file));

    setIsUploading(true);
    const uploadToastId = toast.loading('Uploading images...');

    try {
      const response = await api.post('/upload', formData);
      const newImages = [...images, ...response.data.urls];
      setImages(newImages);
      onImagesChange(newImages);
      if (!featuredImage && newImages.length > 0) {
        onFeaturedChange(newImages[0]);
      }
      toast.success('Images uploaded successfully', { id: uploadToastId });
    } catch (error) {
      toast.error('Image upload failed', { id: uploadToastId });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (indexToRemove) => {
    const newImages = images.filter((_, index) => index !== indexToRemove);
    setImages(newImages);
    onImagesChange(newImages);
    if (images[indexToRemove] === featuredImage) {
      onFeaturedChange(newImages[0] || '');
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(images);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setImages(items);
    onImagesChange(items);
  };

  return (
    <div className="image-uploader">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="images" direction="horizontal">
          {(provided) => (
            <div 
              className="image-preview-grid" 
              {...provided.droppableProps} 
              ref={provided.innerRef}
            >
              {images.map((url, index) => (
                <Draggable key={url} draggableId={url} index={index}>
                  {(provided, snapshot) => (
                    <div 
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`image-preview-item ${snapshot.isDragging ? 'dragging' : ''} ${featuredImage === url ? 'featured' : ''}`}
                    >
                      <div className="drag-handle" {...provided.dragHandleProps}>
                        <GripVertical size={16} />
                      </div>
                      <img src={url} alt={`Preview ${index + 1}`} />
                      
                      <div className="image-actions">
                        <button 
                          type="button"
                          className={`icon-btn star-btn ${featuredImage === url ? 'active' : ''}`}
                          onClick={() => onFeaturedChange(url)}
                          title="Set as featured"
                        >
                          <Star size={16} fill={featuredImage === url ? 'currentColor' : 'none'} />
                        </button>
                        <button 
                          type="button" 
                          className="icon-btn remove-btn"
                          onClick={() => removeImage(index)}
                          title="Remove image"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      {featuredImage === url && <div className="featured-badge">Featured</div>}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              
              {images.length < 5 && (
                <div className="upload-placeholder" onClick={() => fileInputRef.current?.click()}>
                  <ImagePlus size={32} color="var(--primary-color)" style={{ marginBottom: '0.5rem' }} />
                  <p>Add Image</p>
                  <p className="upload-limit">({images.length}/5)</p>
                </div>
              )}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      
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
