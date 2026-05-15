import { useState } from 'react';
import {
  useUsers,
  useCreateUser,
} from '../../../hooks/useApi';
import Sidebar from '../../../components/layout/Sidebar';
import Navbar from '../../../components/layout/Navbar';
import MobileNav from '../../../components/layout/MobileNav';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Modal from '../../../components/ui/Modal';
import Skeleton from '../../../components/ui/Skeleton';
import AlertMessage from '../../../components/ui/AlertMessage';
import { formatPhone, isValidPhone } from '../../../utils/phone';

const Clients = () => {
  const { data: clients = [], isLoading } = useUsers();
  const createUserMutation = useCreateUser();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [feedback, setFeedback] = useState(null);

  const resetForm = () => {
    setIsModalOpen(false);
    setNome('');
    setTelefone('');
    setEmail('');
    setSenha('');
  };

  const handleSubmit = async () => {
    setFeedback(null);

    if (!nome.trim()) {
      setFeedback({ type: 'error', message: '❌ Informe o nome do cliente.' });
      return;
    }

    if (!telefone.trim()) {
      setFeedback({ type: 'error', message: '❌ Informe o telefone do cliente.' });
      return;
    }

    if (!isValidPhone(telefone)) {
      setFeedback({ type: 'error', message: '❌ Informe um telefone válido com DDD.' });
      return;
    }

    if (!email.trim()) {
      setFeedback({ type: 'error', message: '❌ Informe o email do cliente.' });
      return;
    }

    if (!senha.trim()) {
      setFeedback({ type: 'error', message: '❌ Informe uma senha provisória para o cliente.' });
      return;
    }

    if (senha.trim().length < 8) {
      setFeedback({ type: 'error', message: '❌ A senha deve ter no mínimo 8 caracteres.' });
      return;
    }

    try {
      await createUserMutation.mutateAsync({
        nome: nome.trim(),
        telefone: telefone.trim(),
        email: email.trim().toLowerCase(),
        senha,
      });

      resetForm();
      setFeedback({
        type: 'success',
        message: '✅ Cliente criado com sucesso!',
      });
    } catch (error) {
      setFeedback({
        type: 'error',
        message: `❌ ${
          error.response?.data?.erro ||
          error.response?.data?.mensagem ||
          error.response?.data?.message ||
          'Erro ao cadastrar cliente.'
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
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Clientes</h1>
              <p className="text-zinc-400 mt-1">
                Cadastre e visualize clientes para criar agendamentos administrativos.
              </p>
            </div>

            <Button
              onClick={() => {
                setFeedback(null);
                setIsModalOpen(true);
              }}
            >
              Adicionar Cliente
            </Button>
          </div>

          {feedback && !isModalOpen && (
            <AlertMessage
              type={feedback.type}
              message={feedback.message}
              className="mb-4"
            />
          )}

          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
            </div>
          ) : clients.length > 0 ? (
            <div className="space-y-4">
              {clients.map((client) => (
                <Card key={client.id}>
                  <h3 className="font-semibold">{client.nome}</h3>
                  <p className="text-zinc-400">{client.telefone || 'Telefone não informado'}</p>
                  <p className="text-zinc-500 text-sm">{client.email}</p>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <p className="text-zinc-300 font-medium">
                Nenhum cliente encontrado.
              </p>
              <p className="text-zinc-500 text-sm mt-1">
                Cadastre clientes para criar agendamentos em nome deles.
              </p>
            </Card>
          )}
        </div>

        <MobileNav />
      </div>

      <Modal isOpen={isModalOpen} onClose={resetForm}>
        <h2 className="text-xl font-bold mb-4">Adicionar Cliente</h2>

        {feedback && (
          <AlertMessage
            type={feedback.type}
            message={feedback.message}
            className="mb-4"
          />
        )}

        <Input
          label="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />

        <Input
          label="Telefone"
          value={telefone}
          onChange={(e) => setTelefone(formatPhone(e.target.value))}
          placeholder="(98) 99999-9999"
          required
        />

        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="cliente@email.com"
          required
        />

        <Input
          label="Senha provisória"
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />

        <Button
          onClick={handleSubmit}
          loading={createUserMutation.isPending}
        >
          Criar cliente
        </Button>
      </Modal>
    </div>
  );
};

export default Clients;
