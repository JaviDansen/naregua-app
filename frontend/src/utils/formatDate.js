export const parseDate = (value) => {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
};

export const formatDate = (dateString) => {
  const date = parseDate(dateString);

  if (!date) return '-';

  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const formatTime = (dateString) => {
  const date = parseDate(dateString);

  if (!date) return '-';

  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDateTime = (dateString) => {
  const date = parseDate(dateString);

  if (!date) return '-';

  return `${formatDate(dateString)} ${formatTime(dateString)}`;
};

export const sortAppointmentsByDate = (appointments = []) => {
  return [...appointments].sort((a, b) => {
    const dateA = parseDate(a.data_hora)?.getTime() ?? 0;
    const dateB = parseDate(b.data_hora)?.getTime() ?? 0;

    return dateA - dateB;
  });
};

export const sortAppointmentsWithCanceledLast = (appointments = []) => {
  return [...appointments].sort((a, b) => {
    const isCanceledA = a.status === 'cancelado';
    const isCanceledB = b.status === 'cancelado';

    if (isCanceledA && !isCanceledB) return 1;
    if (!isCanceledA && isCanceledB) return -1;

    const dateA = parseDate(a.data_hora)?.getTime() ?? 0;
    const dateB = parseDate(b.data_hora)?.getTime() ?? 0;

    return dateA - dateB;
  });
};

export const getNextAppointment = (appointments = []) => {
  const now = new Date();

  return sortAppointmentsByDate(appointments).find((item) => {
    const date = parseDate(item.data_hora);

    if (!date) return false;
    if (item.status === 'cancelado') return false;

    return date.getTime() >= now.getTime();
  }) || null;
};

export const getMinDateInputValue = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export const getDateInputValueFromIso = (dateString) => {
  const date = parseDate(dateString);

  if (!date) return '';

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export const getTimeInputValueFromIso = (dateString) => {
  const date = parseDate(dateString);

  if (!date) return '';

  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');

  return `${hour}:${minute}`;
};

export const isPastDateTime = (date, time) => {
  if (!date || !time) return true;

  const selectedDateTime = new Date(`${date}T${time}:00`);
  const now = new Date();

  return selectedDateTime.getTime() < now.getTime();
};