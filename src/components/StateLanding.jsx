import React from 'react';
import './StateLanding.css';
import { getStateFlagPath, getSelectorPath } from '../utils/paths';

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
    { code: 'CA', name: 'California', flagName: 'California', available: true },
    { code: 'CO', name: 'Colorado', flagName: 'Colorado', available: false },
    { code: 'FL', name: 'Florida', flagName: 'Florida', available: false },
    { code: 'GA', name: 'Georgia', flagName: 'Georgia', available: false },
    { code: 'HI', name: 'Hawaii', flagName: 'Hawaii', available: false },
    { code: 'IL', name: 'Illinois', flagName: 'Illinois', available: false },
    { code: 'IN', name: 'Indiana', flagName: 'Indiana', available: false },
    { code: 'MI', name: 'Michigan', flagName: 'Michigan', available: false },
    { code: 'MN', name: 'Minnesota', flagName: 'Minnesota', available: false },
    { code: 'NV', name: 'Nevada', flagName: 'Nevada', available: false },
    { code: 'NM', name: 'New Mexico', flagName: 'NewMexico', available: false },
    { code: 'NC', name: 'North Carolina', flagName: 'NorthCarolina', available: false },
    { code: 'ND', name: 'North Dakota', flagName: 'NorthDakota', available: false },
    { code: 'OH', name: 'Ohio', flagName: 'Ohio', available: false },
    { code: 'OR', name: 'Oregon', flagName: 'Oregon', available: false },
    { code: 'SC', name: 'South Carolina', flagName: 'South Carolina', available: false },
    { code: 'SD', name: 'South Dakota', flagName: 'SouthDakota', available: false },
    { code: 'WV', name: 'West Virginia', flagName: 'WestVirginia', available: false }
  ];

  return (
    <div className="state-landing-container">
      {/* Header */}
      <div className="landing-header">
        <img src={getSelectorPath('ITI-TextLogo_White.png')} alt="DMV Repository Header" className="landing-header-image" />
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
            <div className="state-code">
              <img 
                src={getStateFlagPath(state.flagName)} 
                alt={state.name} 
                className="state-image"
              />
            </div>
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
