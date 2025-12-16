import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

/**
 * Upload a file to Firebase Storage
 * @param {File} file - The file to upload
 * @param {string} path - The storage path (e.g., 'orders/user123/file.pdf')
 * @returns {Promise<{url: string, name: string, size: number, type: string}>}
 */
export async function uploadFile(file, path) {
  try {
    const storageRef = ref(storage, path);
    
    // Upload file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return {
      url: downloadURL,
      name: file.name,
      size: file.size,
      type: file.type,
      path: snapshot.ref.fullPath
    };
  } catch (error) {
    console.error('File upload error:', error);
    throw new Error(`Failed to upload ${file.name}: ${error.message}`);
  }
}

/**
 * Upload multiple files to Firebase Storage
 * @param {File[]} files - Array of files to upload
 * @param {string} basePath - Base storage path (e.g., 'orders/order123')
 * @returns {Promise<Array<{url: string, name: string, size: number, type: string}>>}
 */
export async function uploadMultipleFiles(files, basePath) {
  const uploadPromises = files.map((file, index) => {
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `${basePath}/${fileName}`;
    return uploadFile(file, filePath);
  });
  
  return Promise.all(uploadPromises);
}

/**
 * Format file size for display
 * @param {number} bytes
 * @returns {string}
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}