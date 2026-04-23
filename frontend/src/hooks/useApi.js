import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getServices, createService } from '../api/services.api';
import { getEmployees, createEmployee } from '../api/employees.api';
import {
  getAppointments,
  getMyAppointments,
  createAppointment,
  getAvailability,
  cancelAppointment,
  updateAppointment,
} from '../api/appointments.api';

export const useServices = () => {
  return useQuery({
    queryKey: ['services'],
    queryFn: getServices,
  });
};

export const useCreateService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
};

export const useEmployees = () => {
  return useQuery({
    queryKey: ['employees'],
    queryFn: getEmployees,
  });
};

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
};

export const useAppointment = (id) =>
  useQuery({
    queryKey: ['myAppointment', id],
    queryFn: async () => {
      const appointments = await getMyAppointments();

      return appointments.find(...) || null;
        (appointment) => Number(appointment.id) === Number(id)
      );
    },
    enabled: !!id,
  });

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['myAppointments'] });
    },
  });
};

export const useMyAppointments = () =>
  useQuery({
    queryKey: ['myAppointments'],
    queryFn: getMyAppointments,
  });

export const useAppointment = (id) =>
  useQuery({
    queryKey: ['myAppointment', id],
    queryFn: async () => {
      const appointments = await getMyAppointments();
      return appointments.find((appointment) => appointment.id === id);
    },
    enabled: !!id,
  });

export const useAvailability = ({ funcionarioId, date }) =>
  useQuery({
    queryKey: ['availability', funcionarioId, date],
    queryFn: () => getAvailability({ funcionario_id: funcionarioId, data: date }),
    enabled: !!funcionarioId && !!date,
  });

export const useCancelAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['myAppointments'] });
    },
  });
};

export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateAppointment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['myAppointments'] });
    },
  });
};