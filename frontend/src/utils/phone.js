export const formatPhone = (value = '') => {
  const numbers = value.replace(/\D/g, '').slice(0, 11);

  if (numbers.length <= 2) return numbers;

  if (numbers.length <= 6) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  }

  if (numbers.length <= 10) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
  }

  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
};

export const onlyPhoneNumbers = (value = '') => {
  return value.replace(/\D/g, '');
};

export const isValidPhone = (value = '') => {
  const numbers = onlyPhoneNumbers(value);
  return numbers.length === 10 || numbers.length === 11;
};