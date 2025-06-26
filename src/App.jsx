import { useState } from 'react';
import Dashboard from './components/Dashboard';
import SSTSearch from './components/SSTSearch';
import './App.css';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const handleNavigation = (page) => {
    setCurrentPage(page);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'sst-search':
        return <SSTSearch onNavigate={handleNavigation} />;
      case 'reports':
        // Placeholder for future reports page
        return <div>Reports page - Coming Soon</div>;
      case 'admin':
        // Placeholder for future admin page
        return <div>Administration page - Coming Soon</div>;
      case 'documents':
        // Placeholder for future documents page
        return <div>Documents page - Coming Soon</div>;
      case 'dashboard':
      default:
        return <Dashboard onNavigate={handleNavigation} />;
    }
  };

  return <div className="app">{renderCurrentPage()}</div>;
}
