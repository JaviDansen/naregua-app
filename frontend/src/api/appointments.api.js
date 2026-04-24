import api from './axios';

export const getAppointments = async () => {
  const response = await api.get('/appointments');
  return response.data.dados;
};

export const getMyAppointments = async () => {
  const response = await api.get('/my-appointments');
  return response.data.dados;
};

export const getAvailability = async ({ funcionario_id, data, servico_id }) => {
  const response = await api.get('/availability', {
    params: { funcionario_id, data, servico_id },
  });

  return response.data.dados;
};

export const createAppointment = async (data) => {
  const response = await api.post('/appointments', data);
  return response.data.dados;
};

export const cancelAppointment = async (id) => {
  const response = await api.put(`/appointments/${id}/cancel`);
  return response.data.dados;
};

export const updateAppointment = async (id, data) => {
  const response = await api.put(`/appointments/${id}`, data);
  return response.data.dados;
};

export const completeAppointment = async (id) => {
  const response = await api.put(`/appointments/${id}/complete`);
  return response.data.dados;
};

export const noShowAppointment = async (id) => {
  const response = await api.put(`/appointments/${id}/no-show`);
  return response.data.dados;
};