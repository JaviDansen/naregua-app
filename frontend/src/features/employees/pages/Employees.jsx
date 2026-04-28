import { useState } from 'react';
import {
  useEmployees,
  useAdminEmployees,
  useCreateEmployee,
  useUpdateEmployee,
  useDeleteEmployee
} from "../../../hooks/useApi";

import Sidebar from "../../../components/layout/Sidebar";
import Navbar from "../../../components/layout/Navbar";
import MobileNav from "../../../components/layout/MobileNav";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Modal from "../../../components/ui/Modal";
import Skeleton from "../../../components/ui/Skeleton";
import { useAuth } from '../../auth/hooks/useAuth';
import { formatPhone, isValidPhone } from "../../../utils/phone";

const Employees = () => {
  const { user } = useAuth();
  const isAdmin = user?.perfil === 'admin';

  const { data: publicEmployees, isLoading: isLoadingPublic } = useEmployees();
  const { data: adminEmployees, isLoading: isLoadingAdmin } = useAdminEmployees(isAdmin);

  const employees = isAdmin ? adminEmployees : publicEmployees;
  const isLoading = isAdmin ? isLoadingAdmin : isLoadingPublic;

  const createEmployeeMutation = useCreateEmployee();
  const updateEmployeeMutation = useUpdateEmployee();
  const deleteEmployeeMutation = useDeleteEmployee();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [nome, setNome] = useState('');
  const [especialidade, setEspecialidade] = useState('');
  const [telefone, setTelefone] = useState('');

  const openCreateModal = () => {
    setEditingEmployee(null);
    setNome('');
    setEspecialidade('');
    setTelefone('');
    setIsModalOpen(true);
  };

  const openEditModal = (employee) => {
    setEditingEmployee(employee);
    setNome(employee.nome || '');
    setEspecialidade(employee.especialidade || '');
    setTelefone(formatPhone(employee.telefone || ''));
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
    setNome('');
    setEspecialidade('');
    setTelefone('');
  };

  const handleSubmit = async () => {
    if (!nome.trim()) return alert("Informe o nome do funcionário.");
    if (!especialidade.trim()) return alert("Informe a especialidade do funcionário.");
    if (!telefone.trim()) return alert("Informe o telefone do funcionário.");
    if (!isValidPhone(telefone)) return alert("Informe um telefone válido com DDD.");

    const payload = {
      nome: nome.trim(),
      especialidade: especialidade.trim(),
      telefone
    };

    if (editingEmployee) {
      await updateEmployeeMutation.mutateAsync({
        id: editingEmployee.id,
        data: payload
      });
    } else {
      await createEmployeeMutation.mutateAsync(payload);
    }

    resetForm();
  };

  const handleDelete = async (employee) => {
    const confirmar = window.confirm(
      `Tem certeza que deseja excluir o funcionário "${employee.nome}"?`
    );

    if (!confirmar) return;

    try {
      await deleteEmployeeMutation.mutateAsync(employee.id);
    } catch (error) {
      alert(error.response?.data?.erro || "Erro ao excluir funcionário.");
    }
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
              <Button onClick={openCreateModal}>
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

                  {isAdmin && employee.telefone && (
                    <p className="text-zinc-400">{employee.telefone}</p>
                  )}

                  {isAdmin && (
                    <div className="flex gap-2 mt-3">
                      <Button
                        variant="secondary"
                        onClick={() => openEditModal(employee)}
                      >
                        Editar
                      </Button>

                      <Button
                        variant="danger"
                        onClick={() => handleDelete(employee)}
                        loading={deleteEmployeeMutation.isPending}
                      >
                        Excluir
                      </Button>
                    </div>
                  )}
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

      <Modal isOpen={isModalOpen} onClose={resetForm}>
        <h2 className="text-xl font-bold mb-4">
          {editingEmployee ? "Editar Funcionário" : "Adicionar Funcionário"}
        </h2>

        <Input label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
        <Input label="Especialidade" value={especialidade} onChange={(e) => setEspecialidade(e.target.value)} required />
        <Input
          label="Telefone"
          value={telefone}
          onChange={(e) => setTelefone(formatPhone(e.target.value))}
          placeholder="(98) 99999-9999"
          required
        />

        <Button
          onClick={handleSubmit}
          loading={createEmployeeMutation.isPending || updateEmployeeMutation.isPending}
        >
          {editingEmployee ? "Salvar alterações" : "Criar"}
        </Button>
      </Modal>
    </div>
  );
};

export default Employees;