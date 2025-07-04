import { useState } from 'react';
import SearchResults from './SearchResults';
import '../styles/defaultStyles.css';
import '../components/SSTSearch.css';
import { getGlobalImagePath } from '../utils/paths';
import { loadStateTransactionData, searchTransactions } from '../utils/genericTransactionDataLoader';
import { useStateContext } from '../context/useStateContext';

export default function SSTSearch({ onNavigate }) {
  const { stateConfig } = useStateContext();
  const [searchBy, setSearchBy] = useState('sst-dates');
  const [product, setProduct] = useState('<ALL>');
  const [plateValue, setPlateValue] = useState('');
  const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
  const [transNo, setTransNo] = useState('');
  const [vinValue, setVinValue] = useState('');
  const [vipValue, setVipValue] = useState('');
  const [dlnValue, setDlnValue] = useState('');
  
  // SST selector state
  const [sstLocation, setSstLocation] = useState('<ALL>');

  // Search results state
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Function to load and search transaction data
  const performSearch = async () => {
    // Validate search criteria based on search type
    if (searchBy === 'plate' && !plateValue.trim()) {
      alert('Please enter a plate number to search.');
      return;
    }
    if (searchBy === 'sst-transno' && !transNo.trim()) {
      alert('Please enter a transaction number to search.');
      return;
    }
    if (searchBy === 'vin' && !vinValue.trim()) {
      alert('Please enter a VIN to search.');
      return;
    }
    if (searchBy === 'vip-plate' && !vipValue.trim()) {
      alert('Please enter a VIP plate or VIN to search.');
      return;
    }
    if (searchBy === 'last4-dln' && !dlnValue.trim()) {
      alert('Please enter the last 4 digits of DLN to search.');
      return;
    }

    setIsLoading(true);
    try {
      // Load transaction data using the new data loader
      const allTransactions = await loadStateTransactionData(stateConfig?.code || 'CA');

      // Search transactions using the new search utility
      const searchCriteria = {
        product: product,
        searchBy: searchBy,
        plateValue: plateValue,
        transValue: transNo,
        vinValue: vinValue,
        vipValue: vipValue,
        dlnValue: dlnValue
      };

      const results = searchTransactions(allTransactions, searchCriteria, stateConfig?.code || 'CA');

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

  // Dynamic styles for state-specific colors
  const primaryTextStyle = {
    color: `${stateConfig?.colors?.text}`
  };

  return (
    <div className="sst-container">
      {/* Header */}
      <div className="sst-header" style={{ backgroundColor: stateConfig?.colors?.secondary}}>
        <img
          src={stateConfig?.assets?.pageHeaderImage}
          alt={`${stateConfig?.name || 'State'} ${stateConfig?.terminology?.department || 'DMV'} Header`}
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
                      <td align="left" style={{ width: '70%' }}>
                        <div id="UpdatePanelPageTitles">
                          <table>
                            <tbody>
                              <tr>
                                <td>
                                  <div className="headline">
                                    <span id="lblPageTitle" className="headline" style={primaryTextStyle}>SST Search</span>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </td>
                      <td align="right" style={{paddingRight: '5px', width: '30%'}}>
                        <div id="UpdatePanelNavBtns" style={{padding: '0', margin: '0'}}>
                          <table style={{margin: '0', borderSpacing: '0'}}>
                            <tbody>
                              <tr valign="top">
                                <td style={{padding: '0 1px', margin: '0'}}>
                                  <input
                                    type="image"
                                    name="imgBtnPrev"
                                    id="imgBtnPrev"
                                    src={getGlobalImagePath('btn-previous.png')}
                                    alt="Previous"
                                    onClick={() => onNavigate && onNavigate('findTransactions')}
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

          {/* DataSection */}
          <tr id="DataSection">
            <td>
              <div className="content">
                <div id="ContentPlaceHolder1_UpdatePanel1">
                  <table id="ContentPlaceHolder1_ReportBody" width="100%">
                    <tbody>
                      <tr id="ContentPlaceHolder1_CriteriaRow1" valign="top">
                        <td>
                          <table cellSpacing="0" style={{width: '100%'}}>
                            <tbody>
                              <tr valign="top">
                                <td id="ContentPlaceHolder1_ProdSelect" style={{width: '200px'}}>
                                  <span id="ContentPlaceHolder1_lblProduct" className="labelBlue">Product:</span><br />
                                  <select
                                    name="ddlbProductList"
                                    id="ContentPlaceHolder1_ddlbProductList"
                                    className="select"
                                    value={product}
                                    onChange={(e) => setProduct(e.target.value)}
                                  >
                                    <option value="<ALL>">&lt;ALL&gt;</option>
                                    <option value="VR">Vehicle Renewal</option>
                                  </select>
                                </td>
                                <td id="ContentPlaceHolder1_SearchByList" style={{paddingLeft: '0', verticalAlign: 'top', width: 'auto'}}>
                                  <span id="ContentPlaceHolder1_Label2" className="labelBlue">Search By:</span><br />
                                  <table id="ContentPlaceHolder1_rbtnlistSearchBy" style={{borderSpacing: '0', margin: '0', padding: '0'}}>
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
                                          <td key={value} style={{padding: '0 2px 0 0', margin: '0', verticalAlign: 'middle'}}>
                                            <input
                                              id={`ContentPlaceHolder1_rbtnlistSearchBy_${index}`}
                                              type="radio"
                                              name="rbtnlistSearchBy"
                                              value={value}
                                              checked={searchBy === value}
                                              onChange={(e) => setSearchBy(e.target.value)}
                                              style={{margin: '0 2px 0 0', verticalAlign: 'middle'}}
                                            />
                                            <label htmlFor={`ContentPlaceHolder1_rbtnlistSearchBy_${index}`} style={{margin: '0 4px 0 0', fontSize: '12px', verticalAlign: 'middle'}}>
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
                          <table cellSpacing="0" width="100%">
                            <tbody>
                              <tr valign="top">
                                <td>
                                  <table>
                                    <tbody>
                                      <tr align="left" valign="top">
                                        {searchBy === 'sst-dates' && (
                                          <>
                                            <td id="ContentPlaceHolder1_SSTEntry" style={{ paddingRight: '0px', verticalAlign: 'top' }}>
                                              <span className="labelBlue">SST:</span>
                                              <select
                                                name="ddlbSSTList"
                                                id="ContentPlaceHolder1_ddlbSSTList"
                                                className="select"
                                                value={sstLocation}
                                                onChange={(e) => setSstLocation(e.target.value)}
                                                style={{ width: '350px' }}
                                              >
                                                <option value="<ALL>">&lt;ALL&gt;</option>
                                              </select>
                                            </td>
                                            <td id="ContentPlaceHolder1_DateEntry" align="left" style={{ paddingLeft: '10px' }}>
                                              <table width="220px">
                                                <tbody>
                                                  <tr>
                                                    <td>
                                                      <span className="labelBlue">Start Date:</span>
                                                    </td>
                                                    <td>
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
                                                    </td>
                                                    <td>
                                                      <input
                                                        type="date"
                                                        className="InputGreySmall"
                                                        value={toDate}
                                                        onChange={(e) => setToDate(e.target.value)}
                                                      />
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </td>
                                          </>
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
                                        {searchBy === 'sst-transno' && (
                                          <td id="ContentPlaceHolder1_TransNoEntry" style={{ paddingLeft: '10px' }}>
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
                                    src={getGlobalImagePath('btn-ShowReport.png')}
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
            // Open transaction details in a new tab
            const baseUrl = window.location.origin + window.location.pathname;
            const transactionUrl = `${baseUrl}?page=transactionDetails&transactionId=${transaction['SST Trans']}`;
            window.open(transactionUrl, '_blank');
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
