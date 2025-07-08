import React from 'react';
import SearchResults from './SearchResults';
import { useStateContext } from '../context/useStateContext';

const NewMexicoDataTest = () => {
  const { stateConfig } = useStateContext();
  
  // Sample NM data to test the display configuration
  const sampleNMData = [
    {
      "Product": "Vehicle Renewal",
      "SST": "Albertsons Montgomery Blvd - 100", 
      "SST Trans": "30677",
      "Date": "7/4/2025 9:21:33 AM",
      "TransStatus": "Completed",
      "RequestInfo": "VIN: 1B7GG23Y2SS278624 Zip: 87105",
      "PayInfo": "Credit $52.94",
      "TransInfo": "Plate: 375KMR VIN: 1B7GG23Y2SS278624 BEATTY PATRICK L OR BEATTY TORRES-BEATTY LILLIA",
      "Vehicles": [
        {
          "Plate": "375KMR",
          "VIN": "1B7GG23Y2SS278624",
          "Owner": "BEATTY PATRICK L OR BEATTY TORRES-BEATTY LILLIA",
          "Vehicle": "2023 Honda Civic",
          "Expires": "12/31/2024",
          "Status": "Active",
          "Title": "Clear",
          "Fees": "$52.94"
        }
      ],
      "Payments": [
        {
          "PayType": "Credit",
          "Amt": "$52.94",
          "Date": "7/4/2025 9:21:33 AM"
        }
      ]
    },
    {
      "Product": "Vehicle Renewal",
      "SST": "Albertsons Montgomery Blvd - 100", 
      "SST Trans": "30678",
      "Date": "7/4/2025 10:15:22 AM",
      "TransStatus": "Incomplete",
      "RequestInfo": "VIN: 2HGCM82633A789012 Zip: 87102 CtrlNo: CTL002 Plate: DEF456",
      "PayInfo": "Check $75.50",
      "TransInfo": "Plate: DEF456 VIN: 2HGCM82633A789012 JANE SMITH",
      "Vehicles": [
        {
          "Plate": "DEF456",
          "VIN": "2HGCM82633A789012",
          "Owner": "JANE SMITH",
          "Vehicle": "2022 Toyota Camry",
          "Expires": "11/30/2024",
          "Status": "Active",
          "Title": "Clear",
          "Fees": "$75.50"
        }
      ],
      "Payments": [
        {
          "PayType": "Check",
          "Amt": "$75.50",
          "Date": "7/4/2025 10:15:22 AM"
        }
      ]
    }
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h2>New Mexico Display Configuration Test</h2>
      <p>This test shows how the NM-specific table formatting works:</p>
      
      <h3>Expected NM Table Structure:</h3>
      <p><strong>Product | SST | TransNo | Date | RequestInfo | PayInfo | TransInfo | Status</strong></p>
      
      <h4>RequestInfo Format Examples:</h4>
      <ul>
        <li>VIN and Zip: "VIN: 1B7GG23Y2SS278624 Zip: 87105"</li>
        <li>VIN, Plate, Zip: "VIN: xxx Plate: xxx Zip: xxx"</li>
        <li>Zip and CtrlNo: "Zip: xxx CtrlNo: xxx"</li>
      </ul>
      
      <h4>PayInfo Format:</h4>
      <ul>
        <li>PayType and Amt: "Credit $52.94"</li>
      </ul>
      
      <h4>TransInfo Format:</h4>
      <ul>
        <li>Plate, VIN, Owner (unlabeled): "Plate: 375KMR VIN: 1B7GG23Y2SS278624 BEATTY PATRICK L"</li>
      </ul>
      
      <div style={{ marginTop: '30px' }}>
        <SearchResults 
          results={sampleNMData} 
          currentState="NM"
          onTransactionClick={(transaction) => {
            console.log('Transaction clicked:', transaction);
            alert('Transaction Details would open for: ' + transaction['SST Trans']);
          }}
        />
      </div>
      
      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
        <h3>Configuration Details:</h3>
        <p><strong>Current State:</strong> NM</p>
        <p><strong>Display Config Available:</strong> {stateConfig?.displayConfig ? 'Yes' : 'No'}</p>
        <p><strong>Search Results Config:</strong> {stateConfig?.displayConfig?.searchResults ? 'Yes' : 'No'}</p>
        <p><strong>Columns:</strong> {stateConfig?.displayConfig?.searchResults?.columns ? stateConfig.displayConfig.searchResults.columns.join(', ') : 'N/A'}</p>
        <p><strong>Formatting Rules:</strong> {stateConfig?.displayConfig?.searchResults?.formatting ? Object.keys(stateConfig.displayConfig.searchResults.formatting).join(', ') : 'N/A'}</p>
      </div>
    </div>
  );
};

export default NewMexicoDataTest;
