import api from './api';

export const expenseService = {
  async fetchExpenses(token: string) {
    try {
      const response = await api.get('/expenses', {
        headers: {
          Authorization: token,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching expenses:', error);
      throw error;
    }
  },

  async getExpenseById(id: string, token: string) {
    try {
      const response = await api.get(`/expenses/${id}`, {
        headers: {
          Authorization: token,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching expense details:', error);
      throw error;
    }
  },

  async addExpense(expense: any, token: string) {
    try {
      const response = await api.post('/expenses', expense, {
        headers: {
          Authorization: token,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error adding expense:', error);
      throw error;
    }
  },

  async updateExpense(id: string, expense: any, token: string) {
    try {
      const response = await api.put(`/expenses/${id}`, expense, {
        headers: {
          Authorization: token,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating expense:', error);
      throw error;
    }
  },

  async deleteExpense(id: string, token: string) {
    try {
      await api.delete(`/expenses/${id}`, {
        headers: {
          Authorization: token,
        },
      });
    } catch (error) {
      console.error('Error deleting expense:', error);
      throw error;
    }
  },
};