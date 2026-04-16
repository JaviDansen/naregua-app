/**
 * DevModeIndicator
 * Mostra um indicador visual quando DEV_MODE está ativo
 */

import { DEV_MODE } from '../../config/devMode';

const DevModeIndicator = () => {
  if (!DEV_MODE) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-black text-center py-2 text-sm font-semibold z-50 flex justify-center items-center gap-2">
      <span>⚙️ DEV MODE ATIVO - Usando dados mock, sem conexão com backend</span>
      <a
        href="https://github.com/seu-repo"
        className="underline ml-2"
        target="_blank"
        rel="noopener noreferrer"
      >
        (Documentação)
      </a>
    </div>
  );
};

export default DevModeIndicator;
