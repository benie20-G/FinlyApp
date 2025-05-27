import React, { createContext, useState, useEffect } from 'react';
import { budgetService } from '@/services/budgetService';
import { useAuth } from '@/hooks/useAuth';

interface Budget {
  id: string;
  category: string;
  limit: string;
  currentAmount: string;
  period: string;
}

interface BudgetsContextType {
  budgets: Budget[];
  isLoading: boolean;
  error: string | null;
  fetchBudgets: () => Promise<void>;
  getBudgetByCategory: (category: string) => Budget | undefined;
  addBudget: (budget: Omit<Budget, 'id'>) => Promise<void>;
  updateBudget: (id: string, budget: Partial<Budget>) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
}

export const BudgetsContext = createContext<BudgetsContextType>({
  budgets: [],
  isLoading: false,
  error: null,
  fetchBudgets: async () => {},
  getBudgetByCategory: () => undefined,
  addBudget: async () => {},
  updateBudget: async () => {},
  deleteBudget: async () => {},
});

export const BudgetsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      fetchBudgets();
    }
  }, [token]);

  const fetchBudgets = async () => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      // This is a mock implementation - we would normally fetch from the API
      // const data = await budgetService.fetchBudgets(token);
      
      // Using placeholder data for the UI
      const mockBudgets = [
        {
          id: '1',
          category: 'Food',
          limit: '300',
          currentAmount: '250',
          period: 'Monthly',
        },
        {
          id: '2',
          category: 'Transportation',
          limit: '150',
          currentAmount: '85',
          period: 'Monthly',
        },
        {
          id: '3',
          category: 'Entertainment',
          limit: '200',
          currentAmount: '195',
          period: 'Monthly',
        },
      ];
      
      setBudgets(mockBudgets);
    } catch (error) {
      console.error('Error fetching budgets:', error);
      setError('Failed to fetch budgets');
    } finally {
      setIsLoading(false);
    }
  };

  const getBudgetByCategory = (category: string) => {
    return budgets.find(budget => budget.category === category);
  };

  const addBudget = async (budget: Omit<Budget, 'id'>) => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      // const newBudget = await budgetService.addBudget(budget, token);
      const newBudget = { ...budget, id: Date.now().toString() };
      setBudgets([...budgets, newBudget as Budget]);
    } catch (error) {
      console.error('Error adding budget:', error);
      setError('Failed to add budget');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateBudget = async (id: string, budget: Partial<Budget>) => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      // await budgetService.updateBudget(id, budget, token);
      setBudgets(budgets.map(b => b.id === id ? { ...b, ...budget } : b));
    } catch (error) {
      console.error('Error updating budget:', error);
      setError('Failed to update budget');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteBudget = async (id: string) => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      // await budgetService.deleteBudget(id, token);
      setBudgets(budgets.filter(b => b.id !== id));
    } catch (error) {
      console.error('Error deleting budget:', error);
      setError('Failed to delete budget');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BudgetsContext.Provider value={{
      budgets,
      isLoading,
      error,
      fetchBudgets,
      getBudgetByCategory,
      addBudget,
      updateBudget,
      deleteBudget,
    }}>
      {children}
    </BudgetsContext.Provider>
  );
};