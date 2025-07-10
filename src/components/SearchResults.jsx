import React, { useState, useMemo, useCallback } from 'react';
import './SearchResults.css';
import { useStateContext } from '../context/useStateContext';

const SearchResults = ({ results, onTransactionClick, currentState }) => {
  const { stateConfig } = useStateContext();
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Define column order based on state
  const getColumnOrder = (stateCode) => {
    // Check if state has custom display configuration
    if (stateCode === 'NM' && stateConfig?.displayConfig?.searchResults?.columns) {
      return stateConfig.displayConfig.searchResults.columns;
    }
    
    if (stateCode === 'HI') {
      return [
        'Product',
        'SST',
        'TransNo',
        'Date',
        'PayAmt',
        'PayType',
        'TransInfo',
        'Status'
      ];
    }
    // Default order for other states (CA, etc.)
    return [
      'Product',
      'SST',
      'TransNo',
      'Date',
      'TransInfo',
      'PayType',
      'PayAmt',
      'Status'
    ];
  };

  const columnOrder = getColumnOrder(currentState);

  // Helper function to get payment info from transaction
  const getPaymentInfo = useCallback((transaction) => {
    const payments = transaction.Payments || [];
    if (payments.length > 0) {
      return {
        payType: payments[0].PayType || '',
        amount: payments[0].Amt || '$0.00'
      };
    }
    return { payType: '', amount: '$0.00' };
  }, []);

  // Function to get sortable value from transaction
  const getSortValue = useCallback((transaction, column) => {
    const paymentInfo = getPaymentInfo(transaction);
    
    switch (column) {
      case 'Product':
        return transaction.Product || '';
      case 'SST':
        return transaction.SST || '';
      case 'TransNo':
        return transaction['SST Trans'] || '';
      case 'Date': {
        // Convert date to timestamp for proper sorting
        const dateValue = new Date(transaction.Date);
        return isNaN(dateValue.getTime()) ? 0 : dateValue.getTime();
      }
      case 'PayAmt': {
        // Extract numeric value from currency string
        const amount = paymentInfo.amount || '$0.00';
        return parseFloat(amount.replace(/[$,]/g, '')) || 0;
      }
      case 'PayType':
        return paymentInfo.payType || '';
      case 'TransInfo': {
        // Extract plate number for sorting TransInfo
        const vehicles = transaction.Vehicles || [];
        if (vehicles.length > 0) {
          return vehicles[0].Plate || '';
        }
        const requestInfo = transaction['Request Info'] || '';
        const plateMatch = requestInfo.match(/Plate: (\w+)/);
        return plateMatch ? plateMatch[1] : '';
      }
      case 'RequestInfo': {
        // Sort by VIN or Plate from RequestInfo
        const requestInfo = transaction.RequestInfo || '';
        const vinMatch = requestInfo.match(/VIN: (\w+)/);
        const plateMatch = requestInfo.match(/Plate: (\w+)/);
        return vinMatch ? vinMatch[1] : (plateMatch ? plateMatch[1] : requestInfo);
      }
      case 'PayInfo': {
        // Sort by payment amount from PayInfo
        const payInfo = transaction.PayInfo || '';
        const amountMatch = payInfo.match(/\$[\d,]+\.?\d*/);
        return amountMatch ? parseFloat(amountMatch[0].replace(/[$,]/g, '')) : 0;
      }
      case 'Status':
        return transaction.TransStatus || '';
      default:
        return '';
    }
  }, [getPaymentInfo]);

  // Sort the results based on current sort configuration
  const sortedResults = useMemo(() => {
    if (!results || results.length === 0 || !sortConfig.key) {
      return results || [];
    }

    return [...results].sort((a, b) => {
      const aVal = getSortValue(a, sortConfig.key);
      const bVal = getSortValue(b, sortConfig.key);

      if (aVal < bVal) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aVal > bVal) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [results, sortConfig, getSortValue]);

  if (!results || results.length === 0) {
    return (
      <div className="search-results-container">
        <div className="no-results">
          <p>No transactions found for the specified criteria.</p>
        </div>
      </div>
    );
  }

  // Handle column header click for sorting
  const handleSort = (column) => {
    setSortConfig(prevConfig => ({
      key: column,
      direction: prevConfig.key === column && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Get sort indicator for column headers
  const getSortIndicator = (column) => {
    if (sortConfig.key !== column) {
      return ' ↕️'; // Unsorted indicator
    }
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  };

  const handleTransactionClick = (transaction) => {
    // Open transaction details in a new tab
    if (onTransactionClick) {
      onTransactionClick(transaction);
    } else {
      // Create URL with transaction ID parameter and open in new tab
      const baseUrl = window.location.origin + window.location.pathname;
      const transactionUrl = `${baseUrl}?page=transactionDetails&transactionId=${transaction['SST Trans']}`;
      window.open(transactionUrl, '_blank');
    }
  };

  const formatTransInfo = (transaction) => {
    const vehicles = transaction.Vehicles || [];
    if (vehicles.length > 0) {
      const vehicle = vehicles[0]; // Use first vehicle
      const l4vin = vehicle.VIN ? vehicle.VIN.slice(-4) : '';
      
      // Handle Hawaii-specific Title field for L4Title
      let l4TitleInfo = '';
      if (vehicle.Title) {
        // Extract last part of title as L4Title (e.g., "AKF392 25" -> "3 25")
        const titleParts = vehicle.Title.split(' ');
        if (titleParts.length > 1) {
          l4TitleInfo = ` L4Title: <strong>${titleParts.slice(-2).join(' ')}</strong>`;
        }
      }
      
      return (
        <>
          Plate: <strong>{vehicle.Plate}</strong> L4VIN: <strong>{l4vin}</strong>{l4TitleInfo ? <span dangerouslySetInnerHTML={{__html: l4TitleInfo}} /> : ''} Owner: <strong>{vehicle.Owner}</strong>
        </>
      );
    }
    // Fallback to request info if no vehicles
    const requestInfo = transaction['Request Info'] || '';
    const plateMatch = requestInfo.match(/Plate: (\w+)/);
    const plate = plateMatch ? plateMatch[1] : '';
    return (
      <>
        Plate: <strong>{plate}</strong>
      </>
    );
  };

  // Get status color based on transaction status
  const getStatusColor = (status) => {
    // Remove parentheses for color determination
    const cleanStatus = status ? status.replace(/\s*\([^)]*\)/g, '').trim() : '';
    
    if (cleanStatus === 'Completed') {
      return 'green';
    } else if (cleanStatus === 'Incomplete') {
      return 'red';
    } else if (cleanStatus === 'Ineligible' || cleanStatus === 'Cancelled') {
      return 'black';
    }
    return 'black'; // Default to black for any other status
  };

  // Helper function to clean status text for display
  const getDisplayStatus = (status) => {
    return status ? status.replace(/\s*\([^)]*\)/g, '').trim() : '';
  };

  const getColumnHeader = (column) => {
    switch (column) {
      case 'Product':
        return 'Product';
      case 'SST':
        return 'SST';
      case 'TransNo':
        return 'TransNo';
      case 'Date':
        return 'Date';
      case 'TransInfo':
        return 'TransInfo';
      case 'PayType':
        return 'PayType';
      case 'PayAmt':
        return 'PayAmt';
      case 'RequestInfo':
        return 'RequestInfo';
      case 'PayInfo':
        return 'PayInfo';
      case 'Status':
        return 'Status';
      default:
        return column;
    }
  };

  // Format custom columns for NM based on stateConfig formatting rules
  const formatCustomColumn = (column, transaction) => {
    const displayConfig = stateConfig?.displayConfig?.searchResults;
    if (!displayConfig || currentState !== 'NM') {
      return transaction[column] || '';
    }

    const formatting = displayConfig.formatting?.[column];
    if (!formatting) {
      return transaction[column] || '';
    }

    const { format } = formatting;
    
    switch (column) {
      case 'RequestInfo': {
        if (format === 'labeled') {
          // Parse and format RequestInfo with labels
          const requestInfo = transaction.RequestInfo || '';
          const parts = [];
          
          // Extract specific fields and format them
          const vinMatch = requestInfo.match(/VIN: (\w+)/);
          const zipMatch = requestInfo.match(/Zip: (\w+)/);
          const ctrlMatch = requestInfo.match(/CtrlNo: (\w+)/);
          const plateMatch = requestInfo.match(/Plate: (\w+)/);
          
          if (vinMatch) parts.push(`VIN: <strong>${vinMatch[1]}</strong>`);
          if (zipMatch) parts.push(`Zip: <strong>${zipMatch[1]}</strong>`);
          if (ctrlMatch) parts.push(`CtrlNo: <strong>${ctrlMatch[1]}</strong>`);
          if (plateMatch) parts.push(`Plate: <strong>${plateMatch[1]}</strong>`);
          
          return parts.join(' ');
        }
        return transaction.RequestInfo || '';
      }
      
      case 'PayInfo': {
        if (format === 'combined') {
          // Format PayInfo as "PayType $Amount"
          const payInfo = transaction.PayInfo || '';
          const typeMatch = payInfo.match(/^(\w+)/);
          const amountMatch = payInfo.match(/\$[\d,]+\.?\d*/);
          
          if (typeMatch && amountMatch) {
            return `${typeMatch[1]} <strong>${amountMatch[0]}</strong>`;
          }
        }
        return transaction.PayInfo || '';
      }
      
      case 'TransInfo': {
        if (format === 'unlabeled') {
          // Format TransInfo with labeled plate/VIN but unlabeled owner
          const transInfo = transaction.TransInfo || '';
          const plateMatch = transInfo.match(/Plate: (\w+)/);
          const vinMatch = transInfo.match(/VIN: (\w+)/);
          const ownerMatch = transInfo.match(/VIN: \w+ (.+)$/);
          
          const parts = [];
          if (plateMatch) parts.push(`Plate: <strong>${plateMatch[1]}</strong>`);
          if (vinMatch) parts.push(`VIN: <strong>${vinMatch[1]}</strong>`);
          if (ownerMatch) parts.push(`<strong>${ownerMatch[1]}</strong>`);
          
          return parts.join(' ');
        }
        return transaction.TransInfo || '';
      }
      
      default:
        return transaction[column] || '';
    }
  };

  const renderColumnData = (column, transaction) => {
    const paymentInfo = getPaymentInfo(transaction);
    const statusColor = getStatusColor(transaction.TransStatus);
    
    switch (column) {
      case 'Product':
        return <td key={column}>{transaction.Product}</td>;
      case 'SST':
        return <td key={column}>{transaction.SST}</td>;
      case 'TransNo':
        return (
          <td key={column}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleTransactionClick(transaction);
              }}
              className="transaction-link"
            >
              {transaction['SST Trans']}
            </a>
          </td>
        );
      case 'Date':
        return <td key={column}>{transaction.Date}</td>;
      case 'TransInfo':
        // Use custom formatting for NM, regular formatting for others
        if (currentState === 'NM') {
          const formattedContent = formatCustomColumn(column, transaction);
          return (
            <td key={column} className="trans-info">
              <span dangerouslySetInnerHTML={{ __html: formattedContent }} />
            </td>
          );
        } else {
          return (
            <td key={column} className="trans-info">
              {formatTransInfo(transaction)}
            </td>
          );
        }
      case 'PayType':
        return <td key={column}>{paymentInfo.payType}</td>;
      case 'PayAmt':
        return <td key={column}>{paymentInfo.amount}</td>;
      case 'RequestInfo': {
        const formattedContent = formatCustomColumn(column, transaction);
        return (
          <td key={column}>
            <span dangerouslySetInnerHTML={{ __html: formattedContent }} />
          </td>
        );
      }
      case 'PayInfo': {
        const formattedContent = formatCustomColumn(column, transaction);
        return (
          <td key={column}>
            <span dangerouslySetInnerHTML={{ __html: formattedContent }} />
          </td>
        );
      }
      case 'Status':
        return (
          <td key={column} className="status" style={{ color: statusColor }}>
            <strong>{getDisplayStatus(transaction.TransStatus)}</strong>
          </td>
        );
      default:
        return <td key={column}></td>;
    }
  };

  return (
    <div className="search-results-container">
      <table className="ReptGridView" cellSpacing="10" cellPadding="10">
        <thead>
          <tr>
            {columnOrder.map(column => (
              <th key={column} title={`Click to sort by ${getColumnHeader(column)}`} scope="col" onClick={() => handleSort(column)}>
                {getColumnHeader(column)}{getSortIndicator(column)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedResults.map((transaction, index) => {
            const isEvenRow = index % 2 === 1; // Alternate row coloring
            
            return (
              <tr
                key={transaction['SST Trans'] || index}
                className={isEvenRow ? 'even-row' : 'odd-row'}
              >
                {columnOrder.map((column) => renderColumnData(column, transaction))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default SearchResults;