import { useContext } from 'react';
import { ExpensesContext } from '@/contexts/ExpensesContext';

export const useExpenses = () => {
  return useContext(ExpensesContext);
};