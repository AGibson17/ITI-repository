import { useState } from 'react';
import SearchResults from './SearchResults';
import '../styles/defaultStyles.css';
import '../components/SSTSearch.css';
import { getCAImagePath, getAssetPath, getGlobalImagePath } from '../utils/paths';

export default function SSTSearch({ onNavigate }) {
  const [searchBy, setSearchBy] = useState('sst-dates');
  const [plateType, setPlateType] = useState('full');
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
  const [sstSortBy, setSstSortBy] = useState('location');

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
      // Load the transaction data
      const response = await fetch(getAssetPath('TransData/CA/FullTransactionDetails_9TRK281.json'));
      const data = await response.json();

      // Filter transactions based on search criteria
      let results = data.transactions.filter(transaction => {
        // First filter by product if not <ALL>
        if (product !== '<ALL>' && transaction.Product !== product) {
          return false;
        }

        // Then filter by search type
        switch (searchBy) {
          case 'sst-dates': {
            // For SST/Dates, we can filter by date range and SST location if implemented
            return true; // For now, show all transactions within date range
          }
          
          case 'sst-transno': {
            return transaction['SST Trans'] && 
                   transaction['SST Trans'].toLowerCase().includes(transNo.toLowerCase());
          }
          
          case 'plate': {
            // Check in vehicles array
            if (transaction.Vehicles && transaction.Vehicles.length > 0) {
              return transaction.Vehicles.some(vehicle =>
                vehicle.Plate && vehicle.Plate.toLowerCase().includes(plateValue.toLowerCase())
              );
            }
            // Check in request info as fallback
            const requestInfo = transaction['Request Info'] || '';
            return requestInfo.toLowerCase().includes(plateValue.toLowerCase());
          }
          
          case 'vin': {
            if (transaction.Vehicles && transaction.Vehicles.length > 0) {
              return transaction.Vehicles.some(vehicle =>
                vehicle.VIN && vehicle.VIN.toLowerCase().includes(vinValue.toLowerCase())
              );
            }
            return false;
          }
          
          case 'vip-plate': {
            if (transaction.Vehicles && transaction.Vehicles.length > 0) {
              return transaction.Vehicles.some(vehicle =>
                (vehicle.Plate && vehicle.Plate.toLowerCase().includes(vipValue.toLowerCase())) ||
                (vehicle.VIN && vehicle.VIN.toLowerCase().includes(vipValue.toLowerCase()))
              );
            }
            return false;
          }
          
          case 'last4-dln': {
            // This would need to be implemented based on actual data structure
            return transaction.DLN && transaction.DLN.slice(-4) === dlnValue;
          }
          
          default: {
            return true;
          }
        }
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
      <div className="sst-header">
        <img
          src={getCAImagePath('text.png')}
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
                      <td align="left" style={{ width: '70%' }}>
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
                                <td id="ContentPlaceHolder1_ProdSelect" style={{paddingRight: '20px', verticalAlign: 'top', width: '200px'}}>
                                  <span id="ContentPlaceHolder1_lblProduct" className="labelBlue">Product:</span><br />
                                  <select
                                    name="ddlbProductList"
                                    id="ContentPlaceHolder1_ddlbProductList"
                                    className="select"
                                    value={product}
                                    onChange={(e) => setProduct(e.target.value)}
                                  >
                                    <option value="<ALL>">&lt;ALL&gt;</option>
                                    <option value="ANU">Affidavit of Non Use</option>
                                    <option value="DH">Driver History</option>
                                    <option value="DLREN">Driver License Renewal</option>
                                    <option value="KDDL">Duplicate Driver License</option>
                                    <option value="VRD">Duplicate Reg</option>
                                    <option value="INS">Insurance Reinstatement</option>
                                    <option value="REIN">Reinstatement Fee</option>
                                    <option value="REMOVEANU">Remove Affidavit of Non Use</option>
                                    <option value="VR">Vehicle Renewal</option>
                                    <option value="VH">Vehicle History</option>
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
                                              <table>
                                                <tbody>
                                                  <tr>
                                                    <td>
                                                      <div style={{ float: 'left', marginRight: '10px' }}>
                                                        <span className="labelBlue">SST:</span>
                                                      </div>
                                                      <div style={{ float: 'left' }}>
                                                        <table id="ContentPlaceHolder1_rbtnlistSSTSortBy" style={{ borderSpacing: '0', margin: '0', padding: '0' }}>
                                                          <tbody>
                                                            <tr>
                                                              <td style={{ padding: '0 8px 0 0', verticalAlign: 'middle' }}>
                                                                <input
                                                                  id="ContentPlaceHolder1_rbtnlistSSTSortBy_0"
                                                                  type="radio"
                                                                  name="rbtnlistSSTSortBy"
                                                                  value="location"
                                                                  checked={sstSortBy === 'location'}
                                                                  onChange={(e) => setSstSortBy(e.target.value)}
                                                                  style={{ margin: '0 2px 0 0', verticalAlign: 'middle' }}
                                                                />
                                                                <label htmlFor="ContentPlaceHolder1_rbtnlistSSTSortBy_0" style={{ fontSize: '12px', cursor: 'pointer', verticalAlign: 'middle' }}>
                                                                  By Location
                                                                </label>
                                                              </td>
                                                              <td style={{ padding: '0 8px 0 0', verticalAlign: 'middle' }}>
                                                                <input
                                                                  id="ContentPlaceHolder1_rbtnlistSSTSortBy_1"
                                                                  type="radio"
                                                                  name="rbtnlistSSTSortBy"
                                                                  value="id"
                                                                  checked={sstSortBy === 'id'}
                                                                  onChange={(e) => setSstSortBy(e.target.value)}
                                                                  style={{ margin: '0 2px 0 0', verticalAlign: 'middle' }}
                                                                />
                                                                <label htmlFor="ContentPlaceHolder1_rbtnlistSSTSortBy_1" style={{ fontSize: '12px', cursor: 'pointer', verticalAlign: 'middle' }}>
                                                                  By ID
                                                                </label>
                                                              </td>
                                                              <td style={{ padding: '0 8px 0 0', verticalAlign: 'middle' }}>
                                                                <input
                                                                  id="ContentPlaceHolder1_rbtnlistSSTSortBy_2"
                                                                  type="radio"
                                                                  name="rbtnlistSSTSortBy"
                                                                  value="clientid"
                                                                  checked={sstSortBy === 'clientid'}
                                                                  onChange={(e) => setSstSortBy(e.target.value)}
                                                                  style={{ margin: '0 2px 0 0', verticalAlign: 'middle' }}
                                                                />
                                                                <label htmlFor="ContentPlaceHolder1_rbtnlistSSTSortBy_2" style={{ fontSize: '12px', cursor: 'pointer', verticalAlign: 'middle' }}>
                                                                  By Client ID
                                                                </label>
                                                              </td>
                                                            </tr>
                                                          </tbody>
                                                        </table>
                                                      </div>
                                                      <div style={{ clear: 'both' }}></div>
                                                    </td>
                                                  </tr>
                                                  <tr>
                                                    <td style={{ paddingTop: '2px' }}>
                                                      <select
                                                        name="ddlbSSTList"
                                                        id="ContentPlaceHolder1_ddlbSSTList"
                                                        className="select"
                                                        value={sstLocation}
                                                        onChange={(e) => setSstLocation(e.target.value)}
                                                        style={{ width: '350px' }}
                                                      >
                                                        <option value="<ALL>">&lt;ALL&gt;</option>
                                                        <option value="528">Albertsons Alhambra - KAN - 528</option>
                                                        <option value="521">Albertsons Apple Valley - KDW - 521</option>
                                                        <option value="461">Albertsons Banning - KDR - 461</option>
                                                        <option value="348">Albertsons Buena Park - KN6 - 348</option>
                                                        <option value="349">Albertsons Chula Vista - KN5 - 349</option>
                                                        <option value="492">Albertsons Downey - KAF - 492</option>
                                                        <option value="360">Albertsons Escondido - KN3 - 360</option>
                                                        <option value="364">Albertsons Fountain Valley - KN7 - 364</option>
                                                        <option value="476">Albertsons Fullerton Malvern - KEF - 476</option>
                                                      </select>
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </table>
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
                                        {searchBy === 'sst-transno' && (
                                          <>
                                            <td id="ContentPlaceHolder1_SSTEntry" style={{ paddingRight: '20px', verticalAlign: 'top' }}>
                                              <table>
                                                <tbody>
                                                  <tr>
                                                    <td>
                                                      <div style={{ float: 'left', marginRight: '10px' }}>
                                                        <span className="labelBlue">SST:</span>
                                                      </div>
                                                      <div style={{ float: 'left' }}>
                                                        <table id="ContentPlaceHolder1_rbtnlistSSTSortBy" style={{ borderSpacing: '0', margin: '0', padding: '0' }}>
                                                          <tbody>
                                                            <tr>
                                                              <td style={{ padding: '0 8px 0 0', verticalAlign: 'middle' }}>
                                                                <input
                                                                  id="ContentPlaceHolder1_rbtnlistSSTSortBy_0"
                                                                  type="radio"
                                                                  name="rbtnlistSSTSortBy"
                                                                  value="location"
                                                                  checked={sstSortBy === 'location'}
                                                                  onChange={(e) => setSstSortBy(e.target.value)}
                                                                  style={{ margin: '0 2px 0 0', verticalAlign: 'middle' }}
                                                                />
                                                                <label htmlFor="ContentPlaceHolder1_rbtnlistSSTSortBy_0" style={{ fontSize: '12px', cursor: 'pointer', verticalAlign: 'middle' }}>
                                                                  By Location
                                                                </label>
                                                              </td>
                                                              <td style={{ padding: '0 8px 0 0', verticalAlign: 'middle' }}>
                                                                <input
                                                                  id="ContentPlaceHolder1_rbtnlistSSTSortBy_1"
                                                                  type="radio"
                                                                  name="rbtnlistSSTSortBy"
                                                                  value="id"
                                                                  checked={sstSortBy === 'id'}
                                                                  onChange={(e) => setSstSortBy(e.target.value)}
                                                                  style={{ margin: '0 2px 0 0', verticalAlign: 'middle' }}
                                                                />
                                                                <label htmlFor="ContentPlaceHolder1_rbtnlistSSTSortBy_1" style={{ fontSize: '12px', cursor: 'pointer', verticalAlign: 'middle' }}>
                                                                  By ID
                                                                </label>
                                                              </td>
                                                              <td style={{ padding: '0 8px 0 0', verticalAlign: 'middle' }}>
                                                                <input
                                                                  id="ContentPlaceHolder1_rbtnlistSSTSortBy_2"
                                                                  type="radio"
                                                                  name="rbtnlistSSTSortBy"
                                                                  value="clientid"
                                                                  checked={sstSortBy === 'clientid'}
                                                                  onChange={(e) => setSstSortBy(e.target.value)}
                                                                  style={{ margin: '0 2px 0 0', verticalAlign: 'middle' }}
                                                                />
                                                                <label htmlFor="ContentPlaceHolder1_rbtnlistSSTSortBy_2" style={{ fontSize: '12px', cursor: 'pointer', verticalAlign: 'middle' }}>
                                                                  By Client ID
                                                                </label>
                                                              </td>
                                                            </tr>
                                                          </tbody>
                                                        </table>
                                                      </div>
                                                      <div style={{ clear: 'both' }}></div>
                                                    </td>
                                                  </tr>
                                                  <tr>
                                                    <td style={{ paddingTop: '2px' }}>
                                                      <select
                                                        name="ddlbSSTList"
                                                        id="ContentPlaceHolder1_ddlbSSTList"
                                                        className="select"
                                                        value={sstLocation}
                                                        onChange={(e) => setSstLocation(e.target.value)}
                                                        style={{ width: '350px' }}
                                                      >
                                                        <option value="<ALL>">&lt;ALL&gt;</option>
                                                        <option value="528">Albertsons Alhambra - KAN - 528</option>
                                                        <option value="521">Albertsons Apple Valley - KDW - 521</option>
                                                        <option value="461">Albertsons Banning - KDR - 461</option>
                                                        <option value="348">Albertsons Buena Park - KN6 - 348</option>
                                                        <option value="349">Albertsons Chula Vista - KN5 - 349</option>
                                                        <option value="492">Albertsons Downey - KAF - 492</option>
                                                        <option value="360">Albertsons Escondido - KN3 - 360</option>
                                                        <option value="364">Albertsons Fountain Valley - KN7 - 364</option>
                                                        <option value="476">Albertsons Fullerton Malvern - KEF - 476</option>
                                                      </select>
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </td>
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
