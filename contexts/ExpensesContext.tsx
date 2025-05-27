import React, { createContext, useState, useEffect } from 'react';
import { expenseService } from '@/services/expenseService';
import { useAuth } from '@/hooks/useAuth';

export interface Expense {
  id: string;
  name: string;
  amount: any;
  createdAt: any; 
  description?: string;
}

interface ExpensesContextType {
  expenses: Expense[];
  isLoading: boolean;
  error: string | null;
  fetchExpenses: () => Promise<void>;
  getExpenseById: (id: string) => Promise<Expense | null>;
  addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
  updateExpense: (id: string, expense: Partial<Expense>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
}

export const ExpensesContext = createContext<ExpensesContextType>({
  expenses: [],
  isLoading: false,
  error: null,
  fetchExpenses: async () => {},
  getExpenseById: async () => null,
  addExpense: async () => {},
  updateExpense: async () => {},
  deleteExpense: async () => {},
});

export const ExpensesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      fetchExpenses();
    }
  }, [token]);

  const fetchExpenses = async () => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await expenseService.fetchExpenses(token);
      setExpenses(data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      setError('Failed to fetch expenses');
    } finally {
      setIsLoading(false);
    }
  };

  const getExpenseById = async (id: string): Promise<Expense | null> => {
    if (!token) return null;

    setIsLoading(true);
    setError(null);

    try {
      const expense = await expenseService.getExpenseById(id, token);
      return expense;
    } catch (error) {
      console.error(`Error fetching expense ${id}:`, error);
      setError('Failed to fetch expense details');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const addExpense = async (expense: Omit<Expense, 'id'>) => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      const newExpense = await expenseService.addExpense(expense, token);
      setExpenses([...expenses, newExpense]);
    } catch (error) {
      console.error('Error adding expense:', error);
      setError('Failed to add expense');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateExpense = async (id: string, expense: Partial<Expense>) => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      const updatedExpense = await expenseService.updateExpense(id, expense, token);
      setExpenses(expenses.map(e => e.id === id ? updatedExpense : e));
    } catch (error) {
      console.error('Error updating expense:', error);
      setError('Failed to update expense');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteExpense = async (id: string) => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      await expenseService.deleteExpense(id, token);
      setExpenses(expenses.filter(expense => expense.id !== id));
    } catch (error) {
      console.error('Error deleting expense:', error);
      setError('Failed to delete expense');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ExpensesContext.Provider value={{
      expenses,
      isLoading,
      error,
      fetchExpenses,
      getExpenseById,
      addExpense,
      updateExpense,
      deleteExpense,
    }}>
      {children}
    </ExpensesContext.Provider>
  );
};