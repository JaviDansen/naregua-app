import api from './axios';

export const getAppointments = async () => {
  const response = await api.get('/appointments');
  return response.data.dados;
};

export const getMyAppointments = async () => {
  const response = await api.get('/my-appointments');
  return response.data.dados;
};

export const createAppointment = async (data) => {
  const response = await api.post('/appointments', data);
  return response.data.dados;
};