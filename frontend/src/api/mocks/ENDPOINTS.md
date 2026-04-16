# Mock API Endpoints Reference

## 📋 Endpoints Disponibilizados

### Authentication (POST)

#### `POST /login`
Realiza login do usuário

**Request:**
```javascript
{
  email: string,
  senha: string
}
```

**Response:**
```javascript
{
  dados: {
    token: string,
    usuario: {
      id: string,
      nome: string,
      email: string,
      tipo: 'admin' | 'employee' | 'customer',
      telefone: string,
      createdAt: ISO8601
    }
  }
}
```

---

#### `POST /register`
Cria nova conta de usuário

**Request:**
```javascript
{
  nome: string,
  email: string,
  senha: string
}
```

**Response:**
```javascript
{
  dados: {
    usuario: { /* usuario object */ }
  }
}
```

---

### Employees (funcionários)

#### `GET /employees`
Lista todos os funcionários

**Response:**
```javascript
{
  dados: Array<{
    id: string,
    nome: string,
    email: string,
    especialidade: string,
    telefone: string,
    ativo: boolean,
    createdAt: ISO8601
  }>
}
```

---

#### `POST /employees`
Cria novo funcionário

**Request:**
```javascript
{
  nome: string,
  email: string,
  especialidade?: string,
  telefone?: string
}
```

**Response:**
```javascript
{
  dados: { /* employee object */ }
}
```

---

### Services (serviços)

#### `GET /services`
Lista todos os serviços

**Response:**
```javascript
{
  dados: Array<{
    id: string,
    nome: string,
    descricao: string,
    preco: number,
    duracao: number, // em minutos
    ativo: boolean,
    createdAt: ISO8601
  }>
}
```

---

#### `POST /services`
Cria novo serviço

**Request:**
```javascript
{
  nome: string,
  descricao?: string,
  preco: number,
  duracao?: number // padrão: 30
}
```

**Response:**
```javascript
{
  dados: { /* service object */ }
}
```

---

### Appointments (agendamentos)

#### `GET /appointments`
Lista todos os agendamentos

**Response:**
```javascript
{
  dados: Array<{
    id: string,
    usuarioId: string,
    funcionarioId: string,
    servicoId: string,
    dataHora: ISO8601,
    status: 'pendente' | 'confirmado' | 'cancelado' | 'concluído',
    notas: string,
    createdAt: ISO8601
  }>
}
```

---

#### `GET /my-appointments`
Lista agendamentos do usuário logado

**Response:**
```javascript
{
  dados: Array<{ /* appointment objects */ }>
}
```

---

#### `POST /appointments`
Cria novo agendamento

**Request:**
```javascript
{
  funcionarioId: string,
  servicoId: string,
  dataHora: ISO8601
}
```

**Response:**
```javascript
{
  dados: { /* appointment object */ }
}
```

---

### Business Hours (horário comercial)

#### `GET /business-hours`
Retorna horário de funcionamento

**Response:**
```javascript
{
  dados: Array<{
    id: string,
    diaSemana: number, // 0-6 (domingo-sábado)
    horaAbertura: string, // "HH:MM"
    horaFechamento: string, // "HH:MM"
    ativo: boolean
  }>
}
```

---

### Time Slots (horários disponíveis)

#### `POST /time-slots`
Retorna horários disponíveis para um funcionário em uma data

**Request:**
```javascript
{
  data: ISO8601, // Data para buscar horários
  funcionarioId: string,
  servicoId: string // para considerar duração do serviço
}
```

**Response:**
```javascript
{
  dados: Array<{
    id: string,
    horaInicio: ISO8601,
    disponivel: boolean
  }>
}
```

---

## 🔧 Como Adicionar Novo Endpoint

### Passo 1: Criar dados mock em `mockData.js`
```javascript
export const mockNovoDado = [
  { id: '1', nome: 'Item 1' },
  // ...
];
```

### Passo 2: Criar handler em `mockHandlers.js`
```javascript
getNovoDado: async () => {
  await delay();
  simulateError(0);
  return {
    dados: mockNovoDado,
  };
}
```

### Passo 3: Registrar rota em `axios.js`

**Para GET:**
```javascript
} else if (url === '/novo-endpoint') {
  mockResponse = await mockHandlers.getNovoDado();
}
```

**Para POST:**
```javascript
if (url === '/novo-endpoint') {
  mockResponse = await mockHandlers.createNovoDado(config.data);
}
```

### Passo 4: Usar normalmente no código
```javascript
import api from './api/axios';

const response = await api.get('/novo-endpoint');
// Funciona em DEV_MODE e com backend real!
```

---

## 📊 Dados Mock Padrão

### Usuário Logado
- **Email**: `admin@example.com`
- **Senha**: `password123`
- **Tipo**: admin
- **Nome**: João Silva

### Horário de Funcionamento
- **Segunda a Sexta**: 09:00 - 18:00
- **Sábado**: 10:00 - 16:00
- **Domingo**: Fechado

---

## 🎯 Casos de Uso

### Simular Erro
Para testar tratamento de erros, ajuste em `mockHandlers.js`:
```javascript
simulateError(0.1); // 10% de chance de erro
```

### Aumentar Latência
Em `.env`:
```
VITE_MOCK_DELAY=800
```

### Adicionar Validação
```javascript
if (!email.includes('@')) {
  throw { response: { data: { erro: 'Email inválido' } } };
}
```

---

## ✅ Checklist de Testes

- [ ] Login funciona (@admin com password123)
- [ ] Acesso irrestrito a rotas protegidas
- [ ] Listar funcionários
- [ ] Listar serviços
- [ ] Listar agendamentos
- [ ] Criar agendamento
- [ ] Horário comercial é exibido
- [ ] Horários disponíveis aparecem

Pronto! Todos os endpoints estão prontos para testes. 🎉
