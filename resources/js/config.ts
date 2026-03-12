

const IMAGE_URL = "http://localhost:8001/storage/";

const DEFAULT_API = "";

// Get API URL from localStorage or use default
export const getAPI = (): string => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('apiUrl') || DEFAULT_API;
  }
  return DEFAULT_API;
};

// Set API URL in localStorage
export const setAPI = (url: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('apiUrl', url);
  }
};

// Export the current API URL
export const API = getAPI();