import { useState } from 'react';
import SearchResults from './SearchResults';
import '../styles/defaultStyles.css';
import '../components/SSTSearch.css';

export default function SSTSearch({ onNavigate }) {
  const [searchBy, setSearchBy] = useState('sst-dates');
  const [plateType, setPlateType] = useState('full');
  const [product, setProduct] = useState('<ALL>');
  const [plateValue, setPlateValue] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [transNo, setTransNo] = useState('');
  const [vinValue, setVinValue] = useState('');
  const [vipValue, setVipValue] = useState('');
  const [dlnValue, setDlnValue] = useState('');
  
  // Search results state
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Function to load and search transaction data
  const performSearch = async () => {
    if (!plateValue.trim()) {
      alert('Please enter a plate number to search.');
      return;
    }

    setIsLoading(true);
    try {
      // Load the transaction data
      const response = await fetch('/ITI-repository/TransData/CA/FullTransactionDetails_9TRK281.json');
      const data = await response.json();
      
      // Filter transactions by plate number
      const results = data.transactions.filter(transaction => {
        // Check in vehicles array
        if (transaction.Vehicles && transaction.Vehicles.length > 0) {
          return transaction.Vehicles.some(vehicle => 
            vehicle.Plate && vehicle.Plate.toLowerCase().includes(plateValue.toLowerCase())
          );
        }
        
        // Check in request info as fallback
        const requestInfo = transaction['Request Info'] || '';
        return requestInfo.toLowerCase().includes(plateValue.toLowerCase());
      });
      
      setSearchResults(results);
      setShowResults(true);
    } catch (error) {
      console.error('Error loading transaction data:', error);
      alert('Error loading transaction data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Show Report button click
  const handleShowReport = () => {
    performSearch();
  };

  // Handle Enter key in plate input
  const handlePlateKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      performSearch();
    }
  };

  return (
    <div className="sst-container">
      {/* Header */}
      <div className="header">
        <img
          src="/images/CA/text.png"
          alt="CA DMV Header"
          className='header-img-search'
        />
      </div>

      {/* Red Banner */}
      <div className="redbar">
        ~ PLEASE SELECT SEARCH CRITERIA AND THEN PRESS 'SHOW REPORT' ~
      </div>

      {/* HeaderSection */}
      <table width="100%">
        <tbody>
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
                                    <span id="lblPageTitle" className="headline">SST Search</span>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <div className="headlineSmaller">
                                    <span id="lblSubTitle" className="headlineSmaller"></span>
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
                                    src="/images/CA/btn-previous.png"
                                    alt="Previous"
                                    onClick={() => onNavigate && onNavigate('findTransactions')}
                                    style={{ cursor: 'pointer' }}
                                  />
                                  <input
                                    type="image"
                                    name="imgBtnHome"
                                    id="imgBtnHome"
                                    src="/images/CA/btn-main-menu.png"
                                    alt="Main Menu"
                                    onClick={() => onNavigate && onNavigate('dashboard')}
                                    style={{ cursor: 'pointer' }}
                                  />
                                  <input
                                    type="image"
                                    name="imgBtnLogout"
                                    id="imgBtnLogout"
                                    src="/images/CA/btn-logout.png"
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

          {/* DataSection */}
          <tr id="DataSection">
            <td>
              <div className="content">
                <div id="ContentPlaceHolder1_UpdatePanel1">
                  <table id="ContentPlaceHolder1_ReportBody" width="100%">
                    <tbody>
                      <tr id="ContentPlaceHolder1_CriteriaRow1" valign="top">
                        <td>
                          <table cellSpacing="2">
                            <tbody>
                              <tr valign="top">
                                <td id="ContentPlaceHolder1_ProdSelect">
                                  <span id="ContentPlaceHolder1_lblProduct" className="labelBlue">Product:</span><br />
                                  <select
                                    name="ddlbProductList"
                                    id="ContentPlaceHolder1_ddlbProductList"
                                    className="select"
                                    value={product}
                                    onChange={(e) => setProduct(e.target.value)}
                                  >
                                    <option value="<ALL>">&lt;ALL&gt;</option>
                                  </select>
                                </td>
                                <td>&nbsp;&nbsp;</td>
                                <td id="ContentPlaceHolder1_SearchByList">
                                  <span id="ContentPlaceHolder1_Label2" className="labelBlue">Search By:</span><br />
                                  <table id="ContentPlaceHolder1_rbtnlistSearchBy">
                                    <tbody>
                                      <tr>
                                        {[
                                          'sst-dates',
                                          'sst-transno',
                                          'plate',
                                          'vin',
                                          'vip-plate',
                                          'last4-dln',
                                        ].map((value, index) => (
                                          <td key={value}>
                                            <input
                                              id={`ContentPlaceHolder1_rbtnlistSearchBy_${index}`}
                                              type="radio"
                                              name="rbtnlistSearchBy"
                                              value={value}
                                              checked={searchBy === value}
                                              onChange={(e) => setSearchBy(e.target.value)}
                                            />
                                            <label htmlFor={`ContentPlaceHolder1_rbtnlistSearchBy_${index}`}>
                                              {value
                                                .replace('sst-dates', 'SST/Dates')
                                                .replace('sst-transno', 'SST/TransNo')
                                                .replace('plate', 'Plate')
                                                .replace('vin', 'VIN')
                                                .replace('vip-plate', 'VIP Plate or VIN')
                                                .replace('last4-dln', 'Last4 DLN')}
                                            </label>
                                          </td>
                                        ))}
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                      <tr id="ContentPlaceHolder1_CriteriaRow2">
                        <td>
                          <table cellSpacing="2" width="100%">
                            <tbody>
                              <tr valign="top">
                                <td>
                                  <table>
                                    <tbody>
                                      <tr align="left" valign="top">
                                        {searchBy === 'sst-dates' && (
                                          <td id="ContentPlaceHolder1_DateEntry">
                                            <table width="300px">
                                              <tbody>
                                                <tr>
                                                  <td style={{ width: '150px' }}>
                                                    <span className="labelBlue">Start Date:</span>
                                                  </td>
                                                  <td style={{ width: '150px' }}>
                                                    <span className="labelBlue">End Date:</span>
                                                  </td>
                                                </tr>
                                                <tr>
                                                  <td>
                                                    <input 
                                                      type="date" 
                                                      className="InputGreySmall" 
                                                      value={fromDate}
                                                      onChange={(e) => setFromDate(e.target.value)}
                                                    />
                                                    <img 
                                                      src="/images/calendar.gif" 
                                                      alt="Calendar"
                                                      style={{ marginLeft: '5px', cursor: 'pointer', verticalAlign: 'middle' }}
                                                    />
                                                  </td>
                                                  <td>
                                                    <input 
                                                      type="date" 
                                                      className="InputGreySmall"
                                                      value={toDate}
                                                      onChange={(e) => setToDate(e.target.value)}
                                                    />
                                                    <img 
                                                      src="/images/calendar.gif" 
                                                      alt="Calendar"
                                                      style={{ marginLeft: '5px', cursor: 'pointer', verticalAlign: 'middle' }}
                                                    />
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                          </td>
                                        )}
                                        {searchBy === 'sst-transno' && (
                                          <td id="ContentPlaceHolder1_TransNoEntry">
                                            <table>
                                              <tbody>
                                                <tr>
                                                  <td>
                                                    <span className="labelBlue">Transaction No:</span>
                                                  </td>
                                                </tr>
                                                <tr>
                                                  <td>
                                                    <input 
                                                      type="text" 
                                                      className="InputGrey"
                                                      value={transNo}
                                                      onChange={(e) => setTransNo(e.target.value)}
                                                    />
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                          </td>
                                        )}
                                        {searchBy === 'plate' && (
                                          <td id="ContentPlaceHolder1_GenericTextEntry1">
                                            <table>
                                              <tbody>
                                                <tr>
                                                  <td>
                                                    <span id="ContentPlaceHolder1_lblGenericTextEntry1" className="labelBlue">Plate:</span>
                                                  </td>
                                                </tr>
                                                <tr>
                                                  <td>
                                                    <input
                                                      name="txtGenericTextEntry1"
                                                      type="text"
                                                      id="ContentPlaceHolder1_txtGenericTextEntry1"
                                                      tabIndex="1"
                                                      className="InputGrey"
                                                      value={plateValue}
                                                      onChange={(e) => setPlateValue(e.target.value)}
                                                      onKeyPress={handlePlateKeyPress}
                                                      placeholder="Enter plate number"
                                                    />
                                                  </td>
                                                </tr>
                                                <tr id="ContentPlaceHolder1_GenericTextSubRowRBtnList1">
                                                  <td>
                                                    <table id="ContentPlaceHolder1_rbtnListGenericTextSubRow1">
                                                      <tbody>
                                                        <tr>
                                                          <td>
                                                            <input
                                                              id="ContentPlaceHolder1_rbtnListGenericTextSubRow1_0"
                                                              type="radio"
                                                              name="rbtnListGenericTextSubRow1"
                                                              value="full"
                                                              checked={plateType === 'full'}
                                                              onChange={(e) => setPlateType(e.target.value)}
                                                            />
                                                            <label htmlFor="ContentPlaceHolder1_rbtnListGenericTextSubRow1_0">Full</label>
                                                          </td>
                                                          <td>
                                                            <input
                                                              id="ContentPlaceHolder1_rbtnListGenericTextSubRow1_1"
                                                              type="radio"
                                                              name="rbtnListGenericTextSubRow1"
                                                              value="partial"
                                                              checked={plateType === 'partial'}
                                                              onChange={(e) => setPlateType(e.target.value)}
                                                            />
                                                            <label htmlFor="ContentPlaceHolder1_rbtnListGenericTextSubRow1_1">Partial</label>
                                                          </td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                          </td>
                                        )}
                                        {searchBy === 'vin' && (
                                          <td id="ContentPlaceHolder1_VinEntry">
                                            <table>
                                              <tbody>
                                                <tr>
                                                  <td>
                                                    <span className="labelBlue">VIN:</span>
                                                  </td>
                                                </tr>
                                                <tr>
                                                  <td>
                                                    <input 
                                                      type="text" 
                                                      className="InputGrey" 
                                                      maxLength="17"
                                                      value={vinValue}
                                                      onChange={(e) => setVinValue(e.target.value)}
                                                    />
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                          </td>
                                        )}
                                        {searchBy === 'vip-plate' && (
                                          <td id="ContentPlaceHolder1_VipEntry">
                                            <table>
                                              <tbody>
                                                <tr>
                                                  <td>
                                                    <span className="labelBlue">VIP Plate or VIN:</span>
                                                  </td>
                                                </tr>
                                                <tr>
                                                  <td>
                                                    <input 
                                                      type="text" 
                                                      className="InputGrey"
                                                      value={vipValue}
                                                      onChange={(e) => setVipValue(e.target.value)}
                                                    />
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                          </td>
                                        )}
                                        {searchBy === 'last4-dln' && (
                                          <td id="ContentPlaceHolder1_DlnEntry">
                                            <table>
                                              <tbody>
                                                <tr>
                                                  <td>
                                                    <span className="labelBlue">Last 4 DLN:</span>
                                                  </td>
                                                </tr>
                                                <tr>
                                                  <td>
                                                    <input 
                                                      type="text" 
                                                      className="InputGrey" 
                                                      maxLength="4"
                                                      value={dlnValue}
                                                      onChange={(e) => setDlnValue(e.target.value)}
                                                    />
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                          </td>
                                        )}
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                                <td id="ShowReport" align="right" width="8%">
                                  &nbsp;&nbsp;
                                  <input
                                    type="image"
                                    name="btnShowReport"
                                    id="ContentPlaceHolder1_btnShowReport"
                                    tabIndex="8"
                                    src="/images/CA/btn-ShowReport.png"
                                    alt="Show Report"
                                    onClick={handleShowReport}
                                    style={{ cursor: 'pointer' }}
                                    disabled={isLoading}
                                  />
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                      <tr id="ContentPlaceHolder1_DataRow">
                        <td>
                          <table>
                            <tbody>
                              <tr id="ContentPlaceHolder1_DataSection">
                                <td><br /></td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Search Results Section */}
      {showResults && (
        <SearchResults 
          results={searchResults} 
          onTransactionClick={(transaction) => {
            // TODO: Navigate to transaction details page
            console.log('Transaction clicked:', transaction);
          }}
        />
      )}

      {isLoading && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p>Searching transactions...</p>
        </div>
      )}
    </div>
  );
}
