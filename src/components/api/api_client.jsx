import { useState } from 'react';

// Central configuration
const API_BASE_URL_8080 = window.API_BASE_URL_8080;
const API_BASE_URL_8081 = window.API_BASE_URL_8081;

export const useApiClient = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Reusable request wrapper
  const request = async (endpoint, method = 'GET', body = null) => {
    setLoading(true);
    setError(null);

    const headers = {
      'Content-Type': 'application/json',
    //   'Authorization': `Bearer ${localStorage.getItem('token')}` // Example Auth
    };

    const config = {
      method,
      headers,
      ...(body && { body: JSON.stringify(body) })
    };

    try {
      const response = await fetch(`${endpoint}`, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // === ALL ENDPOINTS CONFIGURED HERE ===
  return {
    API_BASE_URL_8080,
    API_BASE_URL_8081,    
    loading,
    error,
    // Users Endpoints
    getDirectory: (name) => request(API_BASE_URL_8080 + '/filesystem/folder?name=' + name),
    getDownloadURL: (name) => request(API_BASE_URL_8081 + '/goweb/filesystem/download?name=' + name),
    getFile: (name) => request(API_BASE_URL_8080 + '/filesystem/view?name=' + name),
    deleteFile: (name) => request(API_BASE_URL_8080 + '/filesystem/delete?name=' + name),
    getUserById: (id) => request(`/users/${id}`),
    createUser: (userData) => request('/users', 'POST', userData),
    // Products Endpoints
    getProducts: () => request('/products'),
    updateProduct: (id, productData) => request(`/products/${id}`, 'PUT', productData),
    deleteProduct: (id) => request(`/products/${id}`, 'DELETE')
  };
};
export default useApiClient;