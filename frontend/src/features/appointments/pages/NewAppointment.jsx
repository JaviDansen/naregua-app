import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useServices, useEmployees, useCreateAppointment } from "../../../hooks/useApi";
import Sidebar from "../../../components/layout/Sidebar";
import Navbar from "../../../components/layout/Navbar";
import MobileNav from "../../../components/layout/MobileNav";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Select from "../../../components/ui/Select";
import Modal from "../../../components/ui/Modal";
import TimeSlotPicker from '../components/TimeSlotPicker';

const NewAppointment = () => {
  const navigate = useNavigate();
  const { data: services } = useServices();
  const { data: employees } = useEmployees();
  const createAppointmentMutation = useCreateAppointment();

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

  const selectedServiceDuration = serviceOptions.find((service) => service.value === selectedService)?.duracao || 30;

  useEffect(() => {
    setSelectedTime('');
  }, [selectedDate, selectedEmployee, selectedService]);

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleConfirm = async () => {
    const data_hora = `${selectedDate}T${selectedTime}:00`;
    await createAppointmentMutation.mutateAsync({
      servico_id: selectedService,
      funcionario_id: selectedEmployee,
      data_hora,
    });
    navigate('/dashboard');
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

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <div className="p-6 pb-20 md:pb-6 max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-center">Novo Agendamento</h1>

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
                <h2 className="text-xl mb-4">Passo 2: Selecione o Funcionário</h2>
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
                  <label className="block text-sm mb-1 text-zinc-400">Data</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 focus:outline-none focus:border-blue-500 text-white"
                    min={new Date().toISOString().split('T')[0]}
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
                <Button onClick={() => setIsConfirmModalOpen(true)} disabled={!canProceed()}>
                  Confirmar
                </Button>
              )}
            </div>
          </Card>
        </div>
        <MobileNav />
      </div>

      <Modal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Confirmar Agendamento</h2>
        <p>Serviço: {serviceOptions.find(s => s.value === selectedService)?.label}</p>
        <p>Funcionário: {employeeOptions.find(e => e.value === selectedEmployee)?.label}</p>
        <p>Data: {selectedDate}</p>
        <p>Hora: {selectedTime}</p>
        <div className="flex justify-between mt-6">
          <Button variant="secondary" onClick={() => setIsConfirmModalOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} loading={createAppointmentMutation.isPending}>
            Confirmar
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default NewAppointment;