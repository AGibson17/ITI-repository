/**
 * State Provider Component
 * Manages current state selection and provides state-specific configuration
 */

import React, { useState, useEffect } from 'react';
import { StateContext } from './StateContext';
import { getStateConfig, isStateActive } from '../config/stateConfig';

export const StateProvider = ({ children }) => {
  // Initialize state from localStorage or default to CA
  const [currentState, setCurrentState] = useState(() => {
    const savedState = localStorage.getItem('currentState') || localStorage.getItem('selectedState');
    return savedState && isStateActive(savedState) ? savedState : 'CA';
  });

  const [stateConfig, setStateConfig] = useState(() => getStateConfig(currentState));

  // Update state configuration when current state changes
  useEffect(() => {
    const config = getStateConfig(currentState);
    if (config && config.isActive) {
      setStateConfig(config);
      localStorage.setItem('currentState', currentState);
    }
  }, [currentState]);

  // Function to change state
  const changeState = (newStateCode) => {
    if (isStateActive(newStateCode)) {
      setCurrentState(newStateCode);
    } else {
      console.warn(`Attempted to switch to inactive state: ${newStateCode}`);
    }
  };

  // Get state-specific asset path
  const getStateAssetPath = (assetName) => {
    if (!stateConfig) return '';
    return `${stateConfig.assets.logoPath}${assetName}`;
  };

  // Get state-specific terminology
  const getTerminology = (key) => {
    if (!stateConfig) return key;
    return stateConfig.terminology[key] || key;
  };

  // Get state-specific colors
  const getStateColors = () => {
    return stateConfig?.colors || {};
  };

  const value = {
    currentState,
    stateConfig,
    changeState,
    getStateAssetPath,
    getTerminology,
    getStateColors,
    isActive: (stateCode) => isStateActive(stateCode)
  };

  return (
    <StateContext.Provider value={value}>
      {children}
    </StateContext.Provider>
  );
};
