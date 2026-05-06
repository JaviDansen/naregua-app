import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useServices,
  useEmployees,
  useCreateAppointment,
  useUsers,
} from '../../../hooks/useApi';
import { useAuth } from '../../auth/hooks/useAuth';
import Sidebar from '../../../components/layout/Sidebar';
import Navbar from '../../../components/layout/Navbar';
import MobileNav from '../../../components/layout/MobileNav';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Modal from '../../../components/ui/Modal';
import TimeSlotPicker from '../components/TimeSlotPicker';
import {
  formatInputDate,
  getMinDateInputValue,
  isPastDateTime,
} from '../../../utils/formatDate';

const NewAppointment = () => {
  const navigate = useNavigate();

  const { user } = useAuth();
  const isAdmin = user?.perfil === 'admin';

  const {
    data: services,
    isLoading: loadingServices,
  } = useServices();

  const {
    data: employees,
    isLoading: loadingEmployees,
  } = useEmployees();

  const {
    data: users,
    isLoading: loadingUsers,
  } = useUsers(isAdmin);

  const createAppointmentMutation = useCreateAppointment();

  const [step, setStep] = useState(1);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const totalSteps = isAdmin ? 5 : 4;

  const serviceOptions =
    services?.map((s) => ({
      value: s.id,
      label: s.nome,
      duracao: s.duracao,
    })) || [];

  const employeeOptions =
    employees?.map((e) => ({
      value: e.id,
      label: e.nome,
    })) || [];

  const userOptions =
  users?.map((u) => ({
    value: u.id,
    label: `${u.nome} — ${u.telefone || 'telefone não informado'}`,
  })) || [];

  const selectedServiceDuration =
    Number(
      serviceOptions.find(
        (service) => Number(service.value) === Number(selectedService)
      )?.duracao
    ) || 30;

  useEffect(() => {
    setSelectedTime('');
  }, [selectedDate, selectedEmployee, selectedService]);

  const handleNext = () => {
    const dateStep = isAdmin ? 4 : 3;

    if (step === dateStep && selectedDate < getMinDateInputValue()) {
      alert('Não é possível selecionar uma data passada.');
      setSelectedDate('');
      setSelectedTime('');
      return;
    }

    if (step < totalSteps) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleConfirm = async () => {
    try {
      if (isAdmin && !selectedUser) {
        alert('Selecione o cliente do agendamento.');
        return;
      }

      if (isPastDateTime(selectedDate, selectedTime)) {
        alert('Selecione uma data e horário futuros para o agendamento.');
        return;
      }

      const data_hora = `${selectedDate}T${selectedTime}:00`;

      const payload = {
        servico_id: Number(selectedService),
        funcionario_id: Number(selectedEmployee),
        data_hora,
      };

      if (isAdmin) {
        payload.usuario_id = Number(selectedUser);
      }

      await createAppointmentMutation.mutateAsync(payload);

      navigate('/dashboard');
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);

      const message =
        error.response?.data?.mensagem ||
        error.response?.data?.erro ||
        error.response?.data?.message ||
        'Erro ao criar agendamento.';

      alert(message);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return isAdmin ? selectedUser : selectedService;
      case 2:
        return isAdmin ? selectedService : selectedEmployee;
      case 3:
        return isAdmin ? selectedEmployee : selectedDate;
      case 4:
        return isAdmin ? selectedDate : selectedTime;
      case 5:
        return selectedTime;
      default:
        return false;
    }
  };

  const selectedServiceLabel =
    serviceOptions.find((s) => Number(s.value) === Number(selectedService))?.label;

  const selectedEmployeeLabel =
    employeeOptions.find((e) => Number(e.value) === Number(selectedEmployee))?.label;

  const selectedUserData = users?.find(
    (u) => Number(u.id) === Number(selectedUser)
  );

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6 pb-20 md:pb-6 max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-center">
            Novo Agendamento
          </h1>

          <Card>
            {isAdmin && step === 1 && (
              <div>
                <h2 className="text-xl mb-4">
                  Passo 1: Selecione o Cliente
                </h2>

                {loadingUsers ? (
                  <p className="text-zinc-400">Carregando clientes...</p>
                ) : (
                  <Select
                    label="Cliente"
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    options={userOptions}
                    required
                  />
                )}
              </div>
            )}

            {(isAdmin ? step === 2 : step === 1) && (
              <div>
                <h2 className="text-xl mb-4">
                  Passo {isAdmin ? 2 : 1}: Selecione o Serviço
                </h2>

                {loadingServices ? (
                  <p className="text-zinc-400">Carregando serviços...</p>
                ) : (
                  <Select
                    label="Serviço"
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    options={serviceOptions}
                    required
                  />
                )}
              </div>
            )}

            {(isAdmin ? step === 3 : step === 2) && (
              <div>
                <h2 className="text-xl mb-4">
                  Passo {isAdmin ? 3 : 2}: Selecione o Funcionário
                </h2>

                {loadingEmployees ? (
                  <p className="text-zinc-400">Carregando funcionários...</p>
                ) : (
                  <Select
                    label="Funcionário"
                    value={selectedEmployee}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                    options={employeeOptions}
                    required
                  />
                )}
              </div>
            )}

            {(isAdmin ? step === 4 : step === 3) && (
              <div>
                <h2 className="text-xl mb-4">
                  Passo {isAdmin ? 4 : 3}: Selecione a Data
                </h2>

                <div className="mb-4">
                  <label className="block text-sm mb-1 text-zinc-400">
                    Data
                  </label>

                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      setSelectedTime('');
                    }}
                    className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 focus:outline-none focus:border-blue-500 text-white"
                    min={getMinDateInputValue()}
                    required
                  />
                </div>
              </div>
            )}

            {(isAdmin ? step === 5 : step === 4) && (
              <div>
                <h2 className="text-xl mb-4">
                  Passo {isAdmin ? 5 : 4}: Selecione o Horário
                </h2>

                {selectedDate < getMinDateInputValue() ? (
                  <p className="text-red-400">
                    Não é possível selecionar uma data passada.
                  </p>
                ) : (
                  <TimeSlotPicker
                    selectedTime={selectedTime}
                    onSelectTime={setSelectedTime}
                    date={selectedDate}
                    employeeId={selectedEmployee}
                    serviceId={selectedService}
                    serviceDuration={selectedServiceDuration}
                  />
                )}
              </div>
            )}

            <div className="flex justify-between mt-6">
              {step > 1 && (
                <Button variant="secondary" onClick={handleBack}>
                  Voltar
                </Button>
              )}

              {step < totalSteps ? (
                <Button onClick={handleNext} disabled={!canProceed()}>
                  Próximo
                </Button>
              ) : (
                <Button
                  onClick={() => setIsConfirmModalOpen(true)}
                  disabled={!canProceed()}
                >
                  Confirmar
                </Button>
              )}
            </div>
          </Card>
        </div>

        <MobileNav />
      </div>

      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
      >
        <h2 className="text-xl font-bold mb-4">Confirmar Agendamento</h2>

        {isAdmin && (
          <>
            <p>Cliente: {selectedUserData?.nome}</p>
            <p>Telefone: {selectedUserData?.telefone || 'não informado'}</p>
            <p>Email: {selectedUserData?.email}</p>
          </>
        )}

        <p>Serviço: {selectedServiceLabel}</p>
        <p>Funcionário: {selectedEmployeeLabel}</p>
        <p>Data: {formatInputDate(selectedDate)}</p>
        <p>Hora: {selectedTime}</p>

        <div className="flex justify-between mt-6">
          <Button
            variant="secondary"
            onClick={() => setIsConfirmModalOpen(false)}
          >
            Cancelar
          </Button>

          <Button
            onClick={handleConfirm}
            loading={createAppointmentMutation.isPending}
          >
            Confirmar
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default NewAppointment;