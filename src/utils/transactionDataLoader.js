/**
 * Transaction data loader utility
 * Combines data from multiple California transaction scenario files
 */

import { getAssetPath } from './paths';

/**
 * Load and combine all California transaction data
 * @returns {Promise<Array>} Combined and normalized transaction data
 */
export const loadCATransactionData = async () => {
  try {
    // Load all three CA transaction data files
    const [mainResponse, nirdResponse, historicalResponse] = await Promise.all([
      fetch(getAssetPath('TransData/CA/CA_Main_Scenarios.json')),
      fetch(getAssetPath('TransData/CA/NIRD_Scenarios.json')),
      fetch(getAssetPath('TransData/CA/Historical_Transactions.json'))
    ]);

    if (!mainResponse.ok) {
      throw new Error(`Failed to load CA_Main_Scenarios.json: ${mainResponse.status}`);
    }
    if (!nirdResponse.ok) {
      throw new Error(`Failed to load NIRD_Scenarios.json: ${nirdResponse.status}`);
    }
    if (!historicalResponse.ok) {
      throw new Error(`Failed to load Historical_Transactions.json: ${historicalResponse.status}`);
    }

    const [mainData, nirdData, historicalData] = await Promise.all([
      mainResponse.json(),
      nirdResponse.json(),
      historicalResponse.json()
    ]);

    // Combine both scenario datasets
    const allScenarios = [...mainData, ...nirdData];

    // Normalize the scenario data to match the expected structure
    const normalizedTransactions = allScenarios.map(scenario => {
      const detail = scenario.TransactionDetail;
      
      // Convert Payments object to array format if it exists
      let payments = [];
      if (detail.Payments && typeof detail.Payments === 'object' && !Array.isArray(detail.Payments)) {
        // Handle single payment object
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
        // Handle array of payments
        payments = detail.Payments;
      } else if (detail.Payments === "None" || !detail.Payments) {
        // Handle cases where no payment was made
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
        'Last Form': detail['Last Form'] || '',
        Language: detail.Language || 'English',
        Errors: Array.isArray(detail.Errors) ? detail.Errors.join('; ') : (detail.Errors || 'None')
      };
    });

    // Normalize the historical data to match the expected structure
    const normalizedHistoricalTransactions = historicalData.map(record => {
      return {
        // Historical metadata
        ScenarioType: record.ScenarioType || 'HistoricalTransaction',
        Plate: record.Plate || '',
        TransactionNumber: record.TransactionNumber || record['SST Trans'] || '',
        IssueCategory: '',
        IssueDetail: '',
        Prompt: '',
        IsClickable: false, // Historical transactions are NOT clickable
        
        // Normalized transaction details
        SST: record.SST || '',
        TransStatus: record.TransStatus || '',
        Product: record.Product || '',
        'SST Trans': record['SST Trans'] || record.TransactionNumber || '',
        Date: record.Date || '',
        'Request Info': record['Request Info'] || '',
        Grade: '',
        Vehicles: record.L4VIN ? [{
          Plate: record.Plate || '',
          VIN: record.L4VIN || '',
          Owner: record.Owner || '',
          PayType: record.PayType || '',
          PayAmt: record.PayAmt || ''
        }] : [],
        'Session Length': '',
        Payments: record.PayType ? [{
          PayType: record.PayType || '',
          Amt: record.PayAmt || '',
          PayStatus: record.TransStatus === 'Completed' ? 'Approved' : 'Pending'
        }] : [],
        'Last Form': '',
        Language: 'English',
        Errors: record.TransStatus === 'Incomplete' ? 'Transaction Incomplete' : 'None'
      };
    });

    // Combine all transaction data
    const allTransactions = [...normalizedTransactions, ...normalizedHistoricalTransactions];

    console.log(`Loaded ${allTransactions.length} transactions from CA files:`, {
      mainScenarios: mainData.length,
      auxScenarios: nirdData.length,
      historicalRecords: historicalData.length,
      total: allTransactions.length
    });

    return allTransactions;

  } catch (error) {
    console.error('Error loading CA transaction data:', error);
    throw error;
  }
};

/**
 * Search transactions by various criteria
 * @param {Array} transactions - The transaction data array
 * @param {Object} searchCriteria - Search parameters
 * @returns {Array} Filtered transactions
 */
export const searchTransactions = (transactions, searchCriteria) => {
  const { 
    product = '<ALL>', 
    searchBy = 'sst-dates', 
    plateValue = '', 
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

    // Then filter by search type
    switch (searchBy) {
      case 'sst-dates': {
        // For SST/Dates, show all transactions (can be enhanced with date range filtering)
        return true;
      }
      
      case 'plate': {
        if (!plateValue.trim()) return false;
        const plateSearch = plateValue.trim().toUpperCase();
        return transaction.Plate && transaction.Plate.toUpperCase().includes(plateSearch);
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
        const vipSearch = vipValue.trim().toUpperCase();
        // Search both plate and VIN for VIP search
        const plateMatch = transaction.Plate && transaction.Plate.toUpperCase().includes(vipSearch);
        const vinMatch = transaction.Vehicles && transaction.Vehicles.some(vehicle => 
          vehicle.VIN && vehicle.VIN.toUpperCase().includes(vipSearch)
        );
        return plateMatch || vinMatch;
      }
      
      case 'last4-dln': {
        if (!dlnValue.trim()) return false;
        // This would need to be implemented based on available data
        // For now, return false as DLN data might not be available in current structure
        return false;
      }
      
      default:
        return true;
    }
  });
};
