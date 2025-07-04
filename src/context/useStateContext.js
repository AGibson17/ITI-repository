/**
 * State Context Hook
 * Custom hook to access state context
 */

import { useContext } from 'react';
import { StateContext } from './StateContext';

export const useStateContext = () => {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error('useStateContext must be used within a StateProvider');
  }
  return context;
};
