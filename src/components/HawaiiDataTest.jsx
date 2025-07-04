/**
 * Hawaii Data Test Component
 * Quick test to verify Hawaii data loading and vehicle schema
 */

import React, { useState, useEffect } from 'react';
import { loadStateTransactionData } from '../utils/genericTransactionDataLoader';
import { getStateConfig } from '../config/stateConfig';
import { getVehicleTableHeaders } from '../utils/vehicleDataUtils';

const HawaiiDataTest = () => {
  const [hawaiiData, setHawaiiData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [testResults, setTestResults] = useState([]);

  const runTests = async () => {
    setLoading(true);
    setError(null);
    const results = [];

    try {
      // Test 1: Load Hawaii state configuration
      const hawaiiConfig = getStateConfig('HI');
      results.push({
        test: 'Hawaii State Config',
        status: hawaiiConfig ? 'PASS' : 'FAIL',
        details: hawaiiConfig ? `Found HI config, isActive: ${hawaiiConfig.isActive}` : 'No HI config found'
      });

      // Test 2: Load Hawaii transaction data
      try {
        const data = await loadStateTransactionData('HI');
        setHawaiiData(data);
        results.push({
          test: 'Hawaii Data Loading',
          status: 'PASS',
          details: `Loaded ${data.length} transactions`
        });

        // Test 3: Check vehicle data structure
        const sampleTransaction = data.find(t => t.Vehicles && t.Vehicles.length > 0);
        if (sampleTransaction) {
          const vehicleHeaders = getVehicleTableHeaders(hawaiiConfig, sampleTransaction.Vehicles);
          results.push({
            test: 'Hawaii Vehicle Schema',
            status: 'PASS',
            details: `Found ${vehicleHeaders.length} vehicle fields: ${vehicleHeaders.map(h => h.label).join(', ')}`
          });

          // Test 4: Check for Hawaii-specific fields
          const sampleVehicle = sampleTransaction.Vehicles[0];
          const hawaiiFields = ['Status', 'Title', 'InspectionDate', 'FailedInspection'];
          const foundHawaiiFields = hawaiiFields.filter(field => Object.prototype.hasOwnProperty.call(sampleVehicle, field));
          results.push({
            test: 'Hawaii-Specific Fields',
            status: foundHawaiiFields.length > 0 ? 'PASS' : 'WARN',
            details: `Found Hawaii fields: ${foundHawaiiFields.join(', ')}`
          });
        } else {
          results.push({
            test: 'Hawaii Vehicle Schema',
            status: 'WARN',
            details: 'No transaction with vehicle data found'
          });
        }

      } catch (dataError) {
        results.push({
          test: 'Hawaii Data Loading',
          status: 'FAIL',
          details: dataError.message
        });
      }

    } catch (testError) {
      setError(testError.message);
      results.push({
        test: 'Overall Test',
        status: 'FAIL',
        details: testError.message
      });
    }

    setTestResults(results);
    setLoading(false);
  };

  useEffect(() => {
    runTests();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>Hawaii Data Integration Test</h2>
      
      {loading && <div>Running tests...</div>}
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      
      <div style={{ marginTop: '20px' }}>
        <h3>Test Results:</h3>
        {testResults.map((result, index) => (
          <div key={index} style={{ 
            padding: '10px', 
            margin: '5px 0', 
            backgroundColor: result.status === 'PASS' ? '#d4edda' : result.status === 'WARN' ? '#fff3cd' : '#f8d7da',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}>
            <strong>{result.test}:</strong> 
            <span style={{ 
              color: result.status === 'PASS' ? 'green' : result.status === 'WARN' ? 'orange' : 'red',
              marginLeft: '10px' 
            }}>
              {result.status}
            </span>
            <div style={{ fontSize: '12px', marginTop: '5px' }}>{result.details}</div>
          </div>
        ))}
      </div>

      {hawaiiData.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3>Sample Hawaii Data:</h3>
          <div style={{ backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '4px' }}>
            <pre style={{ fontSize: '12px', overflow: 'auto' }}>
              {JSON.stringify(hawaiiData[0], null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default HawaiiDataTest;
