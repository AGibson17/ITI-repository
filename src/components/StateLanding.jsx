import React from 'react';
import './StateLanding.css';
import { getStateFlagPath, getSelectorPath } from '../utils/paths';
import { getAllStates, isStateActive } from '../config/stateConfig';
import { useStateContext } from '../context/useStateContext';

const StateLanding = ({ onNavigate }) => {
  const { changeState } = useStateContext();

  const handleStateClick = (stateCode) => {
    if (isStateActive(stateCode)) {
      // Update the global state context
      changeState(stateCode);
      // Store the selected state in localStorage for persistence
      localStorage.setItem('currentState', stateCode);
      onNavigate('dashboard');
    } else {
      // Show coming soon message for inactive states
      const stateConfig = getAllStates().find(s => s.code === stateCode);
      const stateName = stateConfig ? stateConfig.name : stateCode;
      alert(`${stateName} dashboard coming soon!`);
    }
  };

  // Get state flag mapping for existing flag names
  const getFlagName = (stateCode) => {
    const flagMap = {
      'CA': 'California',
      'CO': 'Colorado', 
      'FL': 'Florida',
      'GA': 'Georgia',
      'HI': 'Hawaii',
      'IL': 'Illinois',
      'IN': 'Indiana',
      'MI': 'Michigan',
      'MN': 'Minnesota',
      'NV': 'Nevada',
      'NM': 'NewMexico',
      'NC': 'NorthCarolina',
      'ND': 'NorthDakota',
      'OH': 'Ohio',
      'OR': 'Oregon',
      'SC': 'South Carolina',
      'SD': 'SouthDakota',
      'WV': 'WestVirginia'
    };
    return flagMap[stateCode] || stateCode;
  };

  // Get all configured states
  const allStates = getAllStates();
  
  // Create display states including ones not yet configured
  const displayStates = [
    ...allStates.map(state => ({
      code: state.code,
      name: state.name,
      flagName: getFlagName(state.code),
      available: state.isActive
    })),
    // Add states that have flags but no configuration yet
    { code: 'GA', name: 'Georgia', flagName: 'Georgia', available: false },
    { code: 'HI', name: 'Hawaii', flagName: 'Hawaii', available: false },
    { code: 'IL', name: 'Illinois', flagName: 'Illinois', available: false },
    { code: 'IN', name: 'Indiana', flagName: 'Indiana', available: false },
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
  ].filter((state, index, self) => 
    // Remove duplicates based on state code
    index === self.findIndex(s => s.code === state.code)
  );

  return (
    <div className="state-landing-container">
      {/* Header */}
      <div className="landing-header">
        <img src={getSelectorPath('ITI-TextLogo_White.png')} alt="DMV Repository Header" className="landing-header-image" />
      </div>

      {/* Title Section */}
      <div className="landing-title-section">
        <h1 className="landing-title">TRAINING REPOSITORY</h1>
        <h2 className="landing-subtitle">Select Your State</h2>
      </div>

      {/* State Grid */}
      <div className="states-grid">
        {displayStates.map((state) => (
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
