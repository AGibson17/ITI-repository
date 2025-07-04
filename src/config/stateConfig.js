/**
 * State Configuration System
 * Centralized configuration for multi-state support
 */

export const STATE_CONFIGS = {
  CA: {
    code: 'CA',
    name: 'California',
    fullName: 'California',
    isActive: true,
    colors: {
      primary: '#37A7E0',      // Blue header
      secondary: '#17456D',    // Form elements
      accent: '#c00',          // Red bar
      text: '#26608F',
      background: '#ffffff'
    },
    terminology: {
      sst: 'SST',
      transaction: 'Transaction',
      vehicle: 'Vehicle',
      renewal: 'Renewal',
      plate: 'Plate',
      vin: 'VIN',
      department: 'DMV'
    },
    assets: {
      dashboardHeaderImage: 'images/CA/header-short.png', // Dashboard-specific header
      pageHeaderImage: 'images/CA/text.png',              // Page headers with colored background
      logoPath: 'images/CA/',
      welcomeImage: 'images/CA/welcome.png',
      adminImage: 'images/CA/admin.png',
      documentsImage: 'images/CA/documents.png',
      findTransactionsImage: 'images/CA/find-transactions.png',
      viewReportsImage: 'images/CA/view-reports.png'
    },
    dataFiles: {
      mainScenarios: 'TransData/CA/CA_Main_Scenarios.json',
      auxScenarios: 'TransData/CA/NIRD_Scenarios.json', // CA uses NIRD data as auxiliary
      historicalTransactions: 'TransData/CA/Historical_Transactions.json'
    },
    features: {
      hasAuxiliaryData: true, // CA has NIRD auxiliary data
      hasHistoricalData: true,
      hasVIPSearch: true,
      hasDLNSearch: false
    }
  },
  
  CO: {
    code: 'CO',
    name: 'Colorado',
    fullName: 'Colorado',
    isActive: false, // Will be activated when data is ready
    colors: {
      primary: '#1e4a6b',      // Different blue
      secondary: '#2563eb',
      accent: '#c00',          // Shared red bar
      text: '#000',
      background: '#ffffff'
    },
    terminology: {
      sst: 'SST',           // Different terminology
      transaction: 'Transaction',
      vehicle: 'Vehicle',
      renewal: 'Renewal',
      plate: 'License Plate',
      vin: 'VIN',
      department: 'Motor Vehicle'
    },
    assets: {
      dashboardHeaderImage: 'images/CO/header-short.png', // Dashboard-specific header
      pageHeaderImage: 'images/CO/text.png',              // Page headers with colored background
      logoPath: 'images/CO/',
      welcomeImage: 'images/CO/welcome.png',
      adminImage: 'images/CO/admin.png',
      documentsImage: 'images/CO/documents.png',
      findTransactionsImage: 'images/CO/find-transactions.png',
      viewReportsImage: 'images/CO/view-reports.png'
    },
    dataFiles: {
      mainScenarios: 'TransData/CO/CO_Main_Scenarios.json',
      auxScenarios: 'TransData/CO/auxiliary_transData.json', // CO auxiliary data
      historicalTransactions: 'TransData/CO/Historical_Transactions.json'
    },
    features: {
      hasAuxiliaryData: true, // CO has auxiliary transaction data
      hasHistoricalData: true,
      hasVIPSearch: true,
      hasDLNSearch: true
    }
  },
  
  FL: {
    code: 'FL',
    name: 'Florida',
    fullName: 'Florida',
    isActive: false,
    colors: {
      primary: '#0066cc',
      secondary: '#0052a3',
      accent: '#c00',
      text: '#000',
      background: '#ffffff'
    },
    terminology: {
      sst: 'SST',
      transaction: 'Service',
      vehicle: 'Motor Vehicle',
      renewal: 'Renewal',
      plate: 'Tag',
      vin: 'VIN',
      department: 'Tax Collector'
    },
    assets: {
      dashboardHeaderImage: 'images/FL/header-short.png', // Dashboard-specific header
      pageHeaderImage: 'images/FL/text.png',              // Page headers with colored background
      logoPath: 'images/FL/',
      welcomeImage: 'images/FL/welcome.png',
      adminImage: 'images/FL/admin.png',
      documentsImage: 'images/FL/documents.png',
      findTransactionsImage: 'images/FL/find-transactions.png',
      viewReportsImage: 'images/FL/view-reports.png'
    },
    dataFiles: {
      mainScenarios: 'TransData/FL/FL_Main_Scenarios.json',
      auxScenarios: 'TransData/FL/auxiliary_transData.json', // FL auxiliary data
      historicalTransactions: 'TransData/FL/Historical_Transactions.json'
    },
    features: {
      hasAuxiliaryData: true, // FL has auxiliary transaction data
      hasHistoricalData: true,
      hasVIPSearch: false,
      hasDLNSearch: true
    }
  },
  
  MI: {
    code: 'MI',
    name: 'Michigan',
    fullName: 'Michigan',
    isActive: false,
    colors: {
      primary: '#003366',
      secondary: '#004488',
      accent: '#c00',
      text: '#000',
      background: '#ffffff'
    },
    terminology: {
      sst: 'SST',
      transaction: 'Transaction',
      vehicle: 'Vehicle',
      renewal: 'Renewal',
      plate: 'Plate',
      vin: 'VIN',
      department: 'Secretary of State'
    },
    assets: {
      dashboardHeaderImage: 'images/MI/header-short.png', // Dashboard-specific header
      pageHeaderImage: 'images/MI/text.png',              // Page headers with colored background
      logoPath: 'images/MI/',
      welcomeImage: 'images/MI/welcome.png',
      adminImage: 'images/MI/admin.png',
      documentsImage: 'images/MI/documents.png',
      findTransactionsImage: 'images/MI/find-transactions.png',
      viewReportsImage: 'images/MI/view-reports.png'
    },
    dataFiles: {
      mainScenarios: 'TransData/MI/MI_Main_Scenarios.json',
      auxScenarios: null,
      historicalTransactions: 'TransData/MI/Historical_Transactions.json'
    },
    features: {
      hasAuxiliaryData: false,
      hasHistoricalData: true,
      hasVIPSearch: true,
      hasDLNSearch: false
    }
  },
  
  HI: {
    code: 'HI',
    name: 'Hawaii',
    fullName: 'Hawaii',
    isActive: true,
    colors: {
      primary: '#0F6D97',
      secondary: '#17456D',
      accent: '#c00',
      text: '#007A97',
      background: '#ffffff'
    },
    terminology: {
      sst: 'SST',
      transaction: 'Transaction',
      vehicle: 'Vehicle',
      renewal: 'Renewal',
      plate: 'Plate',
      vin: 'VIN',
      department: 'DMV'
    },
    assets: {
      dashboardHeaderImage: 'images/HI/header-short.png', // Dashboard-specific header
      pageHeaderImage: 'images/HI/text.png',              // Page headers with colored background
      logoPath: 'images/HI/',
      welcomeImage: 'images/HI/welcome.png',
      adminImage: 'images/HI/admin.png',
      documentsImage: 'images/HI/documents.png',
      findTransactionsImage: 'images/HI/find-transactions.png',
      viewReportsImage: 'images/HI/view-reports.png'
    },
    dataFiles: {
      mainScenarios: 'TransData/HI/HI_Main_Scenarios.json',
      auxScenarios: null,
      historicalTransactions: 'TransData/HI/Historical_Transactions.json'
    },
    features: {
      hasAuxiliaryData: false,
      hasHistoricalData: true,
      hasVIPSearch: true,
      hasDLNSearch: false
    }
  }
};

/**
 * Get configuration for a specific state
 * @param {string} stateCode - Two-letter state code
 * @returns {Object} State configuration object
 */
export const getStateConfig = (stateCode) => {
  return STATE_CONFIGS[stateCode?.toUpperCase()] || null;
};

/**
 * Get all active states
 * @returns {Array} Array of active state configurations
 */
export const getActiveStates = () => {
  return Object.values(STATE_CONFIGS).filter(state => state.isActive);
};

/**
 * Get all available states (active and inactive)
 * @returns {Array} Array of all state configurations
 */
export const getAllStates = () => {
  return Object.values(STATE_CONFIGS);
};

/**
 * Check if a state is active
 * @param {string} stateCode - Two-letter state code
 * @returns {boolean} True if state is active
 */
export const isStateActive = (stateCode) => {
  const config = getStateConfig(stateCode);
  return config ? config.isActive : false;
};

/**
 * Activate a state (used when adding new state support)
 * @param {string} stateCode - Two-letter state code
 */
export const activateState = (stateCode) => {
  const config = getStateConfig(stateCode);
  if (config) {
    config.isActive = true;
  }
};
