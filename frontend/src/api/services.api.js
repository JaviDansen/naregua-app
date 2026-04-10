import api from './axios';

export const getServices = () => api.get('/services');
export const createService = (data) => api.post('/services', data);