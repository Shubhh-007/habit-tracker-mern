// Centralized API configuration
// This pulls from Vite environment variables for production, and defaults to localhost for development if not set.
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
