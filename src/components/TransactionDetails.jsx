import React, { useState, useEffect } from 'react';
import './TransactionDetails.css';
import { getAssetPath, getGlobalImagePath } from '../utils/paths';
import { loadStateTransactionData } from '../utils/genericTransactionDataLoader';
import { useStateContext } from '../context/useStateContext';
import { 
  getVehicleTableHeaders, 
  formatVehicleDataValue,
  createDefaultVehicleEntry 
} from '../utils/vehicleDataUtils';

const TransactionDetails = ({ transactionId, onNavigate }) => {
  const { stateConfig } = useStateContext();
  const [transactionData, setTransactionData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    const loadTransactionDetails = async () => {
      try {
        setIsLoading(true);
        
        // Ensure we have state configuration
        if (!stateConfig?.code) {
          setError('State configuration not found');
          return;
        }
        
        // Load transaction data using the dynamic data loader
        const allTransactions = await loadStateTransactionData(stateConfig.code);
        
        // Find the specific transaction
        const transaction = allTransactions.find(t => 
          t['SST Trans'] === transactionId || 
          t.TransactionNumber === transactionId
        );
        
        if (transaction) {
          setTransactionData(transaction);
          setTotalResults(allTransactions.length);
        } else {
          setError(`Transaction ${transactionId} not found`);
        }
      } catch (err) {
        setError(`Error loading transaction details: ${err.message}`);
        console.error('TransactionDetails error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (transactionId && stateConfig?.code) {
      loadTransactionDetails();
    }
  }, [transactionId, stateConfig?.code]);

  // Extract plate number from Request Info for incomplete transactions
  const getPlateFromRequestInfo = (requestInfo) => {
    const plateMatch = requestInfo.match(/Plate:\s*(\w+)/);
    return plateMatch ? plateMatch[1] : '';
  };

  // Get vehicles data - for incomplete transactions, create default entry
  const getVehiclesData = (transaction) => {
    if (transaction.Vehicles && transaction.Vehicles.length > 0) {
      return transaction.Vehicles;
    }
    
    // For incomplete transactions, create default vehicle entry with plate from Request Info
    if (transaction.TransStatus.includes('Incomplete') || transaction.TransStatus.includes('Errors')) {
      const plateNumber = getPlateFromRequestInfo(transaction['Request Info'] || '');
      return [createDefaultVehicleEntry(plateNumber, stateConfig)];
    }
    
    return [];
  };
  const getSSID = (sstString) => {
    const match = sstString.match(/KDW\s+(\d+)/);
    return match ? match[1] : '';
  };

  // Get product abbreviation
  const getProductAbbrev = (product) => {
    if (product === 'Vehicle Renewal') return 'VR';
    if (product === 'Duplicate Reg') return 'DR';
    return product.substring(0, 2).toUpperCase();
  };

  // Format date for header
  const formatRunDate = (dateString) => {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()} ${date.getFullYear()} ${date.getHours() > 12 ? date.getHours() - 12 : date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}${date.getHours() >= 12 ? 'P' : 'A'}`;
  };

  // Get status color based on transaction status
  const getStatusColor = (status) => {
    if (status === 'Completed' || status === 'Complete (Errors)') {
      return 'Green';
    } else if (status === 'Incomplete' || status === 'Incomplete (Errors)') {
      return 'Red';
    } else if (status === 'Ineligible' || status === 'Cancelled') {
      return 'Black';
    }
    return 'Black'; // Default to black for any other status
  };

  // Check if we're in a popup window (opened via window.open)
  const isPopupWindow = window.opener !== null;

  // Handle previous button click
  const handlePreviousClick = () => {
    if (isPopupWindow) {
      // If we're in a popup, close the window
      window.close();
    } else {
      // If we're in the main window, navigate back
      onNavigate && onNavigate('sstSearch');
    }
  };

  // Helper function to render errors table
  const renderErrorsTable = (errors) => {
    // Handle different error formats
    if (!errors || errors === 'None' || (Array.isArray(errors) && errors.length === 1 && errors[0] === 'None')) {
      return <span>None</span>;
    }

    // If errors is an array of objects with Type, Code, Msg properties
    if (Array.isArray(errors) && errors.length > 0 && typeof errors[0] === 'object') {
      return (
        <table cellSpacing="5" cellPadding="5" style={{ verticalAlign: 'top', border: '1px solid #ccc', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ fontStyle: 'italic', backgroundColor: '#f0f0f0' }}>
              <th style={{ padding: '5px', border: '1px solid #ccc', fontWeight: 'bold' }}>Type</th>
              <th style={{ padding: '5px', border: '1px solid #ccc', fontWeight: 'bold' }}>Code</th>
              <th style={{ padding: '5px', border: '1px solid #ccc', fontWeight: 'bold' }}>Msg</th>
            </tr>
          </thead>
          <tbody>
            {errors.map((error, index) => (
              <tr key={index}>
                <td style={{ padding: '5px', border: '1px solid #ccc' }}>
                  <span 
                    style={{ 
                      fontWeight: error.Type && error.Type !== 'None' ? 'bold' : 'normal',
                      color: error.Type && error.Type !== 'None' ? 'red' : 'inherit'
                    }}
                  >
                    {error.Type || ''}
                  </span>
                </td>
                <td style={{ padding: '5px', border: '1px solid #ccc' }}>
                  <span 
                    style={{ 
                      fontWeight: error.Code && error.Code !== 'None' ? 'bold' : 'normal',
                      color: error.Code && error.Code !== 'None' ? 'red' : 'inherit'
                    }}
                  >
                    {error.Code || ''}
                  </span>
                </td>
                <td style={{ padding: '5px', border: '1px solid #ccc' }}>
                  <span 
                    style={{ 
                      fontWeight: error.Msg && error.Msg !== 'None' ? 'bold' : 'normal',
                      color: error.Msg && error.Msg !== 'None' ? 'red' : 'inherit'
                    }}
                  >
                    {error.Msg || ''}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    // Fallback for simple string errors
    return (
      <span 
        style={{ 
          fontWeight: errors && errors.toLowerCase() !== 'none' ? 'bold' : 'normal',
          color: errors && errors.toLowerCase() !== 'none' ? 'red' : 'inherit'
        }}
      >
        {errors}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="sst-container">
        <div className="loading">Loading transaction details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="sst-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  if (!transactionData) {
    return (
      <div className="sst-container">
        <div className="error">Transaction not found</div>
      </div>
    );
  }

  return (
    <div className="sst-container transaction-details-container expandable-content">
      <table id="MainTable" className="container transaction-details-table" cellPadding="0" cellSpacing="0">
        <tbody>
          {/* Header Row */}
          <tr id="ImageRow" className="header">
            <td>
              <img 
                src={getAssetPath(stateConfig?.assets?.pageHeaderImage)} 
                id="TopImage1" 
                alt={`${stateConfig?.fullName || 'State'} ${stateConfig?.terminology?.department || 'DMV'} Header`} 
              />
              <img id="TopImage2" align="right" />
            </td>
          </tr>
          
          {/* Red Banner */}
          <tr id="MsgRow">
            <td>
              <div className="redbar">
                <div id="UpdatePanelMsgRow">
                  <span id="lblUserMsg" className="redBar">
                    ~ SEARCH RETURNED {totalResults} ROWS ~
                  </span>
                </div>
              </div>
            </td>
          </tr>
          
          {/* Header Section */}
          <tr id="HeaderSection">
            <td>
              <div className="content">
                <table width="100%">
                  <tbody>
                    <tr id="HeaderRow">
                      <td align="left" style={{ width: '600px' }}>
                        <div id="UpdatePanelPageTitles">
                          <table>
                            <tbody>
                              <tr>
                                <td>
                                  <div className="headline">
                                    <span id="lblPageTitle" className="headline">Search Detail</span>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <div className="headlineSmaller">
                                    <span id="lblSubTitle" className="headlineSmaller">
                                      <span style={{ whiteSpace: 'nowrap' }}>
                                        Product: {getProductAbbrev(transactionData.Product)}
                                      </span>&nbsp;&nbsp; 
                                      <span style={{ whiteSpace: 'nowrap' }}>
                                        {stateConfig?.terminology?.sst || 'SST'}ID: {getSSID(transactionData.SST)}
                                      </span>&nbsp;&nbsp; 
                                      <span style={{ whiteSpace: 'nowrap' }}>
                                        {stateConfig?.terminology?.sst || 'SST'}TransNo: {transactionData['SST Trans']}
                                      </span>&nbsp;&nbsp; 
                                      <span style={{ whiteSpace: 'nowrap' }}>
                                        Run Date: {formatRunDate(transactionData.Date)}
                                      </span>
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </td>
                      <td align="right">
                        <div id="UpdatePanelNavBtns">
                          <table>
                            <tbody>
                              <tr valign="top">
                                <td>
                                  <input
                                    type="image"
                                    name="imgBtnPrev"
                                    id="imgBtnPrev"
                                    src={getGlobalImagePath('btn-previous.png')}
                                    alt="Previous"
                                    onClick={handlePreviousClick}
                                    style={{ cursor: 'pointer' }}
                                  />
                                  <input
                                    type="image"
                                    name="imgBtnHome"
                                    id="imgBtnHome"
                                    src={getGlobalImagePath('btn-main-menu.png')}
                                    alt="Main Menu"
                                    onClick={() => onNavigate && onNavigate('dashboard')}
                                    style={{ cursor: 'pointer' }}
                                  />
                                  <input
                                    type="image"
                                    name="imgBtnLogout"
                                    id="imgBtnLogout"
                                    src={getGlobalImagePath('btn-logout.png')}
                                    alt="Logout"
                                    onClick={() => onNavigate && onNavigate('stateLanding')}
                                    style={{ cursor: 'pointer' }}
                                  />
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </td>
          </tr>
          
          {/* Data Section */}
          <tr id="DataSection">
            <td>
              <div className="content">
                <table id="ReportBody" width="100%">
                  <tbody>
                    <tr id="DataRow">
                      <td>
                        <table>
                          <tbody>
                            <tr id="DataSection">
                              <td>
                                <br />
                                <div>
                                  <table className="ReptGridView" cellSpacing="10" cellPadding="10" style={{ fontSize: '12px' }}>
                                    <tbody>
                                      <tr>
                                        <th title="Click to sort by Label" scope="col">Label</th>
                                        <th title="Click to sort by Data" scope="col">Data</th>
                                        <th className="HideCol" title="Click to sort by Color" scope="col">Color</th>
                                      </tr>
                                      
                                      <tr style={{ borderColor: 'White' }}>
                                        <td>SST:</td>
                                        <td>{transactionData.SST}</td>
                                        <td className="HideCol">&nbsp;</td>
                                      </tr>
                                      
                                      <tr style={{ backgroundColor: '#E7E7E7', borderColor: 'White' }}>
                                        <td>Status:</td>
                                        <td style={{ color: getStatusColor(transactionData.TransStatus) }}>
                                          <b>{transactionData.TransStatus}</b>
                                        </td>
                                        <td className="HideCol">{getStatusColor(transactionData.TransStatus)}</td>
                                      </tr>
                                      
                                      <tr style={{ borderColor: 'White' }}>
                                        <td>Product:</td>
                                        <td>{transactionData.Product}</td>
                                        <td className="HideCol">&nbsp;</td>
                                      </tr>
                                      
                                      <tr style={{ backgroundColor: '#E7E7E7', borderColor: 'White' }}>
                                        <td>SST Trans:</td>
                                        <td>{transactionData['SST Trans']}</td>
                                        <td className="HideCol">&nbsp;</td>
                                      </tr>
                                      
                                      <tr style={{ borderColor: 'White' }}>
                                        <td>Date:</td>
                                        <td>{transactionData.Date}</td>
                                        <td className="HideCol">&nbsp;</td>
                                      </tr>
                                      
                                      <tr style={{ backgroundColor: '#E7E7E7', borderColor: 'White' }}>
                                        <td>Request Info:</td>
                                        <td>{transactionData['Request Info']}</td>
                                        <td className="HideCol">&nbsp;</td>
                                      </tr>
                                      
                                      {/* Only show Grade if status is not Ineligible */}
                                      {transactionData.TransStatus !== 'Ineligible' && (
                                        <tr style={{ borderColor: 'White' }}>
                                          <td>Grade:</td>
                                          <td>{transactionData.Grade}</td>
                                          <td className="HideCol">&nbsp;</td>
                                        </tr>
                                      )}
                                      
                                      {/* Only show Vehicles if status is not Ineligible */}
                                      {transactionData.TransStatus !== 'Ineligible' && (
                                        <tr style={{ backgroundColor: '#E7E7E7', borderColor: 'White' }}>
                                          <td>Vehicles:</td>
                                          <td>
                                            {(() => {
                                              const vehiclesData = getVehiclesData(transactionData);
                                              if (vehiclesData.length === 0) {
                                                return 'No vehicle information available';
                                              }
                                              
                                              // Get table headers based on state configuration and available data
                                              const tableHeaders = getVehicleTableHeaders(stateConfig, vehiclesData);
                                              
                                              return (
                                                <table cellSpacing="5" cellPadding="5" style={{ verticalAlign: 'top' }}>
                                                  <tbody>
                                                    <tr style={{ fontStyle: 'italic' }}>
                                                      {tableHeaders.map((header, index) => (
                                                        <td key={index}>{header.label}</td>
                                                      ))}
                                                    </tr>
                                                    {vehiclesData.map((vehicle, index) => (
                                                      <tr key={index}>
                                                        {tableHeaders.map((header, headerIndex) => (
                                                          <td key={headerIndex}>
                                                            {formatVehicleDataValue(vehicle[header.key], header.type)}
                                                          </td>
                                                        ))}
                                                      </tr>
                                                    ))}
                                                  </tbody>
                                                </table>
                                              );
                                            })()}
                                          </td>
                                          <td className="HideCol">&nbsp;</td>
                                        </tr>
                                      )}
                                      
                                      <tr style={{ borderColor: 'White' }}>
                                        <td>Session Length:</td>
                                        <td>{transactionData['Session Length']}</td>
                                        <td className="HideCol">&nbsp;</td>
                                      </tr>
                                      
                                      <tr style={{ backgroundColor: '#E7E7E7', borderColor: 'White' }}>
                                        <td>Payments:</td>
                                        <td>
                                          {transactionData.Payments && transactionData.Payments.length > 0 ? (
                                            <table cellSpacing="5" cellPadding="5" style={{ verticalAlign: 'top' }}>
                                              <tbody>
                                                <tr style={{ fontStyle: 'italic' }}>
                                                  <td>PayID</td>
                                                  <td>PayType</td>
                                                  <td>CardType</td>
                                                  <td>Last4</td>
                                                  <td>Amt</td>
                                                  <td>Status</td>
                                                  <td>Error</td>
                                                  <td>Conf</td>
                                                  <td>ReprintReqdYN</td>
                                                </tr>
                                                {transactionData.Payments.map((payment, index) => (
                                                  <tr key={index}>
                                                    <td>{payment.PayID}</td>
                                                    <td>{payment.PayType}</td>
                                                    <td>{payment.CardType}</td>
                                                    <td>{payment.Last4}</td>
                                                    <td>{payment.Amt}</td>
                                                    <td>{payment.PayStatus}</td>
                                                    <td>{payment.Error}</td>
                                                    <td>{payment.Conf}</td>
                                                    <td>{payment.ReprintReqdYN}</td>
                                                  </tr>
                                                ))}
                                              </tbody>
                                            </table>
                                          ) : (
                                            'None'
                                          )}
                                        </td>
                                        <td className="HideCol">&nbsp;</td>
                                      </tr>
                                      
                                      <tr style={{ borderColor: 'White' }}>
                                        <td>Last Form:</td>
                                        <td>{transactionData['Last Form']}</td>
                                        <td className="HideCol">&nbsp;</td>
                                      </tr>
                                      
                                      <tr style={{ backgroundColor: '#E7E7E7', borderColor: 'White' }}>
                                        <td>Language:</td>
                                        <td>{transactionData.Language}</td>
                                        <td className="HideCol">&nbsp;</td>
                                      </tr>
                                      
                                      <tr style={{ borderColor: 'White' }}>
                                        <td>Errors:</td>
                                        <td>
                                          {renderErrorsTable(transactionData.Errors)}
                                        </td>
                                        <td className="HideCol">&nbsp;</td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TransactionDetails;