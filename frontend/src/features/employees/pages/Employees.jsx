import { useState } from 'react';
import { useEmployees, useCreateEmployee } from "../../../hooks/useApi";
import Sidebar from "../../../components/layout/Sidebar";
import Navbar from "../../../components/layout/Navbar";
import MobileNav from "../../../components/layout/MobileNav";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Modal from "../../../components/ui/Modal";
import Skeleton from "../../../components/ui/Skeleton";
import { useAuth } from '../../auth/hooks/useAuth';

const Employees = () => {
  const { data: employees, isLoading } = useEmployees();
  const createEmployeeMutation = useCreateEmployee();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nome, setNome] = useState('');
  const [especialidade, setEspecialidade] = useState('');
  const [telefone, setTelefone] = useState('');

  const { user } = useAuth();
  const isAdmin = user?.perfil === 'admin';

  const formatTelefone = (value) => {
    const numbers = value.replace(/\D/g, "").slice(0, 11);

    if (numbers.length <= 2) return numbers;

    if (numbers.length <= 6) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    }

    if (numbers.length <= 10) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    }

    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
  };

  const handleCreate = async () => {
    const telefoneNumeros = telefone.replace(/\D/g, "");

    if (
      telefone &&
      (telefoneNumeros.length < 10 || telefoneNumeros.length > 11)
    ) {
      alert("Informe um telefone válido com DDD.");
      return;
    }
    
    await createEmployeeMutation.mutateAsync({ nome, especialidade, telefone });
    setIsModalOpen(false);
    setNome('');
    setEspecialidade('');
    setTelefone('');
  };

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <div className="p-6 pb-20 md:pb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Funcionários</h1>
            {isAdmin && (
              <Button onClick={() => setIsModalOpen(true)}>
                Adicionar Funcionário
              </Button>
            )}
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-20" />
              ))}
            </div>
          ) : employees && employees.length > 0 ? (
            <div className="space-y-4">
              {employees.map((employee) => (
                <Card key={employee.id}>
                  <h3 className="font-semibold">{employee.nome}</h3>
                  <p className="text-zinc-400">{employee.especialidade}</p>
                  <p className="text-zinc-400">{employee.telefone}</p>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <p className="text-zinc-400">Nenhum funcionário encontrado</p>
            </Card>
          )}
        </div>
        <MobileNav />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Adicionar Funcionário</h2>
        <Input
          label="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
        <Input
          label="Especialidade"
          value={especialidade}
          onChange={(e) => setEspecialidade(e.target.value)}
        />
        <Input
          label="Telefone"
          value={telefone}
          onChange={(e) => setTelefone(formatTelefone(e.target.value))}
          placeholder="(98) 99999-9999"
        />
        <Button onClick={handleCreate} loading={createEmployeeMutation.isPending}>
          Criar
        </Button>
      </Modal>
    </div>
  );
};

export default Employees;