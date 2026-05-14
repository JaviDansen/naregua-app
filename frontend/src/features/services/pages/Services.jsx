import { useState } from 'react';
import {
  useServices,
  useCreateService,
  useUpdateService,
  useDeleteService
} from "../../../hooks/useApi";

import Sidebar from "../../../components/layout/Sidebar";
import Navbar from "../../../components/layout/Navbar";
import MobileNav from "../../../components/layout/MobileNav";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Modal from "../../../components/ui/Modal";
import Skeleton from "../../../components/ui/Skeleton";
import AlertMessage from "../../../components/ui/AlertMessage";
import ServiceCard from '../components/ServiceCard';
import { useAuth } from '../../auth/hooks/useAuth';

const Services = () => {
  const { data: services, isLoading } = useServices();
  const createServiceMutation = useCreateService();
  const updateServiceMutation = useUpdateService();
  const deleteServiceMutation = useDeleteService();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [duracao, setDuracao] = useState('');
  const [feedback, setFeedback] = useState(null);

  const { user } = useAuth();
  const isAdmin = user?.perfil === 'admin';

  const openCreateModal = () => {
    setFeedback(null);
    setEditingService(null);
    setNome('');
    setPreco('');
    setDuracao('');
    setIsModalOpen(true);
  };

  const openEditModal = (service) => {
    setFeedback(null);
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
    setFeedback(null);

    if (!nome.trim()) {
      setFeedback({ type: 'error', message: '❌ Informe o nome do serviço.' });
      return;
    }

    if (!preco || Number(preco) <= 0) {
      setFeedback({ type: 'error', message: '❌ Informe um preço válido.' });
      return;
    }

    if (!duracao || Number(duracao) <= 0) {
      setFeedback({ type: 'error', message: '❌ Informe uma duração válida.' });
      return;
    }

    const payload = {
      nome: nome.trim(),
      preco: parseFloat(preco),
      duracao: parseInt(duracao)
    };

    try {
      if (editingService) {
        await updateServiceMutation.mutateAsync({
          id: editingService.id,
          data: payload
        });
      } else {
        await createServiceMutation.mutateAsync(payload);
      }

      const successMessage = editingService
        ? '✅ Serviço editado com sucesso!'
        : '✅ Serviço criado com sucesso!';

      resetForm();
      setFeedback({ type: 'success', message: successMessage });
    } catch (error) {
      setFeedback({
        type: 'error',
        message: `❌ ${
          error.response?.data?.erro ||
          error.response?.data?.mensagem ||
          error.response?.data?.message ||
          'Erro ao salvar serviço.'
        }`,
      });
    }
  };

  const handleDelete = async (service) => {
    const confirmar = window.confirm(
      `Tem certeza que deseja excluir o serviço "${service.nome}"?`
    );

    if (!confirmar) return;

    try {
      await deleteServiceMutation.mutateAsync(service.id);
      setFeedback({
        type: 'success',
        message: '✅ Serviço excluído com sucesso!',
      });
    } catch (error) {
      setFeedback({
        type: 'error',
        message: `❌ ${
          error.response?.data?.erro ||
          error.response?.data?.mensagem ||
          error.response?.data?.message ||
          'Erro ao excluir serviço.'
        }`,
      });
    }
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

          {feedback && !isModalOpen && (
            <AlertMessage
              type={feedback.type}
              message={feedback.message}
              className="mb-4"
            />
          )}

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
                    <div className="flex gap-2 mt-3">
                      <Button
                        variant="secondary"
                        onClick={() => openEditModal(service)}
                        className="w-full"
                      >
                        Editar
                      </Button>

                      <Button
                        variant="danger"
                        onClick={() => handleDelete(service)}
                        loading={deleteServiceMutation.isPending}
                        className="w-full"
                      >
                        Excluir
                      </Button>
                    </div>
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

        {feedback && (
          <AlertMessage
            type={feedback.type}
            message={feedback.message}
            className="mb-4"
          />
        )}

        <Input label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
        <Input label="Preço (R$)" type="number" value={preco} onChange={(e) => setPreco(e.target.value)} required />
        <Input label="Duração (min)" type="number" value={duracao} onChange={(e) => setDuracao(e.target.value)} required />

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
