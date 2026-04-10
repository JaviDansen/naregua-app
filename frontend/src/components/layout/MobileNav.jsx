import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';

const MobileNav = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { path: '/dashboard', icon: '🏠' },
    { path: '/services', icon: '✂️' },
    { path: '/appointments/new', icon: '📅' },
    { path: '/profile', icon: '👤' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-zinc-900 p-4 flex justify-around">
      {menuItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`text-2xl ${
            location.pathname === item.path ? 'text-[#003366]' : 'text-zinc-400'
          }`}
        >
          {item.icon}
        </Link>
      ))}
      <button onClick={logout} className="text-zinc-400 text-2xl">
        🚪
      </button>
    </div>
  );
};

export default MobileNav;