# DEV MODE - Guia de Implementação

## 📋 Visão Geral

O **DEV_MODE** permite desenvolvimento do frontend sem qualquer dependência do backend. Todos os serviços de API são automaticamente mockados com dados realistas.

## 🎯 O que foi implementado

### 1. **Configuração Global**
- **Arquivo**: `src/config/devMode.js`
- **Flag**: `DEV_MODE` (true/false)
- **Função**: Controla se o app usa APIs reais ou mocks

### 2. **Mocks de API**
- **Dados**: `src/api/mocks/mockData.js`
  - Usuários
  - Funcionários
  - Serviços
  - Agendamentos
  - Horário comercial
  - Horários disponíveis

- **Handlers**: `src/api/mocks/mockHandlers.js`
  - Simula latência de rede (300ms)
  - Retorna respostas realistas
  - Valida dados de entrada

### 3. **Interceptor Axios Melhorado**
- **Arquivo**: `src/api/axios.js`
- **Funcionalidade**:
  - Intercepta requisições HTTP
  - Roteia para mock handlers quando DEV_MODE=true
  - Preserva funcionalidade normal quando DEV_MODE=false

### 4. **Autenticação Automática**
- **Arquivo**: `src/features/auth/context/AuthContext.jsx`
- **Funcionalidade**:
  - Auto-login ao iniciar o app em DEV_MODE
  - Email: `admin@example.com`
  - Senha: `password123`
  - Sem bloqueio de rotas protegidas

### 5. **Indicador Visual**
- **Arquivo**: `src/components/layout/DevModeIndicator.jsx`
- **Função**: Mostra banner amarelo alertando que DEV_MODE está ativo

## 🚀 Como Usar

### Ativar DEV_MODE

1. Abra `src/config/devMode.js`
2. Altere:
   ```javascript
   export const DEV_MODE = true; // TOGGLE HERE
   ```
3. Salve o arquivo
4. O app será recarregado automaticamente (com hot reload)

### Desativar DEV_MODE

1. Altere em `src/config/devMode.js`:
   ```javascript
   export const DEV_MODE = false; // TOGGLE HERE
   ```
2. O app funcionará normalmente com o backend

## 📊 Dados Mock Disponíveis

### Usuário Logado
```javascript
{
  id: '1',
  nome: 'João Silva',
  email: 'admin@example.com',
  tipo: 'admin',
  telefone: '(11) 98765-4321'
}
```

### Funcionários (3 exemplos)
- Maria Santos - Corte
- Carlos Oliveira - Barba
- Ana Costa - Coloração

### Serviços (4 exemplos)
- Corte Simples - R$50
- Corte com Barba - R$80
- Coloração - R$120
- Hidratação Profunda - R$75

### Agendamentos (3 exemplos)
- Horários variados (próximas 24-48h)
- Status: confirmado/pendente
- Associados ao usuário logado

## 🔧 Adicionar Novos Mocks

### Exemplo: Novo Endpoint

1. **Adicione o handler em `mockHandlers.js`**:
```javascript
getProfile: async () => {
  await delay(300);
  return {
    dados: mockUser,
  };
}
```

2. **Adicione a rota em `axios.js`**:
```javascript
} else if (url === '/profile') {
  mockResponse = await mockHandlers.getProfile();
}
```

3. **Use normalmente no código**:
```javascript
const response = await api.get('/profile');
// Funcionará em DEV_MODE e com backend real!
```

## ✅ Funcionalidades Testadas

Com DEV_MODE ativo, você pode:

- ✅ Fazer login (sem validação de backend)
- ✅ Acessar todas as rotas protegidas
- ✅ Visualizar dados em Dashboard
- ✅ Listar funcionários
- ✅ Listar serviços
- ✅ Criar agendamentos
- ✅ Ver perfil do usuário
- ✅ Editar UI sem restrições

## 🛑 Limitações em DEV_MODE

1. Dados não persistem entre recarregamentos (localStorage simulado)
2. Validações são mínimas (servidor real faria validação completa)
3. Erros simulados com probabilidade 0% (configurável)
4. Sem comunicação com banco de dados real

## 📝 Estrutura de Arquivos Criados

```
frontend/src/
├── config/
│   └── devMode.js              ← Flag DEV_MODE aqui
├── api/
│   ├── axios.js                ← Interceptor modificado
│   └── mocks/
│       ├── mockData.js         ← Dados mock
│       └── mockHandlers.js     ← Handlers do mock
├── components/layout/
│   └── DevModeIndicator.jsx    ← Banner visual
└── features/auth/context/
    └── AuthContext.jsx          ← Auto-login modificado
```

## 🔐 Segurança

⚠️ **IMPORTANTE**: DEV_MODE deve ser desativado antes de passar para produção!

Confirme que `DEV_MODE = false` no arquivo `src/config/devMode.js` antes de fazer deploy.

## 🤝 Próximos Passos

1. Testar todos os endpoints mockados
2. Adicionar novos mocks conforme necessário
3. Desativar DEV_MODE quando backend estiver pronto
4. Usar ambiente (`.env`) para gerenciar DEV_MODE por ambiente

## 📞 Suporte

Se encontrar bugs ou precisar adicionar novos mocks:

1. Edite os dados em `src/api/mocks/mockData.js`
2. Adicione handlers em `src/api/mocks/mockHandlers.js`
3. Registre as rotas em `src/api/axios.js`

Pronto! 🎉
