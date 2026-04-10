import { useState } from 'react';
import { useServices, useCreateService } from "../../../hooks/useApi";
import Sidebar from "../../../components/layout/Sidebar";
import Navbar from "../../../components/layout/Navbar";
import MobileNav from "../../../components/layout/MobileNav";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Modal from "../../../components/ui/Modal";
import Skeleton from "../../../components/ui/Skeleton";
import ServiceCard from '../components/ServiceCard';

const Services = () => {
  const { data: services, isLoading } = useServices();
  const createServiceMutation = useCreateService();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [duracao, setDuracao] = useState('');

  const handleCreate = async () => {
    await createServiceMutation.mutateAsync({ nome, preco: parseFloat(preco), duracao: parseInt(duracao) });
    setIsModalOpen(false);
    setNome('');
    setPreco('');
    setDuracao('');
  };

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <div className="p-6 pb-20 md:pb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Serviços</h1>
            <Button onClick={() => setIsModalOpen(true)}>Adicionar Serviço</Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          ) : services && services.data.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {services.data.map((service) => (
                <ServiceCard key={service.id} service={service} />
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Adicionar Serviço</h2>
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
        <Button onClick={handleCreate} loading={createServiceMutation.isPending}>
          Criar
        </Button>
      </Modal>
    </div>
  );
};

export default Services;