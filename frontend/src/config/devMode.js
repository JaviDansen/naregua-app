/**
 * DEV_MODE Configuration
 * 
 * Set DEV_MODE = true to:
 * - Mock all API calls
 * - Bypass authentication
 * - Use fake data for all endpoints
 * 
 * Set DEV_MODE = false to use real backend
 * 
 * Pode ser configurado via:
 * 1. Arquivo .env: VITE_DEV_MODE=true
 * 2. Ou alterando direto neste arquivo (não recomendado)
 */

// Tenta ler do .env, se não houver, usa o padrão
const envDevMode = import.meta.env.VITE_DEV_MODE;
export const DEV_MODE = envDevMode !== undefined 
  ? envDevMode === 'true' 
  : true; // TOGGLE HERE (fallback)

export const devConfig = {
  enableMocks: DEV_MODE,
  mockDelay: parseInt(import.meta.env.VITE_MOCK_DELAY || '300'), // Simula latência de rede em ms
  autoLoginEmail: 'admin@example.com',
  autoLoginPassword: 'password123'
};

export default devConfig;

