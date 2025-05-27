import api from './api';

export const budgetService = {
  async fetchBudgets(token: string) {
    try {
      const response = await api.get('/budgets', {
        headers: {
          Authorization: token,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching budgets:', error);
      throw error;
    }
  },

  async getBudgetById(id: string, token: string) {
    try {
      const response = await api.get(`/budgets/${id}`, {
        headers: {
          Authorization: token,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching budget details:', error);
      throw error;
    }
  },

  async addBudget(budget: any, token: string) {
    try {
      const response = await api.post('/budgets', budget, {
        headers: {
          Authorization: token,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error adding budget:', error);
      throw error;
    }
  },

  async updateBudget(id: string, budget: any, token: string) {
    try {
      const response = await api.put(`/budgets/${id}`, budget, {
        headers: {
          Authorization: token,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating budget:', error);
      throw error;
    }
  },

  async deleteBudget(id: string, token: string) {
    try {
      await api.delete(`/budgets/${id}`, {
        headers: {
          Authorization: token,
        },
      });
    } catch (error) {
      console.error('Error deleting budget:', error);
      throw error;
    }
  },
};