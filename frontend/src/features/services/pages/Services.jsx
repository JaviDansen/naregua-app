import { useState } from 'react';
import {
  useServices,
  useCreateService,
  useUpdateService
} from "../../../hooks/useApi";

import Sidebar from "../../../components/layout/Sidebar";
import Navbar from "../../../components/layout/Navbar";
import MobileNav from "../../../components/layout/MobileNav";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Modal from "../../../components/ui/Modal";
import Skeleton from "../../../components/ui/Skeleton";
import ServiceCard from '../components/ServiceCard';
import { useAuth } from '../../auth/hooks/useAuth';

const Services = () => {
  const { data: services, isLoading } = useServices();
  const createServiceMutation = useCreateService();
  const updateServiceMutation = useUpdateService();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [duracao, setDuracao] = useState('');

  const { user } = useAuth();
  const isAdmin = user?.perfil === 'admin';

  const openCreateModal = () => {
    setEditingService(null);
    setNome('');
    setPreco('');
    setDuracao('');
    setIsModalOpen(true);
  };

  const openEditModal = (service) => {
    setEditingService(service);
    setNome(service.nome || '');
    setPreco(String(service.preco || ''));
    setDuracao(String(service.duracao || ''));
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setIsModalOpen(false);
    setEditingService(null);
    setNome('');
    setPreco('');
    setDuracao('');
  };

  const handleSubmit = async () => {
    if (!nome.trim()) {
      alert("Informe o nome do serviço.");
      return;
    }

    if (!preco || Number(preco) <= 0) {
      alert("Informe um preço válido.");
      return;
    }

    if (!duracao || Number(duracao) <= 0) {
      alert("Informe uma duração válida.");
      return;
    }

    const payload = {
      nome: nome.trim(),
      preco: parseFloat(preco),
      duracao: parseInt(duracao)
    };

    if (editingService) {
      await updateServiceMutation.mutateAsync({
        id: editingService.id,
        data: payload
      });
    } else {
      await createServiceMutation.mutateAsync(payload);
    }

    resetForm();
  };

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6 pb-20 md:pb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Serviços</h1>

            {isAdmin && (
              <Button onClick={openCreateModal}>
                Adicionar Serviço
              </Button>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          ) : services && services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {services.map((service) => (
                <div key={service.id}>
                  <ServiceCard service={service} />

                  {isAdmin && (
                    <Button
                      variant="secondary"
                      onClick={() => openEditModal(service)}
                      className="mt-3 w-full"
                    >
                      Editar
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <Card>
              <p className="text-zinc-400">Nenhum serviço encontrado</p>
            </Card>
          )}
        </div>

        <MobileNav />
      </div>

      <Modal isOpen={isModalOpen} onClose={resetForm}>
        <h2 className="text-xl font-bold mb-4">
          {editingService ? "Editar Serviço" : "Adicionar Serviço"}
        </h2>

        <Input
          label="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />

        <Input
          label="Preço (R$)"
          type="number"
          value={preco}
          onChange={(e) => setPreco(e.target.value)}
          required
        />

        <Input
          label="Duração (min)"
          type="number"
          value={duracao}
          onChange={(e) => setDuracao(e.target.value)}
          required
        />

        <Button
          onClick={handleSubmit}
          loading={createServiceMutation.isPending || updateServiceMutation.isPending}
        >
          {editingService ? "Salvar alterações" : "Criar"}
        </Button>
      </Modal>
    </div>
  );
};

export default Services;