export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): string => {
  if (!password) {
    return 'Password is required';
  }
  
  if (password.length < 6) {
    return 'Password must be at least 6 characters';
  }
  
  return '';
};

export const validateRequired = (value: string, fieldName: string): string => {
  if (!value || value.trim() === '') {
    return `${fieldName} is required`;
  }
  
  return '';
};

export const validateAmount = (amount: string): string => {
  if (!amount) {
    return 'Amount is required';
  }
  
  const numAmount = parseFloat(amount);
  
  if (isNaN(numAmount)) {
    return 'Amount must be a valid number';
  }
  
  if (numAmount <= 0) {
    return 'Amount must be greater than zero';
  }
  
  return '';
};

export const validateDate = (date: Date | null): string => {
  if (!date) {
    return 'Date is required';
  }
  
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return 'Invalid date';
  }
  
  return '';
};