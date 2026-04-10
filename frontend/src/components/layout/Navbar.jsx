import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../features/auth/hooks/useAuth';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
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
    <div className="md:hidden bg-zinc-900 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Naregua</h1>
        <button onClick={() => setIsOpen(!isOpen)} className="text-white">
          ☰
        </button>
      </div>
      {isOpen && (
        <nav className="mt-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block p-3 rounded-lg mb-2 ${
                location.pathname === item.path
                  ? 'bg-[#003366] text-white'
                  : 'text-zinc-400 hover:bg-zinc-800'
              }`}
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <button
            onClick={logout}
            className="w-full p-3 rounded-lg bg-red-600 hover:bg-red-700 text-white"
          >
            Logout
          </button>
        </nav>
      )}
    </div>
  );
};

export default Navbar;