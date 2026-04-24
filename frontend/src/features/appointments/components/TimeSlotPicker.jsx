import { useMemo } from 'react';
import { useAvailability } from '../../../hooks/useApi';

const timeToMinutes = (time) => {
  if (!time) return null;

  const [hours, minutes] = time.split(':').map(Number);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return null;
  }

  return hours * 60 + minutes;
};

const minutesToTime = (totalMinutes) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

const hasConflict = (slotStart, serviceDuration, occupiedAppointments = []) => {
  const slotStartMinutes = timeToMinutes(slotStart);
  const slotEndMinutes = slotStartMinutes + Number(serviceDuration || 0);

  return occupiedAppointments.some((appointment) => {
    const occupiedStart = timeToMinutes(appointment.inicio);
    const occupiedEnd = timeToMinutes(appointment.fim);

    if (occupiedStart == null || occupiedEnd == null) {
      return false;
    }

    return slotStartMinutes < occupiedEnd && slotEndMinutes > occupiedStart;
  });
};

const buildDailySlots = ({ openTime, closeTime, serviceDuration, intervalMinutes }) => {
  const slots = [];

  const startMinutes = timeToMinutes(openTime);
  const endMinutes = timeToMinutes(closeTime);
  const duration = Number(serviceDuration || 30);
  const interval = Number(intervalMinutes || 20);

  if (startMinutes == null || endMinutes == null) {
    return slots;
  }

  for (
    let current = startMinutes;
    current + duration <= endMinutes;
    current += interval
  ) {
    slots.push(minutesToTime(current));
  }

  return slots;
};

const TimeSlotPicker = ({
  selectedTime,
  onSelectTime,
  date,
  employeeId,
  serviceDuration = 30,
  serviceId,
}) => {
  const { data, isLoading, isError } = useAvailability({
    funcionarioId: employeeId,
    date,
    servicoId: serviceId,
  });
  const businessHours = data?.horario_funcionamento;
  const occupiedAppointments = data?.agendamentos_ocupados || [];
  const intervalMinutes = data?.intervalo_base_minutos || 20;

  const availableSlots = useMemo(() => {
    if (!date || !employeeId || !businessHours) return [];

    if (businessHours.fechado) return [];

    const allSlots = buildDailySlots({
      openTime: businessHours.inicio,
      closeTime: businessHours.fim,
      serviceDuration,
      intervalMinutes,
    });

    return allSlots.filter(
      (slot) => !hasConflict(slot, serviceDuration, occupiedAppointments)
    );
  }, [
    date,
    employeeId,
    businessHours,
    serviceDuration,
    intervalMinutes,
    occupiedAppointments,
  ]);

  if (!date || !employeeId) {
    return (
      <p className="text-zinc-400">
        Selecione serviço, funcionário e data para ver horários disponíveis.
      </p>
    );
  }

  if (isLoading) {
    return <p className="text-zinc-400">Carregando horários disponíveis...</p>;
  }

  if (isError) {
    return (
      <p className="text-red-400">
        Erro ao carregar horários disponíveis.
      </p>
    );
  }

  if (businessHours?.fechado) {
    return (
      <p className="text-zinc-400">
        A barbearia está fechada nesta data.
      </p>
    );
  }

  if (availableSlots.length === 0) {
    return <p className="text-zinc-400">Nenhum horário disponível nesta data.</p>;
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {availableSlots.map((slot) => (
        <button
          key={slot}
          type="button"
          onClick={() => onSelectTime(slot)}
          className={`p-3 rounded-lg border ${
            selectedTime === slot
              ? 'bg-[#003366] border-[#003366] text-white'
              : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700'
          }`}
        >
          {slot}
        </button>
      ))}
    </div>
  );
};

export default TimeSlotPicker;