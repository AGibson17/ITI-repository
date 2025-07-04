/**
 * Vehicle Data Schema Utilities
 * Handles dynamic vehicle data rendering based on state configurations
 */

/**
 * Get vehicle data fields based on state configuration
 * @param {Object} stateConfig - State configuration object
 * @returns {Array} Array of field definitions
 */
export const getVehicleDataFields = (stateConfig) => {
  // Default fields if no schema is defined
  const defaultFields = [
    { key: 'Plate', label: 'Plate', type: 'string', required: true },
    { key: 'Expires', label: 'Expires', type: 'date', required: true },
    { key: 'VIN', label: 'VIN', type: 'string', required: true },
    { key: 'Vehicle', label: 'Vehicle', type: 'string', required: true },
    { key: 'Owner', label: 'Owner', type: 'string', required: true },
    { key: 'Fees', label: 'Fees', type: 'currency', required: true },
    { key: 'Contact Info', label: 'Contact Info', type: 'string', required: true },
    { key: 'Renew Type', label: 'Renew Type', type: 'string', required: true }
  ];

  return stateConfig?.vehicleDataSchema?.fields || defaultFields;
};

/**
 * Get all fields (required + optional) for a state
 * @param {Object} stateConfig - State configuration object
 * @returns {Array} Combined array of all field definitions
 */
export const getAllVehicleDataFields = (stateConfig) => {
  const requiredFields = getVehicleDataFields(stateConfig);
  const optionalFields = stateConfig?.vehicleDataSchema?.optionalFields || [];
  
  return [...requiredFields, ...optionalFields];
};

/**
 * Get fields that are actually present in the vehicle data
 * @param {Object} vehicleData - Single vehicle data object
 * @param {Object} stateConfig - State configuration object
 * @returns {Array} Array of field definitions for fields present in data
 */
export const getAvailableVehicleDataFields = (vehicleData, stateConfig) => {
  const allFields = getAllVehicleDataFields(stateConfig);
  
  return allFields.filter(field => {
    return Object.prototype.hasOwnProperty.call(vehicleData, field.key) && 
           vehicleData[field.key] !== null && 
           vehicleData[field.key] !== undefined &&
           vehicleData[field.key] !== '';
  });
};

/**
 * Format vehicle data value based on field type
 * @param {any} value - The value to format
 * @param {string} type - The field type (string, date, currency, boolean)
 * @returns {string} Formatted value
 */
export const formatVehicleDataValue = (value, type) => {
  if (value === null || value === undefined || value === '') {
    return '';
  }

  switch (type) {
    case 'date':
      // Handle date formatting
      if (value === '1/1/1990') {
        return 'N/A';
      }
      return value;
    
    case 'currency':
      // Currency values should already be formatted, just return as-is
      return value;
    
    case 'boolean':
      // Convert Y/N to Yes/No
      if (value === 'Y' || value === 'yes' || value === true) {
        return 'Yes';
      }
      if (value === 'N' || value === 'no' || value === false) {
        return 'No';
      }
      return value;
    
    case 'string':
    default:
      return value;
  }
};

/**
 * Render vehicle data table headers based on state configuration
 * @param {Object} stateConfig - State configuration object
 * @param {Array} vehicleDataArray - Array of vehicle data objects
 * @returns {Array} Array of header objects with key and label
 */
export const getVehicleTableHeaders = (stateConfig, vehicleDataArray) => {
  if (!vehicleDataArray || vehicleDataArray.length === 0) {
    return getVehicleDataFields(stateConfig);
  }

  // Get fields that are available in at least one vehicle record
  const allFields = getAllVehicleDataFields(stateConfig);
  const availableFields = allFields.filter(field => {
    return vehicleDataArray.some(vehicle => 
      Object.prototype.hasOwnProperty.call(vehicle, field.key) && 
      vehicle[field.key] !== null && 
      vehicle[field.key] !== undefined &&
      vehicle[field.key] !== ''
    );
  });

  return availableFields;
};

/**
 * Create a default vehicle entry for incomplete transactions
 * @param {string} plateNumber - Plate number extracted from request info
 * @param {Object} stateConfig - State configuration object
 * @returns {Object} Default vehicle data object
 */
export const createDefaultVehicleEntry = (plateNumber, stateConfig) => {
  const fields = getVehicleDataFields(stateConfig);
  const defaultEntry = {};

  // Set default values for all required fields
  fields.forEach(field => {
    if (field.required) {
      switch (field.key) {
        case 'Plate':
          defaultEntry[field.key] = plateNumber || '';
          break;
        case 'Expires':
          defaultEntry[field.key] = '1/1/1990';
          break;
        case 'VIN':
          defaultEntry[field.key] = '';
          break;
        case 'Vehicle':
          defaultEntry[field.key] = '0';
          break;
        case 'Owner':
          defaultEntry[field.key] = '';
          break;
        case 'Fees':
          defaultEntry[field.key] = '$0.00';
          break;
        case 'Contact Info':
          defaultEntry[field.key] = '';
          break;
        case 'Renew Type':
          defaultEntry[field.key] = 'NotDefined';
          break;
        default:
          // For other fields, set appropriate defaults based on type
          switch (field.type) {
            case 'currency':
              defaultEntry[field.key] = '$0.00';
              break;
            case 'date':
              defaultEntry[field.key] = '1/1/1990';
              break;
            case 'boolean':
              defaultEntry[field.key] = 'N';
              break;
            default:
              defaultEntry[field.key] = '';
          }
      }
    }
  });

  return defaultEntry;
};
