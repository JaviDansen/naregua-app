import { useEffect, useState } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import { getProfile, updateProfile } from "../../../api/auth.api";
import { formatPhone } from "../../../utils/phone";
import Input from "../../../components/ui/Input";
import Sidebar from "../../../components/layout/Sidebar";
import Navbar from "../../../components/layout/Navbar";
import MobileNav from "../../../components/layout/MobileNav";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Skeleton from "../../../components/ui/Skeleton";

const Profile = () => {
  const { user, logout, isLoading, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [saving, setSaving] = useState(false);

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

  useEffect(() => {
    if (profile) {
      setNome(profile.nome || "");
      setTelefone(formatPhone(profile.telefone || ""));
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setFeedback(null);

      if (!nome.trim()) {
        setFeedback({
          type: "error",
          message: "Nome é obrigatório",
        });

        setSaving(false);
        return;
      }

      const updatedProfile = await updateProfile({
        nome: nome.trim(),
        telefone: telefone.trim(),
      });

      setProfile(updatedProfile);
      updateUser(updatedProfile);

      setFeedback({
        type: "success",
        message: "Perfil atualizado com sucesso",
      });

      setIsEditing(false);
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error.response?.data?.erro ||
          "Erro ao atualizar perfil",
      });
    } finally {
      setSaving(false);
    }
  };

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
                {feedback && (
                  <div
                    className={`mb-4 rounded-lg p-3 text-sm ${feedback.type === "success"
                        ? "bg-green-500/10 text-green-400 border border-green-500/20"
                        : "bg-red-500/10 text-red-400 border border-red-500/20"
                      }`}
                  >
                    {feedback.message}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-zinc-400 mb-1">Nome</p>

                    {isEditing ? (
                      <Input
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        placeholder="Digite seu nome"
                      />
                    ) : (
                      <p>{profile?.nome || user?.nome}</p>
                    )}
                  </div>

                  <div>
                    <p className="text-sm text-zinc-400 mb-1">Email</p>

                    <p>{profile?.email || user?.email}</p>
                  </div>

                  <div>
                    <p className="text-sm text-zinc-400 mb-1">Telefone</p>

                    {isEditing ? (
                      <Input
                        value={telefone}
                        onChange={(e) => setTelefone(formatPhone(e.target.value))}
                        placeholder="Digite seu telefone"
                      />
                    ) : (
                      <p>{profile?.telefone || "Não informado"}</p>
                    )}
                  </div>

                  <div>
                    <p className="text-sm text-zinc-400 mb-1">Perfil</p>

                    <p>
                      {profile?.perfil === "admin"
                        ? "Administrador"
                        : "Cliente"}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 pt-4">
                    {isEditing ? (
                      <>
                        <Button
                          onClick={handleSave}
                          disabled={saving}
                        >
                          {saving ? "Salvando..." : "Salvar alterações"}
                        </Button>

                        <Button
                          variant="secondary"
                          onClick={() => {
                            setIsEditing(false);
                            setNome(profile?.nome || "");
                            setTelefone(formatPhone(profile?.telefone || ""));
                            setFeedback(null);
                          }}
                        >
                          Cancelar
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          onClick={() => setIsEditing(true)}
                        >
                          Editar perfil
                        </Button>

                        <Button
                          variant="danger"
                          onClick={logout}
                        >
                          Logout
                        </Button>
                      </>
                    )}
                  </div>
                </div>
            </Card>
          )}
        </div>

        <MobileNav />
      </div>
    </div>
  );
};

export default Profile;
