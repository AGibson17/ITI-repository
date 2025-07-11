import { useState, useEffect, useCallback } from 'react';
import SearchResults from './SearchResults';
import '../components/SSTSearch.css';
import { getGlobalImagePath, getAssetPath } from '../utils/paths';
import { loadStateTransactionData, searchTransactions } from '../utils/genericTransactionDataLoader';
import { getSSTLocationOptions } from '../utils/sstLocationLoader';
import { useStateContext } from '../context/useStateContext';

export default function SSTSearch({ onNavigate }) {
  const { stateConfig } = useStateContext();
  
  // Get default search type from state configuration, fallback to 'sst-dates'
  const getDefaultSearchType = useCallback(() => {
    return stateConfig?.features?.defaultSearchType || 'sst-dates';
  }, [stateConfig]);
  
  const [searchBy, setSearchBy] = useState(getDefaultSearchType());
  const [product, setProduct] = useState('<ALL>');
  const [plateValue, setPlateValue] = useState('');
  const [plateSearchType, setPlateSearchType] = useState('Full');
  const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
  const [transNo, setTransNo] = useState('');
  const [vinValue, setVinValue] = useState('');
  const [vipValue, setVipValue] = useState('');
  const [dlnValue, setDlnValue] = useState('');
  
  // SST selector state
  const [sstLocation, setSstLocation] = useState('<ALL>');
  const [sstLocationOptions, setSstLocationOptions] = useState([{ value: '<ALL>', label: '<ALL>' }]);

  // Search results state
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Update search type when state config changes
  useEffect(() => {
    setSearchBy(getDefaultSearchType());
  }, [getDefaultSearchType]);

  // Load SST locations when state changes
  useEffect(() => {
    const loadSSTLocations = async () => {
      if (stateConfig?.code) {
        try {
          const options = await getSSTLocationOptions(stateConfig.code);
          setSstLocationOptions(options);
          setSstLocation('<ALL>'); // Reset to default
        } catch (error) {
          console.error('Failed to load SST locations:', error);
          // Keep default options if loading fails
          setSstLocationOptions([{ value: '<ALL>', label: '<ALL>' }]);
        }
      }
    };

    loadSSTLocations();
  }, [stateConfig?.code]);

  // Clear search results when search type changes
  useEffect(() => {
    setSearchResults([]);
    setShowResults(false);
  }, [searchBy]);

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
        sstLocation: sstLocation, // Include SST location in search criteria
        plateValue: plateValue,
        plateSearchType: plateSearchType, // Add Full/Partial search type
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

  // Header style with conditional background image or color
  const getHeaderStyle = () => {
    if (stateConfig?.assets?.bgHeaderImage) {
      return {
        backgroundImage: `url(${getAssetPath(stateConfig.assets.bgHeaderImage)})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      };
    } else {
      return {
        backgroundColor: stateConfig?.colors?.secondary
      };
    }
  };

  return (
    <div className={`sst-container ${showResults ? 'sst-container-expandable' : ''}`}>
      {/* Header */}
      <div className="sst-header" style={getHeaderStyle()}>
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

      {/* Header Section - Flexbox Layout */}
      <div className="header-section">
        <div className="content">
          <div className="header-row">
            <div className="page-title-area">
              <div className="page-titles">
                <div className="headline">
                  <span className="headline" style={primaryTextStyle}>SST Search</span>
                </div>
              </div>
            </div>
            <div className="nav-buttons-area">
              <div className="nav-buttons">
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
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Section - Flexbox Layout */}
      <div className="data-section">
        <div className="content">
          <div className="report-body">
            <div className="criteria-row-1">
              <div className="product-select">
                <span className="labelBlue">Product:</span>
                <select
                  name="ddlbProductList"
                  className="select"
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                >
                  <option value="<ALL>">&lt;ALL&gt;</option>
                  <option value="VR">Vehicle Renewal</option>
                </select>
              </div>
              <div className="search-by-list">
                <span className="labelBlue">Search By:</span>
                <div className="search-by-options">
                  {[
                    'sst-dates',
                    'sst-transno',
                    'plate',
                    'vin',
                    'vip-plate',
                    'last4-dln',
                  ].map((value, index) => (
                    <div key={value} className="search-option">
                      <input
                        id={`rbtnlistSearchBy_${index}`}
                        type="radio"
                        name="rbtnlistSearchBy"
                        value={value}
                        checked={searchBy === value}
                        onChange={(e) => setSearchBy(e.target.value)}
                      />
                      <label htmlFor={`rbtnlistSearchBy_${index}`}>
                        {value
                          .replace('sst-dates', 'SST/Dates')
                          .replace('sst-transno', 'SST/TransNo')
                          .replace('plate', 'Plate')
                          .replace('vin', 'VIN')
                          .replace('vip-plate', 'VIP Plate or VIN')
                          .replace('last4-dln', 'Last4 DLN')}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="criteria-row-2">
              <div className="search-inputs">
                {searchBy === 'sst-dates' && (
                  <>
                    <div className="sst-entry">
                      <span className="labelBlue">SST:</span>
                      <select
                        name="ddlbSSTList"
                        className="select sst-select"
                        value={sstLocation}
                        onChange={(e) => setSstLocation(e.target.value)}
                      >
                        {sstLocationOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="date-entry">
                      <div className="date-inputs">
                        <div className="date-field">
                          <span className="labelBlue">Start Date:</span>
                          <input
                            type="date"
                            className="InputGreySmall"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                          />
                        </div>
                        <div className="date-field">
                          <span className="labelBlue">End Date:</span>
                          <input
                            type="date"
                            className="InputGreySmall"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
                {searchBy === 'plate' && (
                  <div className="plate-entry">
                    <span className="labelBlue">Plate:</span>
                    <input
                      name="txtGenericTextEntry1"
                      type="text"
                      className="InputGrey"
                      value={plateValue}
                      onChange={(e) => setPlateValue(e.target.value)}
                      onKeyPress={handlePlateKeyPress}
                      placeholder="Enter plate number"
                    />
                    <div className="plate-search-options">
                      <label className="search-type-option">
                        <input
                          type="radio"
                          name="plateSearchType"
                          value="Full"
                          checked={plateSearchType === 'Full'}
                          onChange={(e) => setPlateSearchType(e.target.value)}
                        />
                        Full
                      </label>
                      <label className="search-type-option">
                        <input
                          type="radio"
                          name="plateSearchType"
                          value="Partial"
                          checked={plateSearchType === 'Partial'}
                          onChange={(e) => setPlateSearchType(e.target.value)}
                        />
                        Partial
                      </label>
                    </div>
                  </div>
                )}
                {searchBy === 'vin' && (
                  <div className="vin-entry">
                    <span className="labelBlue">VIN:</span>
                    <input
                      type="text"
                      className="InputGrey"
                      maxLength="17"
                      value={vinValue}
                      onChange={(e) => setVinValue(e.target.value)}
                    />
                  </div>
                )}
                {searchBy === 'vip-plate' && (
                  <div className="vip-entry">
                    <span className="labelBlue">VIP Plate or VIN:</span>
                    <input
                      type="text"
                      className="InputGrey"
                      value={vipValue}
                      onChange={(e) => setVipValue(e.target.value)}
                    />
                  </div>
                )}
                {searchBy === 'last4-dln' && (
                  <div className="dln-entry">
                    <span className="labelBlue">Last 4 DLN:</span>
                    <input
                      type="text"
                      className="InputGrey"
                      maxLength="4"
                      value={dlnValue}
                      onChange={(e) => setDlnValue(e.target.value)}
                    />
                  </div>
                )}
                {searchBy === 'sst-transno' && (
                  <div className="transno-entry">
                    <span className="labelBlue">Transaction No:</span>
                    <input
                      type="text"
                      className="InputGrey"
                      value={transNo}
                      onChange={(e) => setTransNo(e.target.value)}
                    />
                  </div>
                )}
              </div>
              <div className="show-report-area">
                <input
                  type="image"
                  name="btnShowReport"
                  src={getAssetPath(stateConfig?.assets?.showReportBtn) || getGlobalImagePath('btn-ShowReport.png')}
                  alt="Show Report"
                  onClick={handleShowReport}
                  style={{ cursor: 'pointer' }}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Results Section */}
      {showResults && (
        <SearchResults
          results={searchResults}
          currentState={stateConfig?.code}
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
