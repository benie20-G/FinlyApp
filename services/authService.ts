// authService.ts
import api from './api';

export const authService = {
  async login(email: string, password: string) {
    try {
      const response = await api.get(`/users?username=${email}`); // use email here!

      if (response.data && response.data.length > 0) {
        const user = response.data[0];

        // Simulate password validation
        if (password === user.password) {
          // Mock a token since the API doesn't provide one
          return {
            ...user,
            token: 'mock-jwt-token',
          };
        }
      }

      throw new Error('Invalid email or password');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
};
