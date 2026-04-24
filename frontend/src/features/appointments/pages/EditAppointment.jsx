import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useServices,
  useEmployees,
  useAppointment,
  useUpdateAppointment,
} from '../../../hooks/useApi';
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
  getDateInputValueFromIso,
  getMinDateInputValue,
  getTimeInputValueFromIso,
  isPastDateTime,
} from '../../../utils/formatDate';

const EditAppointment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: services } = useServices();
  const { data: employees } = useEmployees();
  const { data: appointment, isLoading: loadingAppointment } = useAppointment(id);
  const updateAppointmentMutation = useUpdateAppointment();

  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const serviceOptions =
    services?.map((s) => ({ value: s.id, label: s.nome, duracao: s.duracao })) || [];

  const employeeOptions =
    employees?.map((e) => ({ value: e.id, label: e.nome })) || [];
    
  const selectedServiceDuration =
    Number(
      serviceOptions.find(
        (service) => Number(service.value) === Number(selectedService)
      )?.duracao
    ) || 30;

  useEffect(() => {
    if (appointment) {
      setSelectedService(appointment.servico_id || '');
      setSelectedEmployee(appointment.funcionario_id || '');

      if (appointment.data_hora) {
        setSelectedDate(getDateInputValueFromIso(appointment.data_hora));
        setSelectedTime(getTimeInputValueFromIso(appointment.data_hora));
      }
    }
  }, [appointment]);

  useEffect(() => {
    if (appointment?.data_hora && selectedDate && selectedEmployee && selectedService) {
      const originalDate = getDateInputValueFromIso(appointment.data_hora);
      const originalEmployee = String(appointment.funcionario_id || '');
      const originalService = String(appointment.servico_id || '');

      const changedDate = selectedDate !== originalDate;
      const changedEmployee = String(selectedEmployee) !== originalEmployee;
      const changedService = String(selectedService) !== originalService;

      if (changedDate || changedEmployee || changedService) {
        setSelectedTime('');
      }
    }
  }, [appointment, selectedDate, selectedEmployee, selectedService]);

  const handleNext = () => {
    if (step === 3 && selectedDate < getMinDateInputValue()) {
      alert('Não é possível selecionar uma data passada.');
      setSelectedDate('');
      setSelectedTime('');
      return;
    }

    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleConfirm = async () => {
    try {
      if (isPastDateTime(selectedDate, selectedTime)) {
        alert('Selecione uma data e horário futuros para o agendamento.');
        return;
      }

      const data_hora = `${selectedDate}T${selectedTime}:00`;

      await updateAppointmentMutation.mutateAsync({
        id,
        data: {
          servico_id: Number(selectedService),
          funcionario_id: Number(selectedEmployee),
          data_hora,
        },
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Erro ao atualizar agendamento:', error);

      const message =
        error.response?.data?.mensagem ||
        error.response?.data?.erro ||
        error.response?.data?.message ||
        'Erro ao atualizar agendamento.';

      alert(message);
    }
  };
  
  const canProceed = () => {
    switch (step) {
      case 1:
        return selectedService;
      case 2:
        return selectedEmployee;
      case 3:
        return selectedDate;
      case 4:
        return selectedTime;
      default:
        return false;
    }
  };

  if (loadingAppointment) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div>Carregando agendamento...</div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <Card>
          <p className="text-zinc-400">Agendamento não encontrado.</p>
          <Button onClick={() => navigate('/dashboard')}>Voltar para o dashboard</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6 pb-20 md:pb-6 max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-center">
            Editar Agendamento
          </h1>

          <Card>
            {step === 1 && (
              <div>
                <h2 className="text-xl mb-4">Passo 1: Selecione o Serviço</h2>
                <Select
                  label="Serviço"
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  options={serviceOptions}
                  required
                />
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-xl mb-4">
                  Passo 2: Selecione o Funcionário
                </h2>
                <Select
                  label="Funcionário"
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  options={employeeOptions}
                  required
                />
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="text-xl mb-4">Passo 3: Selecione a Data</h2>
                <div className="mb-4">
                  <label className="block text-sm mb-1 text-zinc-400">
                    Data
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      setSelectedTime("");
                    }}
                    className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 focus:outline-none focus:border-blue-500 text-white"
                    min={getMinDateInputValue()}
                    required
                  />
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <h2 className="text-xl mb-4">Passo 4: Selecione o Horário</h2>
                <TimeSlotPicker
                  selectedTime={selectedTime}
                  onSelectTime={setSelectedTime}
                  date={selectedDate}
                  employeeId={selectedEmployee}
                  serviceId={selectedService}
                  serviceDuration={selectedServiceDuration}
                />
              </div>
            )}

            <div className="flex justify-between mt-6">
              {step > 1 && (
                <Button variant="secondary" onClick={handleBack}>
                  Voltar
                </Button>
              )}

              {step < 4 ? (
                <Button onClick={handleNext} disabled={!canProceed()}>
                  Próximo
                </Button>
              ) : (
                <Button
                  onClick={() => setIsConfirmModalOpen(true)}
                  disabled={!canProceed()}
                >
                  Salvar alterações
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
        <h2 className="text-xl font-bold mb-4">Confirmar Alterações</h2>
        <p>
          Serviço:{" "}
          {
            serviceOptions.find(
              (s) => Number(s.value) === Number(selectedService),
            )?.label
          }
        </p>
        <p>
          Funcionário:{" "}
          {
            employeeOptions.find(
              (e) => Number(e.value) === Number(selectedEmployee),
            )?.label
          }
        </p>
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
            loading={updateAppointmentMutation.isPending}
          >
            Salvar alterações
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default EditAppointment;