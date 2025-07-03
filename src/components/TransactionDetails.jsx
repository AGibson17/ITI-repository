import React, { useState, useEffect } from 'react';
import './TransactionDetails.css';
import { getCAImagePath, getGlobalImagePath, getAssetPath } from '../utils/paths';

const TransactionDetails = ({ transactionId }) => {
  const [transactionData, setTransactionData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    const loadTransactionDetails = async () => {
      try {
        setIsLoading(true);
        
        // Load transaction data from the main source
        const response = await fetch(getAssetPath('TransData/CA/ca_error_scenarios_full.json'));
        
        if (!response.ok) {
          throw new Error(`Failed to load transaction data: ${response.status}`);
        }
        
        const data = await response.json();

        // Normalize the error scenarios data to match the expected structure
        const normalizedErrorScenarios = data.map(scenario => {
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
              ReprintReqdYN: detail.Payments.ReprintReqdYN || 'N'
            }];
          } else if (Array.isArray(detail.Payments)) {
            payments = detail.Payments;
          }

          return {
            SST: detail.SST || '',
            TransStatus: detail.Status || '',
            Product: detail.Product || '',
            'SST Trans': detail['SST Trans'] || '',
            Date: detail.Date || '',
            'Request Info': detail['Request Info'] || '',
            Grade: detail.Grade || '',
            Vehicles: detail.Vehicles || [],
            'Session Length': detail['Session Length'] || '',
            Payments: payments,
            'Last Form': detail['Last Form'] || '',
            Language: detail.Language || '',
            Errors: Array.isArray(detail.Errors) ? detail.Errors.join('; ') : (detail.Errors || 'None')
          };
        });

        // Use the normalized transaction data
        const allTransactions = normalizedErrorScenarios;
        
        // Find the specific transaction
        const transaction = allTransactions.find(t => t['SST Trans'] === transactionId);
        
        if (transaction) {
          setTransactionData(transaction);
          setTotalResults(allTransactions.length);
        } else {
          setError('Transaction not found');
        }
      } catch (err) {
        setError('Error loading transaction details');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadTransactionDetails();
  }, [transactionId]);

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
      return [{
        Plate: plateNumber,
        Expires: '1/1/1990',
        VIN: '',
        Vehicle: '0',
        Owner: '',
        Fees: '$0.00',
        'Contact Info': '',
        'Renew Type': 'NotDefined'
      }];
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
    <div className="sst-container">
      <table id="MainTable" className="container" cellPadding="0" cellSpacing="0">
        <tbody>
          {/* Header Row */}
          <tr id="ImageRow" className="header">
            <td>
              <img src={getCAImagePath('text.png')} id="TopImage1" alt="CA DMV Header" />
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
                                        SSTID: {getSSID(transactionData.SST)}
                                      </span>&nbsp;&nbsp; 
                                      <span style={{ whiteSpace: 'nowrap' }}>
                                        SSTTransNo: {transactionData['SST Trans']}
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
                                    onClick={() => window.close()}
                                    style={{ cursor: 'pointer' }}
                                  />
                                  <input
                                    type="image"
                                    name="imgBtnHome"
                                    id="imgBtnHome"
                                    src={getGlobalImagePath('btn-main-menu.png')}
                                    alt="Main Menu"
                                    onClick={() => {
                                      const baseUrl = window.location.origin + window.location.pathname;
                                      const homeUrl = `${baseUrl}?page=dashboard`;
                                      window.location.href = homeUrl;
                                    }}
                                    style={{ cursor: 'pointer' }}
                                  />
                                  <input
                                    type="image"
                                    name="imgBtnLogout"
                                    id="imgBtnLogout"
                                    src={getGlobalImagePath('btn-logout.png')}
                                    alt="Logout"
                                    onClick={() => {
                                      const baseUrl = window.location.origin + window.location.pathname;
                                      const logoutUrl = `${baseUrl}?page=stateLanding`;
                                      window.location.href = logoutUrl;
                                    }}
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
                                        <td style={{ color: transactionData.TransStatus === 'Completed' ? 'Green' : 'Red' }}>
                                          <b>{transactionData.TransStatus}</b>
                                        </td>
                                        <td className="HideCol">{transactionData.TransStatus === 'Completed' ? 'Green' : 'Red'}</td>
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
                                      
                                      <tr style={{ borderColor: 'White' }}>
                                        <td>Grade:</td>
                                        <td>{transactionData.Grade}</td>
                                        <td className="HideCol">&nbsp;</td>
                                      </tr>
                                      
                                      <tr style={{ backgroundColor: '#E7E7E7', borderColor: 'White' }}>
                                        <td>Vehicles:</td>
                                        <td>
                                          {(() => {
                                            const vehiclesData = getVehiclesData(transactionData);
                                            return vehiclesData.length > 0 ? (
                                              <table cellSpacing="5" cellPadding="5" style={{ verticalAlign: 'top' }}>
                                                <tbody>
                                                  <tr style={{ fontStyle: 'italic' }}>
                                                    <td>Plate</td>
                                                    <td>Expires</td>
                                                    <td>VIN</td>
                                                    <td>Vehicle</td>
                                                    <td>Owner</td>
                                                    <td>Fees</td>
                                                    <td>Contact Info</td>
                                                    <td>Renew Type</td>
                                                  </tr>
                                                  {vehiclesData.map((vehicle, index) => (
                                                    <tr key={index}>
                                                      <td>{vehicle.Plate}</td>
                                                      <td>{vehicle.Expires}</td>
                                                      <td>{vehicle.VIN}</td>
                                                      <td>{vehicle.Vehicle}</td>
                                                      <td>{vehicle.Owner}</td>
                                                      <td>{vehicle.Fees}</td>
                                                      <td>{vehicle['Contact Info']}</td>
                                                      <td>{vehicle['Renew Type']}</td>
                                                    </tr>
                                                  ))}
                                                </tbody>
                                              </table>
                                            ) : (
                                              'No vehicle information available'
                                            );
                                          })()}
                                        </td>
                                        <td className="HideCol">&nbsp;</td>
                                      </tr>
                                      
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
                                        <td>{transactionData.Errors}</td>
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
