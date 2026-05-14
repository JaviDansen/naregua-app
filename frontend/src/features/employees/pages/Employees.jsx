import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import AlertMessage from "../../../components/ui/AlertMessage";
import { useAuth } from '../../auth/hooks/useAuth';
import { formatPhone, isValidPhone } from "../../../utils/phone";

const Employees = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.perfil === 'admin';
  const isUsuario = user?.perfil === 'usuario';

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
  const [feedback, setFeedback] = useState(null);

  const handleEmployeeClick = (employee) => {
    if (!isUsuario) return;

    navigate(`/appointments/new?employeeId=${employee.id}`);
  };

  const handleEmployeeKeyDown = (event, employee) => {
    if (!isUsuario) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleEmployeeClick(employee);
    }
  };

  const openCreateModal = () => {
    setFeedback(null);
    setEditingEmployee(null);
    setNome('');
    setEspecialidade('');
    setTelefone('');
    setIsModalOpen(true);
  };

  const openEditModal = (employee) => {
    setFeedback(null);
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
    setFeedback(null);

    if (!nome.trim()) {
      setFeedback({ type: 'error', message: '❌ Informe o nome do funcionário.' });
      return;
    }

    if (!especialidade.trim()) {
      setFeedback({ type: 'error', message: '❌ Informe a especialidade do funcionário.' });
      return;
    }

    if (!telefone.trim()) {
      setFeedback({ type: 'error', message: '❌ Informe o telefone do funcionário.' });
      return;
    }

    if (!isValidPhone(telefone)) {
      setFeedback({ type: 'error', message: '❌ Informe um telefone válido com DDD.' });
      return;
    }

    const payload = {
      nome: nome.trim(),
      especialidade: especialidade.trim(),
      telefone
    };

    try {
      if (editingEmployee) {
        await updateEmployeeMutation.mutateAsync({
          id: editingEmployee.id,
          data: payload
        });
      } else {
        await createEmployeeMutation.mutateAsync(payload);
      }

      const successMessage = editingEmployee
        ? '✅ Funcionário editado com sucesso!'
        : '✅ Funcionário criado com sucesso!';

      resetForm();
      setFeedback({ type: 'success', message: successMessage });
    } catch (error) {
      setFeedback({
        type: 'error',
        message: `❌ ${
          error.response?.data?.erro ||
          error.response?.data?.mensagem ||
          error.response?.data?.message ||
          'Erro ao salvar funcionário.'
        }`,
      });
    }
  };

  const handleDelete = async (employee) => {
    const confirmar = window.confirm(
      `Tem certeza que deseja excluir o funcionário "${employee.nome}"?`
    );

    if (!confirmar) return;

    try {
      await deleteEmployeeMutation.mutateAsync(employee.id);
      setFeedback({
        type: 'success',
        message: '✅ Funcionário excluído com sucesso!',
      });
    } catch (error) {
      setFeedback({
        type: 'error',
        message: `❌ ${
          error.response?.data?.erro ||
          error.response?.data?.mensagem ||
          error.response?.data?.message ||
          'Erro ao excluir funcionário.'
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
          <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-2xl font-bold">Funcionários</h1>

              {isUsuario && (
                <p className="mt-2 text-sm text-zinc-400">
                  Clique em um funcionário para agendar um horário com ele já selecionado.
                </p>
              )}
            </div>

            {isAdmin && (
              <Button onClick={openCreateModal}>
                Adicionar Funcionário
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
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-20" />
              ))}
            </div>
          ) : employees && employees.length > 0 ? (
            <div className="space-y-4">
              {employees.map((employee) => (
                <Card
                  key={employee.id}
                  onClick={isUsuario ? () => handleEmployeeClick(employee) : undefined}
                  onKeyDown={(event) => handleEmployeeKeyDown(event, employee)}
                  role={isUsuario ? 'button' : undefined}
                  tabIndex={isUsuario ? 0 : undefined}
                  className={
                    isUsuario
                      ? 'cursor-pointer transition-colors hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40'
                      : ''
                  }
                >
                  <h3 className="font-semibold">{employee.nome}</h3>
                  <p className="text-zinc-400 mt-1">
                    Especialidades: {employee.especialidade}
                  </p>

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

        {feedback && (
          <AlertMessage
            type={feedback.type}
            message={feedback.message}
            className="mb-4"
          />
        )}

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
