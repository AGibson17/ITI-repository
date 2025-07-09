import React from 'react';
import './FindTransactions.css';
import { getAssetPath, getGlobalImagePath } from '../utils/paths';
import { useStateContext } from '../context/useStateContext';

const FindTransactions = ({ onNavigate }) => {
  const { stateConfig } = useStateContext();

  const handleTransactionSearchClick = () => {
    onNavigate('sstSearch');
  };

  const handleAuditDetailClick = () => {
    // Placeholder for future implementation
    alert('Audit Detail functionality will be implemented later.');
  };

  const handlePaymentSearchClick = () => {
    // Placeholder for future implementation
    alert('Payment Search functionality will be implemented later.');
  };

  // Dynamic styles for state-specific colors
  const linkStyle = {
    color: `${stateConfig?.colors?.text}`
  };

  const primaryTextStyle = {
    color: `${stateConfig?.colors?.text}`
  };

  // Header style with conditional background image or color
  const getHeaderStyle = () => {
    const baseStyle = {
      backgroundColor: stateConfig?.colors?.secondary || '#E0E0E0'
    };

    if (stateConfig?.assets?.bgHeaderImage) {
      return {
        ...baseStyle,
        backgroundImage: `url(${getAssetPath(stateConfig.assets.bgHeaderImage)})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      };
    } else {
      return baseStyle;
    }
  };

  return (
    <div className="find-transactions-container" style={{ backgroundColor: stateConfig?.colors?.secondary || '#E0E0E0' }}>
      {/* Header Section */}
      <div className="header-section" style={getHeaderStyle()}>
        <img 
          src={getAssetPath(stateConfig?.assets?.pageHeaderImage || 'text.png')} 
          alt={`${stateConfig?.fullName || 'CA'} Header`}
          className="header-image"
        />
      </div>

      {/* Title and Navigation Section */}
      <div className="title-nav-section">
        <div className="title-area">
          <h1 className="page-title" style={primaryTextStyle}>
            Find {stateConfig?.terminology?.transaction || 'Transaction'}s Menu
          </h1>
        </div>
        <div className="nav-buttons">
          <input
            type="image"
            name="imgBtnHome"
            id="imgBtnHome"
            src={getGlobalImagePath('btn-main-menu.png')}
            alt="Main Menu"
            onClick={() => onNavigate('dashboard')}
            style={{ cursor: 'pointer' }}
            className="nav-button"
          />
          <input
            type="image"
            name="imgBtnLogout"
            id="imgBtnLogout"
            src={getGlobalImagePath('btn-logout.png')}
            alt="Logout"
            onClick={() => onNavigate('stateLanding')}
            style={{ cursor: 'pointer' }}
            className="nav-button"
          />
        </div>
      </div>

      {/* Menu Content */}
      <div className="menu-content">
        <div className="menu-section">
          <div className="menu-header">{stateConfig?.terminology?.sst || 'SST'}</div>
          <div className="menu-divider"></div>
          <div className="menu-links">
            <span className="menu-link" onClick={handleAuditDetailClick} style={linkStyle}>
              Audit Detail
            </span>
            <span className="menu-link" onClick={handlePaymentSearchClick} style={linkStyle}>
              Payment Search
            </span>
            <span className="menu-link" onClick={handleTransactionSearchClick} style={linkStyle}>
              Transaction Search
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindTransactions;
