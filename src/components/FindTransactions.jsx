import React from 'react';
import './FindTransactions.css';
import { getCAImagePath, getGlobalImagePath } from '../utils/paths';

const FindTransactions = ({ onNavigate }) => {

  const handleSearchClick = () => {
    onNavigate('sstSearch');
  };

  const handleMainMenuClick = () => {
    onNavigate('dashboard');
  };

  const handleLogoutClick = () => {
    onNavigate('stateLanding');
  };

  const handlePlaceholderClick = (option) => {
    // Placeholder for future implementation
    alert(`${option} functionality will be implemented later.`);
  };

  return (
    <div className="find-transactions-container">
      {/* Header Section */}
      <div className="header-section">
        <img src={getCAImagePath('text.png')} alt="CA DMV Header" className="header-image" />
      </div>

      {/* Title and Navigation Section */}
      <div className="title-nav-section">
        <div className="title-area">
          <h1 className="page-title">FIND TRANSACTIONS MENU</h1>
        </div>
        <div className="nav-buttons">
          <img
            src={getGlobalImagePath('btn-main-menu.png')}
            alt="Main Menu"
            className="nav-button"
            onClick={handleMainMenuClick}
          />
          <img
            src={getGlobalImagePath('btn-logout.png')}
            alt="Logout"
            className="nav-button"
            onClick={handleLogoutClick}
          />
        </div>
      </div>

      {/* Menu Content */}
      <div className="menu-content">
        <div className="menu-section">
          <div className="menu-header">SST</div>
          <div className="menu-divider"></div>

          <div className="menu-links">
            <a
              href="#"
              className="menu-link"
              onClick={(e) => {
                e.preventDefault();
                handlePlaceholderClick('Audit Detail');
              }}
              title="View low-level details for a transaction"
            >
              Audit Detail
            </a>

            <a
              href="#"
              className="menu-link"
              onClick={(e) => {
                e.preventDefault();
                handlePlaceholderClick('Errors');
              }}
              title="Errors returned from CA web service and processing errors with drilldown links to details"
            >
              Errors
            </a>

            <a
              href="#"
              className="menu-link"
              onClick={(e) => {
                e.preventDefault();
                handleSearchClick();
              }}
              title="Search for transactions by various criteria"
            >
              Search
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindTransactions;
