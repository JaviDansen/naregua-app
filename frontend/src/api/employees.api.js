import api from './axios';

export const getEmployees = async () => {
  const response = await api.get('/employees');
  return response.data.dados;
};

export const createEmployee = async (data) => {
  const response = await api.post('/employees', data);
  return response.data.dados;
};