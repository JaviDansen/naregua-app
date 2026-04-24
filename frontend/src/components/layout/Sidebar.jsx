import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';

const Sidebar = () => {
  const location = useLocation();

  const { logout, user } = useAuth();

  const isAdmin = user?.perfil === 'admin';

  const userName = user?.nome || 'Usuário';
  const profileLabel = isAdmin ? 'Administrador' : 'Cliente';
  const areaLabel = isAdmin ? 'Painel Administrativo' : 'Área do Cliente';

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/services', label: 'Serviços' },
    { path: '/employees', label: 'Funcionários' },
    ...(isAdmin
      ? [{ path: '/appointments/manage', label: 'Gerenciar Agendamentos' }]
      : []),
    { path: '/appointments/new', label: 'Novo Agendamento' },
    { path: '/profile', label: 'Perfil' },
  ];

  return (
    <div className="hidden md:flex flex-col w-64 bg-zinc-900 h-screen p-4">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold">Naregua</h1>
        <p className="text-xs text-zinc-400 mt-1">{areaLabel}</p>
      </div>

      <div className="mb-6 rounded-lg bg-zinc-800 p-3 border border-zinc-700">
        <p className="text-sm text-zinc-400">Olá,</p>
        <p className="font-semibold truncate">{userName}</p>
        <p className="text-xs text-zinc-500 mt-1">
          Perfil: {profileLabel}
        </p>
      </div>

      <nav className="flex-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`block p-3 rounded-lg mb-2 ${
              location.pathname === item.path
                ? 'bg-[#003366] text-white'
                : 'text-zinc-400 hover:bg-zinc-800'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <button
        onClick={logout}
        className="p-3 rounded-lg bg-red-600 hover:bg-red-700 text-white"
      >
        Logout
      </button>
    </div>
  );
};

export default Sidebar;