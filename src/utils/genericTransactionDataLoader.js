/**
 * Generic Transaction Data Loader
 * Supports multiple states with configurable data sources
 */

import { getAssetPath } from './paths';
import { getStateConfig } from '../config/stateConfig';

/**
 * Generate a random SST location for testing purposes
 * This randomly assigns transactions to SST locations for demo purposes
 * @param {string} stateCode - State code
 * @returns {string} Random SST location ID
 */
const generateRandomSSTLocation = (stateCode) => {
  // Define some test SST locations per state
  const sstLocations = {
    CA: ['SST001', 'SST002', 'SST003', 'SST004'],
    NV: ['NV001', 'NV002', 'NV003'],
    HI: ['HI001', 'HI002', 'HI003'],
    IN: ['IN001', 'IN002', 'IN003'],
    OH: ['OH001', 'OH002', 'OH003']
  };
  
  const locations = sstLocations[stateCode] || sstLocations.CA;
  return locations[Math.floor(Math.random() * locations.length)];
};

/**
 * Load and combine transaction data for any state
 * @param {string} stateCode - Two-letter state code (e.g., 'CA', 'CO', 'FL')
 * @returns {Promise<Array>} Combined and normalized transaction data
 */
export const loadStateTransactionData = async (stateCode) => {
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

    // Combine scenario datasets
    const allScenarios = [...mainData, ...auxData];

    // Normalize the scenario data
    const normalizedTransactions = allScenarios.map(scenario => {
      const detail = scenario.TransactionDetail;
      
      // Convert Payments object to array format if it exists
      let payments = [];
      if (detail.Payments && typeof detail.Payments === 'object' && !Array.isArray(detail.Payments)) {
        payments = [{
          PayID: detail.Payments.PayID || '',
          PayType: detail.Payments.PayType || '',
          CardType: detail.Payments.CardType || '',
          Last4: detail.Payments.Last4 || '',
          Amt: detail.Payments.Amt || '',
          PayStatus: detail.Payments.Status || '',
          Error: detail.Payments.Error || 'None',
          Conf: detail.Payments.Conf || '',
          ReprintReqdYN: detail.Payments.ReprintReqdYN || 'N',
          CashDetails: detail.Payments.CashDetails || null
        }];
      } else if (Array.isArray(detail.Payments)) {
        payments = detail.Payments;
      } else if (detail.Payments === "None" || !detail.Payments) {
        payments = [];
      }

      return {
        // Original scenario metadata
        ScenarioType: scenario.ScenarioType || '',
        Plate: scenario.Plate || '',
        TransactionNumber: scenario.TransactionNumber || '',
        IssueCategory: scenario.IssueCategory || '',
        IssueDetail: scenario.IssueDetail || '',
        Prompt: scenario.Prompt || '',
        IsClickable: true, // Live transactions are clickable
        StateCode: stateCode, // Add state identifier
        SSTLocation: scenario.SSTLocation || detail.SSTLocation || generateRandomSSTLocation(stateCode), // Add SST location
        
        // Normalized transaction details
        SST: detail.SST || '',
        TransStatus: detail.Status || '',
        Product: detail.Product || '',
        'SST Trans': detail['SST Trans'] || detail.TransactionNumber || scenario.TransactionNumber || '',
        Date: detail.Date || '',
        'Request Info': detail['Request Info'] || '',
        Grade: detail.Grade || '',
        Vehicles: detail.Vehicles || [],
        'Session Length': detail['Session Length'] || '',
        Payments: payments,
        CashDetails: detail.Payments && detail.Payments.CashDetails ? detail.Payments.CashDetails : null,
        'Last Form': detail['Last Form'] || '',
        Language: detail.Language || 'English',
        Errors: (() => {
          if (!detail.Errors || detail.Errors === 'None') {
            return 'None';
          }
          if (Array.isArray(detail.Errors)) {
            return detail.Errors.map(error => {
              // Handle error objects vs strings
              if (typeof error === 'object' && error !== null) {
                // Format as "TYPE CODE: MSG" (e.g., "AUTH ERR 999: TIMEOUT")
                const type = error.Type || '';
                const code = error.Code || '';
                const msg = error.Msg || '';
                return `${type} ${code}: ${msg}`.trim();
              }
              return error; // Already a string
            }).join('; ');
          }
          return detail.Errors; // Single string
        })()
      };
    });

    // Normalize historical data if available
    const normalizedHistoricalTransactions = historicalData.map(record => {
      return {
        // Historical metadata
        ScenarioType: record.ScenarioType || 'HistoricalTransaction',
        Plate: record.Plate || '',
        TransactionNumber: record.TransNo || record.TransactionNumber || '',
        IssueCategory: '',
        IssueDetail: '',
        Prompt: '',
        IsClickable: false, // Historical transactions are NOT clickable
        StateCode: stateCode, // Add state identifier
        
        // Normalized transaction details
        SST: record.SST || '',
        TransStatus: record.Status || '',
        Product: record.Product || '',
        'SST Trans': record.TransNo || record['SST Trans'] || '',
        Date: record.Date || '',
        'Request Info': record['Request Info'] || '',
        Grade: '',
        Vehicles: record.VIN ? [{
          Plate: record.Plate || '',
          VIN: record.VIN || '',
          Owner: record.Owner || '',
          Vehicle: record.Vehicle || '',
          Fees: record.Amt || ''
        }] : [],
        'Session Length': '',
        Payments: record.PayType ? [{
          PayType: record.PayType || '',
          Amt: record.Amt || '',
          PayStatus: record.Status === 'Completed' ? 'Approved' : 'Pending'
        }] : [],
        'Last Form': '',
        Language: 'English',
        Errors: record.Status === 'Incomplete' ? 'Transaction Incomplete' : 'None'
      };
    });

    // Combine all transaction data
    const allTransactions = [...normalizedTransactions, ...normalizedHistoricalTransactions];

    console.log(`Loaded ${allTransactions.length} transactions from ${stateCode} files:`, {
      mainScenarios: mainData.length,
      auxScenarios: auxData.length,
      historicalRecords: historicalData.length,
      total: allTransactions.length,
      state: stateCode
    });

    return allTransactions;

  } catch (error) {
    console.error(`Error loading ${stateCode} transaction data:`, error);
    throw error;
  }
};

