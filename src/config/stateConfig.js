/**
 * State Configuration System
 * Centralized configuration for multi-state support
 */

export const STATE_CONFIGS = {
  CA: {
    code: "CA",
    name: "California",
    fullName: "California",
    isActive: true,
    colors: {
      primary: "#37A7E0", // Blue header
      secondary: "#17456D", // Form elements
      accent: "#c00", // Red bar
      text: "#26608F",
      background: "#ffffff",
    },
    terminology: {
      sst: "SST",
      transaction: "Transaction",
      vehicle: "Vehicle",
      renewal: "Renewal",
      plate: "Plate",
      vin: "VIN",
      department: "DMV",
    },
    assets: {
      dashboardHeaderImage: "images/CA/header-short.png", // Dashboard-specific header
      pageHeaderImage: "images/CA/text.png", // Page headers with colored background
      logoPath: "images/CA/",
      welcomeImage: "images/CA/welcome.png",
      adminImage: "images/CA/admin.png",
      documentsImage: "images/CA/documents.png",
      findTransactionsImage: "images/CA/find-transactions.png",
      showReportBtn: "images/CA/btn-ShowReport.png",
      viewReportsImage: "images/CA/view-reports.png",
    },
    dataFiles: {
      mainScenarios: "TransData/CA/CA_Main_Scenarios.json",
      auxScenarios: "TransData/CA/NIRD_Scenarios.json", // CA uses NIRD data as auxiliary
      historicalTransactions: "TransData/CA/Historical_Transactions.json",
    },
    features: {
      hasAuxiliaryData: true, // CA has NIRD auxiliary data
      hasHistoricalData: true,
      hasVIPSearch: true,
      hasDLNSearch: false,
      defaultSearchType: "sst-dates", // CA defaults to SST/Dates search
    },
    vehicleDataSchema: {
      // Define the vehicle data structure for California
      fields: [
        { key: "Plate", label: "Plate", type: "string", required: true },
        { key: "Expires", label: "Expires", type: "date", required: true },
        { key: "VIN", label: "VIN", type: "string", required: true },
        { key: "Vehicle", label: "Vehicle", type: "string", required: true },
        { key: "Owner", label: "Owner", type: "string", required: true },
        { key: "Fees", label: "Fees", type: "currency", required: true },
        {
          key: "Contact Info",
          label: "Contact Info",
          type: "string",
          required: true,
        },
        {
          key: "Renew Type",
          label: "Renew Type",
          type: "string",
          required: true,
        },
      ],
      // Additional CA-specific vehicle fields that may be present
      optionalFields: [
        { key: "Status", label: "Status", type: "string" },
        { key: "Title", label: "Title", type: "string" },
      ],
    },
  },

  CO: {
    code: "CO",
    name: "Colorado",
    fullName: "Colorado",
    isActive: false, // Will be activated when data is ready
    colors: {
      primary: "#1e4a6b", // Different blue
      secondary: "#2563eb",
      accent: "#c00", // Shared red bar
      text: "#000",
      background: "#ffffff",
    },
    terminology: {
      sst: "SST", // Different terminology
      transaction: "Transaction",
      vehicle: "Vehicle",
      renewal: "Renewal",
      plate: "License Plate",
      vin: "VIN",
      department: "Motor Vehicle",
    },
    assets: {
      dashboardHeaderImage: "images/CO/header-short.png", // Dashboard-specific header
      pageHeaderImage: "images/CO/text.png", // Page headers with colored background
      logoPath: "images/CO/",
      welcomeImage: "images/CO/welcome.png",
      adminImage: "images/CO/admin.png",
      documentsImage: "images/CO/documents.png",
      findTransactionsImage: "images/CO/find-transactions.png",
      viewReportsImage: "images/CO/view-reports.png",
      showReportBtn: "images/CO/btn-ShowReport.png",
    },
    dataFiles: {
      mainScenarios: "TransData/CO/CO_Main_Scenarios.json",
      auxScenarios: "TransData/CO/auxiliary_transData.json", // CO auxiliary data
      historicalTransactions: "TransData/CO/Historical_Transactions.json",
    },
    features: {
      hasAuxiliaryData: true, // CO has auxiliary transaction data
      hasHistoricalData: true,
      hasVIPSearch: true,
      hasDLNSearch: true,
      defaultSearchType: "sst-dates", // CO defaults to SST/Dates search
    },
  },

  FL: {
    code: "FL",
    name: "Florida",
    fullName: "Florida",
    isActive: false,
    colors: {
      primary: "#0066cc",
      secondary: "#0052a3",
      accent: "#c00",
      text: "#000",
      background: "#ffffff",
    },
    terminology: {
      sst: "SST",
      transaction: "Service",
      vehicle: "Motor Vehicle",
      renewal: "Renewal",
      plate: "Tag",
      vin: "VIN",
      department: "Tax Collector",
    },
    assets: {
      dashboardHeaderImage: "images/FL/header-short.png", // Dashboard-specific header
      pageHeaderImage: "images/FL/text.png", // Page headers with colored background
      logoPath: "images/FL/",
      welcomeImage: "images/FL/welcome.png",
      adminImage: "images/FL/admin.png",
      documentsImage: "images/FL/documents.png",
      findTransactionsImage: "images/FL/find-transactions.png",
      viewReportsImage: "images/FL/view-reports.png",
      showReportBtn: "images/FL/btn-ShowReport.png",
    },
    dataFiles: {
      mainScenarios: "TransData/FL/FL_Main_Scenarios.json",
      auxScenarios: "TransData/FL/auxiliary_transData.json", // FL auxiliary data
      historicalTransactions: "TransData/FL/Historical_Transactions.json",
    },
    features: {
      hasAuxiliaryData: true, // FL has auxiliary transaction data
      hasHistoricalData: true,
      hasVIPSearch: false,
      hasDLNSearch: true,
      defaultSearchType: "sst-dates", // FL defaults to SST/Dates search
    },
  },

  MI: {
    code: "MI",
    name: "Michigan",
    fullName: "Michigan",
    isActive: true,
    colors: {
      primary: "#133660",
      secondary: "#18355E",
      accent: "#c00",
      text: "#000",
      background: "#ffffff",
    },
    terminology: {
      sst: "SST",
      transaction: "Transaction",
      vehicle: "Vehicle",
      renewal: "Renewal",
      plate: "Plate",
      vin: "VIN",
      department: "Secretary of State",
    },
    assets: {
      dashboardHeaderImage: "images/MI/header-short.png", // Dashboard-specific header
      pageHeaderImage: "images/MI/text.png", // Page headers with colored background
      logoPath: "images/MI/",
      welcomeImage: "images/MI/welcome.png",
      adminImage: "images/MI/admin.png",
      documentsImage: "images/MI/documents.png",
      findTransactionsImage: "images/MI/find-transactions.png",
      viewReportsImage: "images/MI/view-reports.png",
      showReportBtn: "images/MI/btn-ShowReport.png",
    },
    dataFiles: {
      mainScenarios: "TransData/MI/MI_Main_Scenarios.json",
      auxScenarios: null,
      historicalTransactions: "TransData/MI/Historical_Transactions.json",
    },
    features: {
      hasAuxiliaryData: false,
      hasHistoricalData: true,
      hasVIPSearch: true,
      hasDLNSearch: false,
      defaultSearchType: "plate", // MI defaults to Plate search
    },
  },

  HI: {
    code: "HI",
    name: "Hawaii",
    fullName: "Hawaii",
    isActive: true,
    colors: {
      primary: "#0F6D97",
      secondary: "#17456D",
      accent: "#c00",
      text: "#007A97",
      background: "#ffffff",
    },
    terminology: {
      sst: "SST",
      transaction: "Transaction",
      vehicle: "Vehicle",
      renewal: "Renewal",
      plate: "Plate",
      vin: "VIN",
      department: "DMV",
    },
    assets: {
      dashboardHeaderImage: "images/HI/header-short.png", // Dashboard-specific header
      pageHeaderImage: "images/HI/text.png", // Page headers with colored background
      logoPath: "images/HI/",
      welcomeImage: "images/HI/welcome.png",
      adminImage: "images/HI/admin.png",
      documentsImage: "images/HI/documents.png",
      findTransactionsImage: "images/HI/find-transactions.png",
      viewReportsImage: "images/HI/view-reports.png",
      showReportBtn: "images/HI/btn-ShowReport.png", // HI-specific Show Report button
    },

    dataFiles: {
      mainScenarios: "TransData/HI/HI-main-scenarios.json",
      auxScenarios: "TransData/HI/HI-aux-scenarios.json",
      historicalTransactions: "TransData/HI/HI_Historical_Transactions.json",
    },
    features: {
      hasAuxiliaryData: true,
      hasHistoricalData: true,
      hasVIPSearch: true,
      hasDLNSearch: false,
      defaultSearchType: "plate", // HI defaults to Plate search
    },
    vehicleDataSchema: {
      // Define the vehicle data structure for Hawaii
      fields: [
        { key: "Plate", label: "Plate", type: "string", required: true },
        { key: "Expires", label: "Expires", type: "date", required: true },
        { key: "VIN", label: "VIN", type: "string", required: true },
        { key: "Vehicle", label: "Vehicle", type: "string", required: true },
        { key: "Owner", label: "Owner", type: "string", required: true },
        { key: "Fees", label: "Fees", type: "currency", required: true },
        { key: "Status", label: "Status", type: "string", required: true },
        { key: "Title", label: "Title", type: "string", required: true },
        {
          key: "InspectionDate",
          label: "Inspection Date",
          type: "date",
          required: true,
        },
        {
          key: "FailedInspection",
          label: "Failed Inspection",
          type: "boolean",
          required: true,
        },
      ],
      // Optional fields that may be present (Hawaii has variation in contact field names)
      optionalFields: [
        { key: "Contact Info", label: "Contact Info", type: "string" },
        { key: "ContactInfo", label: "Contact Info", type: "string" },
        { key: "Renew Type", label: "Renew Type", type: "string" },
      ],
    },
  },

  NM: {
    code: "NM",
    name: "New Mexico",
    fullName: "New Mexico",
    isActive: true,
    colors: {
      primary: "#00A4AC",
      secondary: "#13A5AB",
      accent: "#c00",
      text: "#000",
      background: "#ffffff",
    },
    terminology: {
      sst: "SST",
      transaction: "Transaction",
      vehicle: "Vehicle",
      renewal: "Renewal",
      plate: "Plate",
      vin: "VIN",
      department: "MVD",
    },
    assets: {
      dashboardHeaderImage: "images/NM/header-short.png", // Dashboard-specific header
      pageHeaderImage: "images/NM/text.png", // Page headers with colored background
      logoPath: "images/NM/",
      welcomeImage: "images/NM/welcome.png",
      adminImage: "images/NM/admin.png",
      documentsImage: "images/NM/documents.png",
      findTransactionsImage: "images/NM/find-transactions.png",
      viewReportsImage: "images/NM/view-reports.png",
      showReportBtn: "images/NM/btn-ShowReport.png", // NM-specific Show Report button
    },

    dataFiles: {
      mainScenarios: "TransData/NM/NM-main-scenarios.json",
      auxScenarios: "TransData/NM/NM-aux-scenarios.json",
      historicalTransactions: "TransData/NM/NM_Historical_Transactions.json",
    },
    features: {
      hasAuxiliaryData: true,
      hasHistoricalData: true,
      hasVIPSearch: false,
      hasDLNSearch: false,
      defaultSearchType: "plate", // NM defaults to Plate search

      vehicleDataSchema: {
        // Define the vehicle data structure for New Mexico
        fields: [
          { key: "Plate", label: "Plate", type: "string", required: true },
          { key: "Expires", label: "Expires", type: "date", required: true },
          { key: "VIN", label: "VIN", type: "string", required: true },
          { key: "Vehicle", label: "Vehicle", type: "string", required: true },
          { key: "Owner", label: "Owner", type: "string", required: true },
          { key: "Fees", label: "Fees", type: "currency", required: true },
          { key: "Status", label: "Status", type: "string", required: true },
          { key: "Title", label: "Title", type: "string", required: true },
          {
            key: "InspectionDate",
            label: "Inspection Date",
            type: "date",
            required: false,
          },
          {
            key: "FailedInspection",
            label: "Failed Inspection",
            type: "boolean",
            required: false,
          },
        ],

        optionalFields: [
          { key: "Contact Info", label: "Contact Info", type: "string" },
          { key: "ContactInfo", label: "Contact Info", type: "string" },
          { key: "Renew Type", label: "Renew Type", type: "string" },
        ],
      },
    },
  },

  OH: {
    code: "OH",
    name: "Ohio",
    fullName: "Ohio",
    isActive: true,
    colors: {
      primary: "#13A5AB",
      secondary: "#174599",
      accent: "#c00",
      text: "#2D5CA8",
      background: "#ffffff",
    },
    terminology: {
      sst: "SST",
      transaction: "Transaction",
      vehicle: "Vehicle",
      renewal: "Renewal",
      plate: "Plate",
      vin: "VIN",
      department: "BMV",
    },
    assets: {
      dashboardHeaderImage: "images/OH/header-short.png", // Dashboard-specific header
      pageHeaderImage: "images/OH/text.png", // Page headers with colored background
      logoPath: "images/OH/",
      welcomeImage: "images/OH/welcome.png",
      adminImage: "images/OH/admin.png",
      documentsImage: "images/OH/documents.png",
      findTransactionsImage: "images/OH/find-transactions.png",
      viewReportsImage: "images/OH/view-reports.png",
      showReportBtn: "images/OH/btn-ShowReport.png",
      bgHeaderImage: "images/OH/background.png", // OH-specific background header
    },

    dataFiles: {
      mainScenarios: "TransData/OH/OH-main-scenarios.json",
      auxScenarios: "TransData/OH/OH-aux-scenarios.json",
      historicalTransactions: "TransData/OH/OH_Historical_Transactions.json",
    },
    features: {
      hasAuxiliaryData: true,
      hasHistoricalData: true,
      hasVIPSearch: false,
      hasDLNSearch: true,
      defaultSearchType: "plate", // OH defaults to Plate search

      vehicleDataSchema: {
        // Define the vehicle data structure for Ohio
        fields: [
          { key: "Plate", label: "Plate", type: "string", required: true },
          { key: "Expires", label: "Expires", type: "date", required: true },
          { key: "VIN", label: "VIN", type: "string", required: true },
          { key: "Vehicle", label: "Vehicle", type: "string", required: true },
          { key: "Owner", label: "Owner", type: "string", required: true },
          { key: "Fees", label: "Fees", type: "currency", required: true },
          { key: "Status", label: "Status", type: "string", required: true },
          { key: "Title", label: "Title", type: "string", required: true },
          {
            key: "InspectionDate",
            label: "Inspection Date",
            type: "date",
            required: false,
          },
          {
            key: "FailedInspection",
            label: "Failed Inspection",
            type: "boolean",
            required: false,
          },
        ],

        optionalFields: [
          { key: "Contact Info", label: "Contact Info", type: "string" },
          { key: "ContactInfo", label: "Contact Info", type: "string" },
          { key: "Renew Type", label: "Renew Type", type: "string" },
        ],
      },
    },
  },
};

/**
 * Get configuration for a specific state
 * @param {string} stateCode - Two-letter state code
 * @returns {Object} State configuration object
 */
export const getStateConfig = (stateCode) => {
  return STATE_CONFIGS[stateCode?.toUpperCase()] || null;
};

/**
 * Get all active states
 * @returns {Array} Array of active state configurations
 */
export const getActiveStates = () => {
  return Object.values(STATE_CONFIGS).filter((state) => state.isActive);
};

/**
 * Get all available states (active and inactive)
 * @returns {Array} Array of all state configurations
 */
export const getAllStates = () => {
  return Object.values(STATE_CONFIGS);
};

/**
 * Check if a state is active
 * @param {string} stateCode - Two-letter state code
 * @returns {boolean} True if state is active
 */
export const isStateActive = (stateCode) => {
  const config = getStateConfig(stateCode);
  return config ? config.isActive : false;
};

/**
 * Activate a state (used when adding new state support)
 * @param {string} stateCode - Two-letter state code
 */
export const activateState = (stateCode) => {
  const config = getStateConfig(stateCode);
  if (config) {
    config.isActive = true;
  }
};
