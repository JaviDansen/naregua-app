import axios from 'axios';
import { DEV_MODE } from '../config/devMode';
import mockHandlers from './mocks/mockHandlers';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

const getMockResponse = async (config) => {
  const method = config.method?.toLowerCase();
  const url = config.url;

  if (method === 'post') {
    if (url === '/login') {
      return await mockHandlers.login(config.data);
    }
    if (url === '/register') {
      return await mockHandlers.register(config.data);
    }
    if (url === '/employees') {
      return await mockHandlers.createEmployee(config.data);
    }
    if (url === '/services') {
      return await mockHandlers.createService(config.data);
    }
    if (url === '/appointments') {
      return await mockHandlers.createAppointment(config.data);
    }
  }

  if (method === 'put') {
    const cancelMatch = url?.match(/^\/appointments\/(\d+)\/cancel$/);
    const editMatch = url?.match(/^\/appointments\/(\d+)$/);

    if (cancelMatch) {
      return await mockHandlers.cancelAppointment(cancelMatch[1]);
    }
    if (editMatch) {
      return await mockHandlers.updateAppointment(editMatch[1], config.data);
    }
  }

  if (method === 'get') {
    if (url === '/employees') {
      return await mockHandlers.getEmployees();
    }
    if (url === '/services') {
      return await mockHandlers.getServices();
    }
    if (url === '/appointments') {
      return await mockHandlers.getAppointments();
    }
    if (url === '/my-appointments') {
      return await mockHandlers.getMyAppointments();
    }
    if (url === '/business-hours') {
      return await mockHandlers.getBusinessHours();
    }
    if (url === '/availability') {
      return await mockHandlers.getAvailability(config.params);
    }
  }

  return null;
};

const mockAdapter = async (config) => {
  try {
    const mockResponse = await getMockResponse(config);
    if (mockResponse) {
      return {
        data: mockResponse,
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
        request: {},
      };
    }
  } catch (error) {
    return Promise.reject(error);
  }

  const defaultAdapter = axios.defaults.adapter;
  if (!defaultAdapter) {
    throw new Error('Axios adapter not found');
  }
  return defaultAdapter(config);
};

if (DEV_MODE) {
  api.defaults.adapter = mockAdapter;
}

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (!DEV_MODE) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;