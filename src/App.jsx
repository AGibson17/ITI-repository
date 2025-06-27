import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import SSTSearch from './components/SSTSearch';
import FindTransactions from './components/FindTransactions';
import StateLanding from './components/StateLanding';
import PlaceholderPage from './components/PlaceholderPage';
import './App.css';

export default function App() {
  // Initialize state from localStorage or default to 'stateLanding'
  const [currentPage, setCurrentPage] = useState(() => {
    return localStorage.getItem('currentPage') || 'stateLanding';
  });

  const handleNavigation = (page) => {
    setCurrentPage(page);
    // Save the current page to localStorage
    localStorage.setItem('currentPage', page);
  };

  // Optional: Save to localStorage whenever currentPage changes
  useEffect(() => {
    localStorage.setItem('currentPage', currentPage);
  }, [currentPage]);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'sstSearch':
        return <SSTSearch onNavigate={handleNavigation} />;
      case 'findTransactions':
        return <FindTransactions onNavigate={handleNavigation} />;
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigation} />;
      case 'reports':
        return <PlaceholderPage title="View Reports" onNavigate={handleNavigation} />;
      case 'admin':
        return <PlaceholderPage title="Administration" onNavigate={handleNavigation} />;
      case 'documents':
        return <PlaceholderPage title="Documents" onNavigate={handleNavigation} />;
      case 'stateLanding':
      default:
        return <StateLanding onNavigate={handleNavigation} />;
    }
  };

  return <div className="app">{renderCurrentPage()}</div>;
}
