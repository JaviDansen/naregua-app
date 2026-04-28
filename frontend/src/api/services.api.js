import api from './axios';

export const getServices = async () => {
  const response = await api.get('/services');
  return response.data.dados;
};

export const createService = async (data) => {
  const response = await api.post('/services', data);
  return response.data.dados;
};

export const updateService = async (id, data) => {
  const response = await api.put(`/services/${id}`, data);
  return response.data.dados;
};