import { useAuth } from "../../auth/hooks/useAuth";
import Sidebar from "../../../components/layout/Sidebar";
import Navbar from "../../../components/layout/Navbar";
import MobileNav from "../../../components/layout/MobileNav";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";

const Profile = () => {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <div className="p-6 pb-20 md:pb-6 max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-center">Perfil</h1>
          <Card>
            <p className="mb-2"><strong>Nome:</strong> {user?.nome || 'Usuário'}</p>
            <p className="mb-2"><strong>Email:</strong> {user?.email || 'usuario@email.com'}</p>
            <Button variant="danger" onClick={logout} className="mt-4">
              Logout
            </Button>
          </Card>
        </div>
        <MobileNav />
      </div>
    </div>
  );
};

export default Profile;