import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import SSTSearch from './components/SSTSearch';
import FindTransactions from './components/FindTransactions';
import StateLanding from './components/StateLanding';
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
        // Placeholder for future reports page
        return <div>Reports page - Coming Soon</div>;
      case 'admin':
        // Placeholder for future admin page
        return <div>Administration page - Coming Soon</div>;
      case 'documents':
        // Placeholder for future documents page
        return <div>Documents page - Coming Soon</div>;
      case 'stateLanding':
      default:
        return <StateLanding onNavigate={handleNavigation} />;
    }
  };

  return <div className="app">{renderCurrentPage()}</div>;
}
