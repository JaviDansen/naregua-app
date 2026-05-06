import api from './axios';

export const getUsers = async () => {
  const response = await api.get('/users');
  return response.data.dados;
};

export const createUser = async (data) => {
  const response = await api.post('/register', {
    ...data,
    perfil: 'usuario',
  });

  return response.data.dados;
};