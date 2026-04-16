import { useMemo } from 'react';
import { useAvailability } from '../../../hooks/useApi';

const buildDailySlots = (duration = 30) => {
  const slots = [];
  const startHour = 9;
  const endHour = 18;

  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += duration) {
      const padMinute = String(minute).padStart(2, '0');
      slots.push(`${String(hour).padStart(2, '0')}:${padMinute}`);
    }
  }

  return slots;
};

const TimeSlotPicker = ({ selectedTime, onSelectTime, date, employeeId, serviceDuration = 30 }) => {
  const { data, isLoading } = useAvailability({ funcionarioId: employeeId, date });

  const availableSlots = useMemo(() => {
    if (!date || !employeeId) return [];

    const allSlots = buildDailySlots(serviceDuration);
    const occupied = data?.horarios_ocupados || [];

    return allSlots.filter((slot) => !occupied.includes(slot));
  }, [data, date, employeeId, serviceDuration]);

  if (!date || !employeeId) {
    return <p className="text-zinc-400">Selecione serviço, funcionário e data para ver horários disponíveis.</p>;
  }

  if (isLoading) {
    return <p className="text-zinc-400">Carregando horários disponíveis...</p>;
  }

  if (availableSlots.length === 0) {
    return <p className="text-zinc-400">Nenhum horário disponível nesta data.</p>;
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {availableSlots.map((slot) => (
        <button
          key={slot}
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