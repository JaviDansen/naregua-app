import api from './axios';

export const login = async (data) => {
  const response = await api.post('/login', data);
  return response.data.dados;
};

export const register = async (data) => {
  const response = await api.post('/register', data);
  return response.data.dados;
};