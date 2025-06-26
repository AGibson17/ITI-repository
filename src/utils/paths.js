// Utility to get the correct asset path
export const getAssetPath = (path) => {
  const baseUrl = import.meta.env.BASE_URL || '/';
  // Remove leading slash from path if it exists
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${baseUrl}${cleanPath}`;
};

// Specific helper for CA images
export const getCAImagePath = (imageName) => {
  return getAssetPath(`images/CA/${imageName}`);
};
