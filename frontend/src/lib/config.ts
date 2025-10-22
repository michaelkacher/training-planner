export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  apiVersion: 'v1',
};

export const API_BASE_URL = `${config.apiUrl}/api/${config.apiVersion}`;
