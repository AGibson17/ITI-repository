import React from 'react';
import './StateLanding.css';
import { getCAImagePath } from '../utils/paths';

const StateLanding = ({ onNavigate }) => {

  const handleStateClick = (stateCode) => {
    if (stateCode === 'CA') {
      // Navigate to CA dashboard
      onNavigate('dashboard');
    } else {
      // Placeholder for other states
      alert(`${stateCode} dashboard coming soon!`);
    }
  };

  const states = [
    { code: 'CA', name: 'California', available: true },
    { code: 'TX', name: 'Texas', available: false },
    { code: 'FL', name: 'Florida', available: false },
    { code: 'NY', name: 'New York', available: false },
    { code: 'PA', name: 'Pennsylvania', available: false },
    { code: 'IL', name: 'Illinois', available: false },
    { code: 'OH', name: 'Ohio', available: false },
    { code: 'GA', name: 'Georgia', available: false },
    { code: 'NC', name: 'North Carolina', available: false },
    { code: 'MI', name: 'Michigan', available: false },
    { code: 'NJ', name: 'New Jersey', available: false },
    { code: 'VA', name: 'Virginia', available: false },
    { code: 'WA', name: 'Washington', available: false },
    { code: 'AZ', name: 'Arizona', available: false },
    { code: 'MA', name: 'Massachusetts', available: false },
    { code: 'TN', name: 'Tennessee', available: false },
    { code: 'IN', name: 'Indiana', available: false },
    { code: 'MO', name: 'Missouri', available: false }
  ];

  return (
    <div className="state-landing-container">
      {/* Header */}
      <div className="landing-header">
        <img src={getCAImagePath('text.png')} alt="DMV Repository Header" className="landing-header-image" />
      </div>

      {/* Title Section */}
      <div className="landing-title-section">
        <h1 className="landing-title">DMV REPOSITORY</h1>
        <h2 className="landing-subtitle">Select Your State</h2>
      </div>

      {/* State Grid */}
      <div className="states-grid">
        {states.map((state) => (
          <div
            key={state.code}
            className={`state-tile ${state.available ? 'available' : 'coming-soon'}`}
            onClick={() => handleStateClick(state.code)}
          >
            <div className="state-code">{state.code}</div>
            <div className="state-name">{state.name}</div>
            {!state.available && <div className="coming-soon-label">Coming Soon</div>}
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="landing-footer">
        <p>Select a state to access the DMV transaction repository and search tools.</p>
      </div>
    </div>
  );
};

export default StateLanding;
