/**
 * Utility functions for handling book images
 */

/**
 * Generates a default book cover image as an SVG data URL
 * @returns {string} Base64 encoded SVG data URL
 */
export const getDefaultBookImage = () => {
  // Create a simple, clean SVG book icon
  const svg = `
    <svg width="200" height="300" viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="300" fill="#f8f9fa" stroke="#e9ecef" stroke-width="2"/>
      <rect x="40" y="60" width="120" height="180" fill="#ffffff" stroke="#dee2e6" stroke-width="1"/>
      <rect x="50" y="80" width="100" height="8" fill="#6c757d" rx="2"/>
      <rect x="50" y="100" width="80" height="6" fill="#adb5bd" rx="1"/>
      <rect x="50" y="115" width="90" height="6" fill="#adb5bd" rx="1"/>
      <rect x="50" y="130" width="70" height="6" fill="#adb5bd" rx="1"/>
      <rect x="50" y="145" width="85" height="6" fill="#adb5bd" rx="1"/>
      <rect x="50" y="160" width="75" height="6" fill="#adb5bd" rx="1"/>
      <rect x="50" y="175" width="95" height="6" fill="#adb5bd" rx="1"/>
      <rect x="50" y="190" width="65" height="6" fill="#adb5bd" rx="1"/>
      <rect x="50" y="205" width="88" height="6" fill="#adb5bd" rx="1"/>
      <text x="100" y="250" text-anchor="middle" fill="#6c757d" font-family="Arial, sans-serif" font-size="14" font-weight="500">Book Cover</text>
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

/**
 * Handles image loading errors by setting a fallback image
 * @param {Event} e - The error event from the image element
 * @param {string} fallbackSrc - The fallback image source (optional)
 */
export const handleImageError = (e, fallbackSrc = null) => {
  e.target.src = fallbackSrc || getDefaultBookImage();
};

/**
 * Compresses an image file to reduce its size
 * @param {File} file - The image file to compress
 * @param {number} maxWidth - Maximum width in pixels (default: 800)
 * @param {number} quality - Compression quality 0-1 (default: 0.7)
 * @returns {Promise<string>} Base64 encoded compressed image
 */
export const compressImage = (file, maxWidth = 800, quality = 0.7) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      
      // If the base64 string is very large, reduce quality
      if (base64String.length > 500000) {
        const img = new Image();
        img.src = base64String;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Calculate new dimensions
          const ratio = Math.min(maxWidth / img.width, 1);
          canvas.width = img.width * ratio;
          canvas.height = img.height * ratio;
          
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          // Convert to base64 with reduced quality
          const compressedImage = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedImage);
        };
        img.onerror = () => reject(new Error('Failed to load image'));
      } else {
        resolve(base64String);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

/**
 * Validates image file size and type
 * @param {File} file - The file to validate
 * @param {number} maxSizeMB - Maximum size in MB (default: 2)
 * @returns {Object} Validation result with isValid and message
 */
export const validateImageFile = (file, maxSizeMB = 2) => {
  const maxSize = maxSizeMB * 1024 * 1024; // Convert to bytes
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (!file) {
    return { isValid: false, message: 'No file selected' };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, message: 'Invalid file type. Please select JPG, PNG, GIF, or WebP image.' };
  }
  
  if (file.size > maxSize) {
    return { 
      isValid: false, 
      message: `Image file is too large! Maximum allowed size is ${maxSizeMB}MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB` 
    };
  }
  
  return { isValid: true, message: 'Valid image file' };
};
