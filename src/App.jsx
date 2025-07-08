import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import SSTSearch from './components/SSTSearch';
import FindTransactions from './components/FindTransactions';
import StateLanding from './components/StateLanding';
import PlaceholderPage from './components/PlaceholderPage';
import TransactionDetails from './components/TransactionDetails';
import HawaiiDataTest from './components/HawaiiDataTest';
import NewMexicoDataTest from './components/NewMexicoDataTest';
import { StateProvider } from './context/StateContext.jsx';
import './App.css';

export default function App() {
  // Initialize state from localStorage or URL parameters
  const [currentPage, setCurrentPage] = useState(() => {
    // Check URL parameters first
    const urlParams = new URLSearchParams(window.location.search);
    const pageParam = urlParams.get('page');
    if (pageParam) {
      return pageParam;
    }
    return localStorage.getItem('currentPage') || 'stateLanding';
  });
  
  // State to store transaction ID for details view
  const [selectedTransactionId, setSelectedTransactionId] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('transactionId') || null;
  });

  const handleNavigation = (page, transactionId = null) => {
    setCurrentPage(page);
    if (transactionId) {
      setSelectedTransactionId(transactionId);
    }
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
      case 'transactionDetails':
        return <TransactionDetails transactionId={selectedTransactionId} onNavigate={handleNavigation} />;
      case 'hawaiiTest':
        return <HawaiiDataTest />;
      case 'nmTest':
        return <NewMexicoDataTest />;
      case 'stateLanding':
      default:
        return <StateLanding onNavigate={handleNavigation} />;
    }
  };

  return (
    <StateProvider>
      <div className="app">{renderCurrentPage()}</div>
    </StateProvider>
  );
}
