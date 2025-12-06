// API Configuration
// Update this file when your backend host changes

export const API_CONFIG = {
  // Base URL for the backend API
  BASE_URL: 'http://localhost:3000',
  
  // API version prefix
  API_VERSION: '/api/v1',
  
  // Full API base URL
  get API_BASE() {
    return `${this.BASE_URL}${this.API_VERSION}`;
  },
};

// API Endpoints
export const API_ENDPOINTS = {
  // Video/Watch endpoints
  VIDEO: {
    GET: (token: string) => `${API_CONFIG.API_BASE}/video/${token}`,
  },
  
  // Track endpoints (for video watching)
  TRACK: {
    START: `${API_CONFIG.API_BASE}/track/start`,
    COMPLETE: `${API_CONFIG.API_BASE}/track/complete`,
  },
  
  // Ad management endpoints
  AD: {
    LIST: `${API_CONFIG.API_BASE}/ad/list`,
    CREATE: `${API_CONFIG.API_BASE}/ad/create`,
    APPROVE: `${API_CONFIG.API_BASE}/ad/approve`,
    UPDATE: (adId: string) => `${API_CONFIG.API_BASE}/ad/${adId}`,
  },
  
  // Marketer endpoints
  MARKETER: {
    LIST: `${API_CONFIG.API_BASE}/marketer`,
    CREATE: `${API_CONFIG.API_BASE}/marketer/create`,
    GET: (id: string) => `${API_CONFIG.API_BASE}/marketer/${id}`,
    UPDATE: (id: string) => `${API_CONFIG.API_BASE}/marketer/${id}`,
  },
  
  // Budget endpoints
  BUDGET: {
    TOPUP: `${API_CONFIG.API_BASE}/budget/topup`,
    DEDUCT: `${API_CONFIG.API_BASE}/budget/deduct`,
    TRANSACTIONS: (marketerId: string) => `${API_CONFIG.API_BASE}/budget/${marketerId}/transactions`,
  },
  
  // Analytics endpoints
  ANALYTICS: {
    ADS: `${API_CONFIG.API_BASE}/analytics/ads`,
    MARKETERS: `${API_CONFIG.API_BASE}/analytics/marketers`,
    AUDITS: `${API_CONFIG.API_BASE}/analytics/audits`,
    WATCH_LINKS: `${API_CONFIG.API_BASE}/analytics/watch-links`,
    AD_DETAIL: (adId: string) => `${API_CONFIG.API_BASE}/analytics/ad/${adId}/detail`,
    AD_USERS: (adId: string) => `${API_CONFIG.API_BASE}/analytics/ad/${adId}/users`,
    USER_DETAIL: (msisdn: string) => `${API_CONFIG.API_BASE}/analytics/user/${msisdn}/detail`,
  },
};

export default API_CONFIG;
