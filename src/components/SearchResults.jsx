import React from 'react';
import './SearchResults.css';

const SearchResults = ({ results, onTransactionClick }) => {
  if (!results || results.length === 0) {
    return (
      <div className="search-results-container">
        <div className="no-results">
          <p>No transactions found for the specified criteria.</p>
        </div>
      </div>
    );
  }

  const handleTransactionClick = (transaction) => {
    // For now, we'll just alert - later this will open transaction details
    if (onTransactionClick) {
      onTransactionClick(transaction);
    } else {
      alert(`Transaction details for ${transaction['SST Trans']} - Coming Soon!`);
    }
  };

  const formatTransInfo = (transaction) => {
    const vehicles = transaction.Vehicles || [];
    if (vehicles.length > 0) {
      const vehicle = vehicles[0]; // Use first vehicle
      const l4vin = vehicle.VIN ? vehicle.VIN.slice(-4) : '';
      return (
        <>
          Plate: <strong>{vehicle.Plate}</strong> L4VIN: <strong>{l4vin}</strong> Owner: <strong>{vehicle.Owner}</strong>
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

  const getPaymentInfo = (transaction) => {
    const payments = transaction.Payments || [];
    if (payments.length > 0) {
      return {
        payType: payments[0].PayType || '',
        amount: payments[0].Amt || ''
      };
    }
    return { payType: '', amount: '' };
  };

  return (
    <div className="search-results-container">
      <table className="ReptGridView" cellSpacing="10" cellPadding="10">
        <thead>
          <tr>
            <th title="Click to sort by Product" scope="col">Product</th>
            <th title="Click to sort by SST" scope="col">SST</th>
            <th title="Click to sort by TransNo" scope="col">TransNo</th>
            <th title="Click to sort by Date" scope="col">Date</th>
            <th title="Click to sort by TransInfo" scope="col">TransInfo</th>
            <th title="Click to sort by PayType" scope="col">PayType</th>
            <th title="Click to sort by PayAmt" scope="col">PayAmt</th>
            <th title="Click to sort by Status" scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {results.map((transaction, index) => {
            const paymentInfo = getPaymentInfo(transaction);
            const isEvenRow = index % 2 === 1; // Alternate row coloring
            const isCompleted = transaction.TransStatus === 'Completed';
            
            return (
              <tr
                key={transaction['SST Trans'] || index}
                className={isEvenRow ? 'even-row' : 'odd-row'}
              >
                <td>{transaction.Product}</td>
                <td>{transaction.SST}</td>
                <td>
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
                <td>{transaction.Date}</td>
                <td className="trans-info">
                  {formatTransInfo(transaction)}
                </td>
                <td>{paymentInfo.payType}</td>
                <td>{paymentInfo.amount}</td>
                <td className={`status ${isCompleted ? 'completed' : 'incomplete'}`}>
                  <strong>{transaction.TransStatus}</strong>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default SearchResults;
