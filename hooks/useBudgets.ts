import { useContext } from 'react';
import { BudgetsContext } from '@/contexts/BudgetsContext';

export const useBudgets = () => {
  return useContext(BudgetsContext);
};