/**
 * Load California transaction data (backward compatibility)
 * @returns {Promise<Array>} Combined and normalized CA transaction data
 */
export const loadCATransactionData = async () => {
  return loadStateTransactionData('CA');
};

/**
 * Search transactions by various criteria for any state
 * @param {Array} transactions - The transaction data array
 * @param {Object} searchCriteria - Search parameters
 * @param {string} stateCode - State code for state-specific features
 * @returns {Array} Filtered transactions
 */
export const searchTransactions = (transactions, searchCriteria, stateCode = 'CA') => {
  const stateConfig = getStateConfig(stateCode);
  const { 
    product = '<ALL>', 
    searchBy = 'sst-dates', 
    sstLocation = '<ALL>', // Add SST location parameter
    plateValue = '', 
    plateSearchType = 'Full', // Add plateSearchType parameter
    transValue = '', 
    vinValue = '', 
    vipValue = '', 
    dlnValue = '' 
  } = searchCriteria;

  return transactions.filter(transaction => {
    // First filter by product if not <ALL>
    if (product !== '<ALL>' && transaction.Product !== product) {
      return false;
    }

    // Filter by SST location if specified and not <ALL>
    if (sstLocation !== '<ALL>' && transaction.SSTLocation && transaction.SSTLocation !== sstLocation) {
      return false;
    }

    // Then filter by search type
    switch (searchBy) {
      case 'sst-dates': {
        return true;
      }
      
      case 'plate': {
        if (!plateValue.trim()) return false;
        const plateSearch = plateValue.trim().toUpperCase();
        
        // Handle Full vs Partial search
        if (plateSearchType === 'Full') {
          // Full search - exact match
          return transaction.Plate && transaction.Plate.toUpperCase() === plateSearch;
        } else {
          // Partial search - contains match
          return transaction.Plate && transaction.Plate.toUpperCase().includes(plateSearch);
        }
      }
      
      case 'trans-no': {
        if (!transValue.trim()) return false;
        const transSearch = transValue.trim();
        return (transaction['SST Trans'] && transaction['SST Trans'].includes(transSearch)) ||
               (transaction.TransactionNumber && transaction.TransactionNumber.includes(transSearch));
      }
      
      case 'vin': {
        if (!vinValue.trim()) return false;
        const vinSearch = vinValue.trim().toUpperCase();
        return transaction.Vehicles && transaction.Vehicles.some(vehicle => 
          vehicle.VIN && vehicle.VIN.toUpperCase().includes(vinSearch)
        );
      }
      
      case 'vip-plate': {
        if (!vipValue.trim()) return false;
        if (!stateConfig?.features.hasVIPSearch) return false; // State doesn't support VIP search
        
        const vipSearch = vipValue.trim().toUpperCase();
        const plateMatch = transaction.Plate && transaction.Plate.toUpperCase().includes(vipSearch);
        const vinMatch = transaction.Vehicles && transaction.Vehicles.some(vehicle => 
          vehicle.VIN && vehicle.VIN.toUpperCase().includes(vipSearch)
        );
        return plateMatch || vinMatch;
      }
      
      case 'last4-dln': {
        if (!dlnValue.trim()) return false;
        if (!stateConfig?.features.hasDLNSearch) return false; // State doesn't support DLN search
        // This would need to be implemented based on available data structure
        return false;
      }
      
      default:
        return true;
    }
  });
};
