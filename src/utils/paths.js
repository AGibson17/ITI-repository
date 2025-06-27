// Utility to get the correct asset path
export const getAssetPath = (path) => {
  const baseUrl = import.meta.env.BASE_URL || '/';
  // Remove leading slash from path if it exists
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${baseUrl}${cleanPath}`;
};

// Helper for global images (common across all states)
export const getGlobalImagePath = (imageName) => {
  return getAssetPath(`images/${imageName}`);
};

// Specific helper for CA images
export const getCAImagePath = (imageName) => {
  return getAssetPath(`images/CA/${imageName}`);
};

export const getSelectorPath = (imageName) => {
  return getAssetPath(`images/state-selector/${imageName}`);
};

// Get state flag for selector (uses full state name)
export const getStateFlagPath = (stateName) => {
  return getAssetPath(`images/State_Flags/${stateName}.svg`);
};

// Get state-specific image using state code
export const getStateImagePath = (stateCode, imageName) => {
  return getAssetPath(`images/${stateCode}/${imageName}`);
};
