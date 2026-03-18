/**
 * Utility functions for faculty data
 */

/**
 * Convert Google Drive URL to direct image URL
 * @param {string} url - Google Drive URL
 * @returns {string} - Direct image URL or placeholder
 */
export const convertGoogleDriveUrl = (url) => {
  if (!url) return 'https://via.placeholder.com/150?text=No+Image';
  
  // Handle Google Drive URLs
  const driveMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (driveMatch) {
    return `https://drive.google.com/uc?export=view&id=${driveMatch[1]}`;
  }
  
  // If it's already a direct URL or other format
  return url;
};
