import { useState, useEffect } from 'react';

const TimeSlotPicker = ({ selectedTime, onSelectTime, date, employeeId }) => {
  const [availableSlots, setAvailableSlots] = useState([]);

  useEffect(() => {
    // Mock available slots - in real app, fetch from API
    const slots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
    // Simulate some occupied slots
    const occupied = ['10:00', '15:00'];
    setAvailableSlots(slots.filter(slot => !occupied.includes(slot)));
  }, [date, employeeId]);

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