import { Cloudinary } from '@cloudinary/url-gen';
import axios from 'axios';

// Initialize Cloudinary instance
const cloudinary = new Cloudinary({ cloud: { cloudName: 'df9gkjxm8' } });

// Utility function to upload a file to Cloudinary
export const uploadToCloudinary = async (file, onProgress) => {
  const cloudinaryUrl = `https://api.cloudinary.com/v1_1/df9gkjxm8/upload`;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', 'profile'); // Specify the folder here
  formData.append('upload_preset', 'profile') 

  try {
    const response = await axios.post(cloudinaryUrl, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percentCompleted);
      },
    });

    const data = response.data;

    if (!data.secure_url || !data.public_id) {
      console.warn('Upload did not return secure_url or public_id');
    }

    return {
      secureUrl: data.secure_url,
      publicId: data.public_id,
      mimeType: file.type, // Add the MIME type to the response
      ...data, // Other metadata
    };
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};
