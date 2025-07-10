/**
 * SST Location Data Loader
 * Extracts unique SST locations from transaction data for dropdown population
 */

import { getAssetPath } from './paths';
import { getStateConfig } from '../config/stateConfig';

/**
 * Load and extract unique SST locations for a state from transaction data
 * @param {string} stateCode - Two-letter state code (e.g., 'CA', 'NV', 'IN')
 * @returns {Promise<Array>} Array of unique SST location objects
 */
export const loadSSTLocations = async (stateCode) => {
  const stateConfig = getStateConfig(stateCode);
  
  if (!stateConfig) {
    throw new Error(`State configuration not found for: ${stateCode}`);
  }
  
  if (!stateConfig.isActive) {
    throw new Error(`State ${stateCode} is not currently active`);
  }

  try {
    const dataFiles = stateConfig.dataFiles;
    const promises = [];
    const fileNames = [];

    // Main scenarios (required)
    promises.push(fetch(getAssetPath(dataFiles.mainScenarios)));
    fileNames.push('mainScenarios');

    // Auxiliary scenarios (optional)
    if (stateConfig.features.hasAuxiliaryData && dataFiles.auxScenarios) {
      promises.push(fetch(getAssetPath(dataFiles.auxScenarios)));
      fileNames.push('auxScenarios');
    }

    // Historical transactions (optional)
    if (stateConfig.features.hasHistoricalData && dataFiles.historicalTransactions) {
      promises.push(fetch(getAssetPath(dataFiles.historicalTransactions)));
      fileNames.push('historicalTransactions');
    }

    const responses = await Promise.all(promises);
    
    // Check all responses
    for (let i = 0; i < responses.length; i++) {
      if (!responses[i].ok) {
        throw new Error(`Failed to load ${fileNames[i]} for ${stateCode}: ${responses[i].status}`);
      }
    }

    const dataArrays = await Promise.all(responses.map(response => response.json()));
    
    let mainData = [];
    let auxData = [];
    let historicalData = [];
    
    // Parse responses based on what we loaded
    let dataIndex = 0;
    mainData = dataArrays[dataIndex++];
    
    if (stateConfig.features.hasAuxiliaryData && dataFiles.auxScenarios) {
      auxData = dataArrays[dataIndex++];
    }
    
    if (stateConfig.features.hasHistoricalData && dataFiles.historicalTransactions) {
      historicalData = dataArrays[dataIndex++];
    }

    // Combine all datasets
    const allData = [...mainData, ...auxData, ...historicalData];
    
    // Extract unique SST locations
    const sstLocationsSet = new Set();
    
    allData.forEach(record => {
      let sstLocation = null;
      
      // For scenario data, SST is in TransactionDetail
      if (record.TransactionDetail && record.TransactionDetail.SST) {
        sstLocation = record.TransactionDetail.SST;
      }
      // For historical data, SST is directly on the record
      else if (record.SST) {
        sstLocation = record.SST;
      }
      
      if (sstLocation && sstLocation.trim() !== '') {
        sstLocationsSet.add(sstLocation.trim());
      }
    });

    // Convert Set to Array and sort alphabetically
    const uniqueLocations = Array.from(sstLocationsSet).sort();
    
    // Convert to objects with value and label for better dropdown handling
    const locationObjects = uniqueLocations.map(location => ({
      value: location,
      label: location,
      isActive: true, // All extracted locations are considered active
      // Extract store chain and location for potential grouping
      chain: location.split(' ')[0], // e.g., "Albertsons", "Raleys", "Smiths"
      number: location.match(/- (\d+)$/)?.[1] || '' // Extract location number
    }));

    console.log(`Loaded ${locationObjects.length} unique SST locations for ${stateCode}:`, locationObjects);

    return locationObjects;

  } catch (error) {
    console.error(`Error loading SST locations for ${stateCode}:`, error);
    throw error;
  }
};

/**
 * Get formatted SST location options for dropdown
 * @param {string} stateCode - Two-letter state code
 * @returns {Promise<Array>} Array of {value, label} objects for dropdown
 */
export const getSSTLocationOptions = async (stateCode) => {
  try {
    const locations = await loadSSTLocations(stateCode);
    
    // Create dropdown options
    const options = [
      { value: '<ALL>', label: '<ALL>' }, // Default "all locations" option
      ...locations.map(location => ({
        value: location.value,
        label: location.label
      }))
    ];
    
    return options;
    
  } catch (error) {
    console.error(`Error creating SST location options for ${stateCode}:`, error);
    // Return just the default option if loading fails
    return [{ value: '<ALL>', label: '<ALL>' }];
  }
};

/**
 * Get grouped SST locations by store chain
 * @param {Array} locations - Array of location objects from loadSSTLocations
 * @returns {Object} Object with store chains as keys and locations as values
 */
export const groupLocationsByChain = (locations) => {
  const grouped = {};
  
  locations.forEach(location => {
    const chain = location.chain;
    if (!grouped[chain]) {
      grouped[chain] = [];
    }
    grouped[chain].push(location);
  });
  
  // Sort locations within each chain
  Object.keys(grouped).forEach(chain => {
    grouped[chain].sort((a, b) => a.label.localeCompare(b.label));
  });
  
  return grouped;
};

/**
 * Get SST location details by value
 * @param {string} stateCode - Two-letter state code
 * @param {string} locationValue - SST location value/name
 * @returns {Promise<Object|null>} SST location object or null if not found
 */
export const getSSTLocationByValue = async (stateCode, locationValue) => {
  try {
    const locations = await loadSSTLocations(stateCode);
    return locations.find(location => location.value === locationValue) || null;
  } catch (error) {
    console.error(`Error getting SST location ${locationValue} for ${stateCode}:`, error);
    return null;
  }
};

/**
 * Validate if an SST location exists and is active
 * @param {string} stateCode - Two-letter state code
 * @param {string} locationValue - SST location value/name
 * @returns {Promise<boolean>} True if location exists and is active
 */
export const isValidSSTLocation = async (stateCode, locationValue) => {
  if (locationValue === '<ALL>') {
    return true; // Always allow "all locations"
  }
  
  try {
    const location = await getSSTLocationByValue(stateCode, locationValue);
    return location !== null && location.isActive;
  } catch (error) {
    console.error(`Error validating SST location ${locationValue} for ${stateCode}:`, error);
    return false;
  }
};
