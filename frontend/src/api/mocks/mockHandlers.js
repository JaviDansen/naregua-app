/**
 * Mock API Handlers
 * Simula respostas do backend sem fazer HTTP requests
 */

import {
  mockUser,
  mockToken,
  mockEmployees,
  mockServices,
  mockAppointments,
  mockBusinessHours,
  generateMockTimeSlots,
} from './mockData';
import { devConfig } from '../../config/devMode';

// Simula um delay de rede
const delay = (ms = devConfig.mockDelay) => new Promise((resolve) => setTimeout(resolve, ms));

// Simula um erro com probabilidade
const simulateError = (errorRate = 0) => {
  if (Math.random() < errorRate) {
    throw new Error('Erro simulado no mock');
  }
};

export const mockHandlers = {
  // ==================== AUTENTICAÇÃO ====================
  login: async (data) => {
    await delay();
    simulateError(0);
    
    const { email, senha } = data;
    
    if (!email || !senha) {
      throw { response: { data: { erro: 'Email e senha são obrigatórios' } } };
    }
    
    return {
      dados: {
        token: mockToken,
        usuario: mockUser,
      },
    };
  },

  register: async (data) => {
    await delay();
    simulateError(0);
    
    const { nome, email, senha } = data;
    
    if (!nome || !email || !senha) {
      throw { response: { data: { erro: 'Todos os campos são obrigatórios' } } };
    }
    
    return {
      dados: {
        usuario: {
          id: Date.now().toString(),
          nome,
          email,
          tipo: 'customer',
          createdAt: new Date().toISOString(),
        },
      },
    };
  },

  // ==================== FUNCIONÁRIOS ====================
 getEmployees: async () => {
    await delay();
    simulateError(0);
    
    return {
      dados: mockEmployees,
    };
  },

  createEmployee: async (data) => {
    await delay();
    simulateError(0);
    
    const { nome, email, especialidade, telefone } = data;
    
    if (!nome || !email) {
      throw { response: { data: { erro: 'Nome e email obrigatórios' } } };
    }
    
    const newEmployee = {
      id: Date.now().toString(),
      nome,
      email,
      especialidade: especialidade || 'Geral',
      telefone: telefone || '',
      ativo: true,
      createdAt: new Date().toISOString(),
    };
    
    mockEmployees.push(newEmployee);
    
    return {
      dados: newEmployee,
    };
  },

  // ==================== SERVIÇOS ====================
  getServices: async () => {
    await delay();
    simulateError(0);
    
    return {
      dados: mockServices,
    };
  },

  createService: async (data) => {
    await delay();
    simulateError(0);
    
    const { nome, descricao, preco, duracao } = data;
    
    if (!nome || !preco) {
      throw { response: { data: { erro: 'Nome e preço obrigatórios' } } };
    }
    
    const newService = {
      id: Date.now().toString(),
      nome,
      descricao: descricao || '',
      preco: parseFloat(preco),
      duracao: parseInt(duracao) || 30,
      ativo: true,
      createdAt: new Date().toISOString(),
    };
    
    mockServices.push(newService);
    
    return {
      dados: newService,
    };
  },

  // ==================== COMPROMISSOS ====================
  getAppointments: async () => {
    await delay();
    simulateError(0);

    return {
      dados: mockAppointments,
    };
  },

  getMyAppointments: async () => {
    await delay();
    simulateError(0);

    return {
      dados: mockAppointments.filter((apt) => apt.usuarioId === mockUser.id),
    };
  },

  createAppointment: async (data) => {
    await delay();
    simulateError(0);

    const { funcionario_id, servico_id, data_hora } = data;

    if (!funcionario_id || !servico_id || !data_hora) {
      throw { response: { data: { erro: 'Campos obrigatórios faltando' } } };
    }

    const service = mockServices.find((s) => s.id === servico_id);
    const employee = mockEmployees.find((e) => e.id === funcionario_id);

    if (!service || !employee) {
      throw { response: { data: { erro: 'Serviço ou funcionário inválido' } } };
    }

    const newAppointment = {
      id: Date.now().toString(),
      usuarioId: mockUser.id,
      servico_id,
      funcionario_id,
      servico: service.nome,
      funcionario: employee.nome,
      data_hora,
      data_hora_iso: data_hora,
      status: 'confirmado',
      notas: '',
      createdAt: new Date().toISOString(),
    };

    mockAppointments.push(newAppointment);

    return {
      dados: newAppointment,
    };
  },

  cancelAppointment: async (id) => {
    await delay();
    simulateError(0);

    const appointment = mockAppointments.find((apt) => apt.id === id);
    if (!appointment) {
      throw { response: { data: { erro: 'Agendamento não encontrado' } } };
    }

    if (appointment.status === 'cancelado') {
      throw { response: { data: { erro: 'Agendamento já cancelado' } } };
    }

    appointment.status = 'cancelado';

    return {
      dados: appointment,
    };
  },

  updateAppointment: async (id, data) => {
    await delay();
    simulateError(0);

    const { funcionario_id, servico_id, data_hora } = data;

    if (!funcionario_id || !servico_id || !data_hora) {
      throw { response: { data: { erro: 'Campos obrigatórios faltando' } } };
    }

    const appointment = mockAppointments.find((apt) => apt.id === id);
    if (!appointment) {
      throw { response: { data: { erro: 'Agendamento não encontrado' } } };
    }

    if (appointment.status === 'cancelado') {
      throw { response: { data: { erro: 'Não é possível editar um agendamento cancelado' } } };
    }

    const service = mockServices.find((s) => s.id === servico_id);
    const employee = mockEmployees.find((e) => e.id === funcionario_id);

    if (!service || !employee) {
      throw { response: { data: { erro: 'Serviço ou funcionário inválido' } } };
    }

    appointment.servico_id = servico_id;
    appointment.funcionario_id = funcionario_id;
    appointment.servico = service.nome;
    appointment.funcionario = employee.nome;
    appointment.data_hora = data_hora;
    appointment.data_hora_iso = data_hora;

    return {
      dados: appointment,
    };
  },

  // ==================== HORÁRIO COMERCIAL ====================
  getBusinessHours: async () => {
    await delay();
    simulateError(0);

    return {
      dados: mockBusinessHours,
    };
  },

  // ==================== DISPONIBILIDADE ====================
  getAvailability: async (params) => {
    await delay();
    simulateError(0);

    const { funcionario_id, data } = params;

    if (!funcionario_id || !data) {
      throw { response: { data: { erro: 'funcionario_id e data são obrigatórios' } } };
    }

    const occupied = mockAppointments
      .filter((appt) => appt.funcionario_id === funcionario_id && appt.data_hora_iso?.startsWith(data) && appt.status !== 'cancelado')
      .map((appt) => appt.data_hora_iso.slice(11, 16));

    return {
      dados: {
        funcionario_id,
        data,
        horarios_ocupados: occupied,
      },
    };
  },
};

export default mockHandlers;
