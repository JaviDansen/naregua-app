import api from './axios';

export const getEmployees = async () => {
  const response = await api.get('/employees');
  return response.data.dados;
};

export const createEmployee = async (data) => {
  const response = await api.post('/employees', data);
  return response.data.dados;
};

export const getAdminEmployees = async () => {
  const response = await api.get('/employees/admin');
  return response.data.dados;
};

export const updateEmployee = async (id, data) => {
  const response = await api.put(`/employees/${id}`, data);
  return response.data.dados;
};