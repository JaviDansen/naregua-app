import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getServices, createService, updateService } from '../api/services.api';
import { getEmployees, getAdminEmployees, createEmployee, updateEmployee } from '../api/employees.api';
import {
  getAppointments,
  getMyAppointments,
  createAppointment,
  getAvailability,
  cancelAppointment,
  updateAppointment,
  completeAppointment,
  noShowAppointment,
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

export const useUpdateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateService(id, data),
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

export const useAdminEmployees = (enabled = true) => {
  return useQuery({
    queryKey: ['employees', 'admin'],
    queryFn: getAdminEmployees,
    enabled,
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

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateEmployee(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['employees', 'admin'] });
    },
  });
};

export const useAppointments = () => {
  return useQuery({
    queryKey: ['appointments'],
    queryFn: getAppointments,
  });
};

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

export const useMyAppointments = () => {
  return useQuery({
    queryKey: ['myAppointments'],
    queryFn: getMyAppointments,
  });
};

export const useAppointment = (id) => {
  return useQuery({
    queryKey: ['myAppointment', id],
    queryFn: async () => {
      const appointments = await getMyAppointments();

      return appointments.find(
        (appointment) => Number(appointment.id) === Number(id)
      ) || null;
    },
    enabled: !!id,
  });
};

export const useAvailability = ({ funcionarioId, date, servicoId }) =>
  useQuery({
    queryKey: ['availability', funcionarioId, date, servicoId],
    queryFn: () =>
      getAvailability({
        funcionario_id: funcionarioId,
        data: date,
        servico_id: servicoId,
      }),
    enabled: !!funcionarioId && !!date && !!servicoId,
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

export const useCompleteAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: completeAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['myAppointments'] });
    },
  });
};

export const useNoShowAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: noShowAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['myAppointments'] });
    },
  });
};