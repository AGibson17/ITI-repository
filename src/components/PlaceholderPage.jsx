import React from 'react';
import { getStateAssetPath, getAssetPath } from '../utils/paths';
import { useStateContext } from '../context/useStateContext';
import '../styles/defaultStyles.css';

const PlaceholderPage = ({ title, onNavigate }) => {
  const { stateConfig } = useStateContext();

  const handleBackToDashboard = () => {
    onNavigate('dashboard');
  };

  // Header style with conditional background image or color
  const getHeaderStyle = () => {
    if (stateConfig?.assets?.bgHeaderImage) {
      return {
        backgroundImage: `url(${getAssetPath(stateConfig.assets.bgHeaderImage)})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        padding: 0,
        margin: 0
      };
    } else {
      return {
        backgroundColor: stateConfig?.colors?.secondary || '#1e4a6b',
        padding: 0,
        margin: 0
      };
    }
  };

  return (
    <div style={{ 
      maxWidth: '1024px', 
      margin: '0 auto', 
      backgroundColor: 'white',
      fontFamily: 'Arial, sans-serif',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={getHeaderStyle()}>
        <img
          src={getStateAssetPath(stateConfig?.assets?.pageHeaderImage || 'header-short.png')}
          alt={`${stateConfig?.fullName || 'CA'} DMV Header`}
          style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'contain' }}
        />
      </div>

      {/* Red Banner */}
      <div style={{
        backgroundColor: stateConfig?.colors?.accent || '#c00',
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
        padding: '10px',
        fontSize: '14px',
        borderTop: '3px solid white'
      }}>
        ~ YOU ARE CURRENTLY LOGGED IN ~
      </div>

      {/* Content */}
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: 'bold', 
          color: stateConfig?.colors?.secondary || '#1e4a6b', 
          marginBottom: '20px',
          textTransform: 'uppercase'
        }}>
          {title}
        </h1>
        
        <div style={{
          backgroundColor: '#f8f9fa',
          border: '2px solid #e9ecef',
          borderRadius: '8px',
          padding: '40px',
          margin: '20px auto',
          maxWidth: '600px'
        }}>
          <h2 style={{ 
            fontSize: '24px', 
            color: stateConfig?.colors?.text || '#666', 
            marginBottom: '20px' 
          }}>
            Coming Soon
          </h2>
          <p style={{ 
            fontSize: '16px', 
            color: stateConfig?.colors?.text || '#666', 
            marginBottom: '30px',
            lineHeight: '1.5'
          }}>
            This feature is currently under development and will be available in a future release.
          </p>
          
          <button
            onClick={handleBackToDashboard}
            style={{
              backgroundColor: stateConfig?.colors?.primary || '#26608f',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              fontSize: '16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              textTransform: 'uppercase'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = stateConfig?.colors?.secondary || '#1e4a6b'}
            onMouseOut={(e) => e.target.style.backgroundColor = stateConfig?.colors?.primary || '#26608f'}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaceholderPage;
