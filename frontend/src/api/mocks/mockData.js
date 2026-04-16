/**
 * Mock Data
 * Dados realistas para desenvolvimento sem backend
 */

export const mockUser = {
  id: '1',
  nome: 'João Silva',
  email: 'admin@example.com',
  tipo: 'admin', // 'admin', 'employee', 'customer'
  telefone: '(11) 98765-4321',
  createdAt: new Date('2024-01-15').toISOString(),
};

export const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIn0.signature';

export const mockEmployees = [
  {
    id: '1',
    nome: 'Maria Santos',
    email: 'maria@example.com',
    especialidade: 'Corte',
    telefone: '(11) 99876-5432',
    ativo: true,
    createdAt: new Date('2024-01-20').toISOString(),
  },
  {
    id: '2',
    nome: 'Carlos Oliveira',
    email: 'carlos@example.com',
    especialidade: 'Barba',
    telefone: '(11) 97654-3210',
    ativo: true,
    createdAt: new Date('2024-02-10').toISOString(),
  },
  {
    id: '3',
    nome: 'Ana Costa',
    email: 'ana@example.com',
    especialidade: 'Coloração',
    telefone: '(11) 98765-0987',
    ativo: true,
    createdAt: new Date('2024-01-25').toISOString(),
  },
];

export const mockServices = [
  {
    id: '1',
    nome: 'Corte Simples',
    descricao: 'Corte de cabelo básico',
    preco: 50.00,
    duracao: 30,
    ativo: true,
    createdAt: new Date('2024-01-10').toISOString(),
  },
  {
    id: '2',
    nome: 'Corte com Barba',
    descricao: 'Corte de cabelo + barba',
    preco: 80.00,
    duracao: 45,
    ativo: true,
    createdAt: new Date('2024-01-10').toISOString(),
  },
  {
    id: '3',
    nome: 'Coloração',
    descricao: 'Tingimento de cabelo profissional',
    preco: 120.00,
    duracao: 60,
    ativo: true,
    createdAt: new Date('2024-01-12').toISOString(),
  },
  {
    id: '4',
    nome: 'Hidratação Profunda',
    descricao: 'Tratamento hidratante',
    preco: 75.00,
    duracao: 40,
    ativo: true,
    createdAt: new Date('2024-01-15').toISOString(),
  },
];

export const mockAppointments = [
  {
    id: '1',
    usuarioId: '1',
    servico_id: '1',
    funcionario_id: '1',
    servico: 'Corte Simples',
    funcionario: 'Maria Santos',
    data_hora: new Date(new Date().getTime() + 3600000).toISOString(),
    data_hora_iso: new Date(new Date().getTime() + 3600000).toISOString(),
    status: 'confirmado',
    notas: 'Cliente prefere corte curto',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    usuarioId: '1',
    servico_id: '2',
    funcionario_id: '2',
    servico: 'Corte com Barba',
    funcionario: 'Carlos Oliveira',
    data_hora: new Date(new Date().getTime() + 7200000).toISOString(),
    data_hora_iso: new Date(new Date().getTime() + 7200000).toISOString(),
    status: 'confirmado',
    notas: '',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    usuarioId: '1',
    servico_id: '3',
    funcionario_id: '3',
    servico: 'Coloração',
    funcionario: 'Ana Costa',
    data_hora: new Date(new Date().getTime() + 86400000).toISOString(),
    data_hora_iso: new Date(new Date().getTime() + 86400000).toISOString(),
    status: 'pendente',
    notas: 'Primeira vez com esse profissional',
    createdAt: new Date().toISOString(),
  },
];

export const mockBusinessHours = [
  { id: '1', diaSemana: 1, horaAbertura: '09:00', horaFechamento: '18:00', ativo: true }, // Segunda
  { id: '2', diaSemana: 2, horaAbertura: '09:00', horaFechamento: '18:00', ativo: true }, // Terça
  { id: '3', diaSemana: 3, horaAbertura: '09:00', horaFechamento: '18:00', ativo: true }, // Quarta
  { id: '4', diaSemana: 4, horaAbertura: '09:00', horaFechamento: '18:00', ativo: true }, // Quinta
  { id: '5', diaSemana: 5, horaAbertura: '09:00', horaFechamento: '18:00', ativo: true }, // Sexta
  { id: '6', diaSemana: 6, horaAbertura: '10:00', horaFechamento: '16:00', ativo: true }, // Sábado
  { id: '7', diaSemana: 0, horaAbertura: '00:00', horaFechamento: '00:00', ativo: false }, // Domingo
];

// Horários disponíveis mockados
export const generateMockTimeSlots = (date, employeeId, duration = 30) => {
  const slots = [];
  const startHour = 9;
  const endHour = 18;
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += duration) {
      const slotTime = new Date(date);
      slotTime.setHours(hour, minute, 0, 0);
      
      // Skip past times
      if (slotTime > new Date()) {
        slots.push({
          id: `${slotTime.getTime()}`,
          horaInicio: slotTime.toISOString(),
          disponivel: Math.random() > 0.3, // 70% dos horários disponíveis
        });
      }
    }
  }
  
  return slots;
};
