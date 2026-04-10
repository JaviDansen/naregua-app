import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/services', label: 'Serviços' },
    { path: '/employees', label: 'Funcionários' },
    { path: '/appointments/new', label: 'Novo Agendamento' },
    { path: '/profile', label: 'Perfil' },
  ];

  return (
    <div className="hidden md:flex flex-col w-64 bg-zinc-900 h-screen p-4">
      <h1 className="text-2xl font-bold mb-8 text-center">Naregua</h1>
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