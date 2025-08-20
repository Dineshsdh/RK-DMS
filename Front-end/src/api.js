// api.js - helper for backend API calls
const API_BASE_URL = 'http://localhost:5000/api';

// Helper function for API requests
const apiRequest = async (url, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Health check
export const checkHealth = () => apiRequest('/health');

// Invoice API functions
export const fetchInvoices = (page = 1, limit = 10) => 
  apiRequest(`/invoices?page=${page}&limit=${limit}`);

export const fetchInvoiceById = (id) => 
  apiRequest(`/invoices/${id}`);

export const createInvoice = (data) => 
  apiRequest('/invoices', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updateInvoice = (id, data) => 
  apiRequest(`/invoices/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const deleteInvoice = (id) => 
  apiRequest(`/invoices/${id}`, {
    method: 'DELETE',
  });

export const searchInvoices = (query) => 
  apiRequest(`/invoices/search/${encodeURIComponent(query)}`);

export const fetchInvoicesByDateRange = (startDate, endDate) => 
  apiRequest(`/invoices/date-range/${startDate}/${endDate}`);

// New: Fetch invoices by status
export const fetchInvoicesByStatus = (status, page = 1, limit = 10) =>
  apiRequest(`/invoices/status/${encodeURIComponent(status)}?page=${page}&limit=${limit}`);

// Sweet API functions
export const fetchSweets = () => 
  apiRequest('/sweets');

export const fetchSweetById = (id) => 
  apiRequest(`/sweets/${id}`);

export const createSweet = (data) => 
  apiRequest('/sweets', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updateSweet = (id, data) => 
  apiRequest(`/sweets/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const deleteSweet = (id) => 
  apiRequest(`/sweets/${id}`, {
    method: 'DELETE',
  });

export const searchSweets = (query) => 
  apiRequest(`/sweets/search/${encodeURIComponent(query)}`);

// Legacy functions for backward compatibility
export { fetchInvoices as default };
