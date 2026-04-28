import { useEffect, useState } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import { getProfile } from "../../../api/auth.api";

import Sidebar from "../../../components/layout/Sidebar";
import Navbar from "../../../components/layout/Navbar";
import MobileNav from "../../../components/layout/MobileNav";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Skeleton from "../../../components/ui/Skeleton";

const Profile = () => {
  const { user, logout, isLoading } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, []);

  const loading = isLoading || loadingProfile;

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6 pb-20 md:pb-6 max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-center">Perfil</h1>

          {loading ? (
            <Card>
              <div className="space-y-4">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-6 w-56" />
                <Skeleton className="h-6 w-44" />
                <Skeleton className="h-10 w-full mt-4" />
              </div>
            </Card>
          ) : (
            <Card>
              <p className="mb-2">
                <strong>Nome:</strong> {profile?.nome || user?.nome}
              </p>

              <p className="mb-2">
                <strong>Email:</strong> {profile?.email || user?.email}
              </p>

              <p className="mb-2">
                <strong>Telefone:</strong>{" "}
                {profile?.telefone || "Não informado"}
              </p>

              <p className="mb-2">
                <strong>Perfil:</strong>{" "}
                {profile?.perfil === "admin"
                  ? "Administrador"
                  : "Cliente"}
              </p>

              <Button
                variant="danger"
                onClick={logout}
                className="mt-4"
              >
                Logout
              </Button>
            </Card>
          )}
        </div>

        <MobileNav />
      </div>
    </div>
  );
};

export default Profile;