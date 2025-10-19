import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
}

const API_URL = 'http://localhost:3000/api/v1';

// Initialize auth state from localStorage if in browser
const initialState: AuthState = {
  user: null,
  token: browser ? localStorage.getItem('token') : null,
  loading: false
};

function createAuthStore() {
  const { subscribe, set, update } = writable<AuthState>(initialState);

  return {
    subscribe,

    async register(email: string, password: string, name: string) {
      update(state => ({ ...state, loading: true }));

      try {
        const response = await fetch(`${API_URL}/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password, name })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Registration failed');
        }

        // Store token in localStorage
        if (browser) {
          localStorage.setItem('token', data.token);
        }

        set({ user: data.user, token: data.token, loading: false });
        return { success: true };
      } catch (error) {
        update(state => ({ ...state, loading: false }));
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Registration failed'
        };
      }
    },

    async login(email: string, password: string) {
      update(state => ({ ...state, loading: true }));

      try {
        const response = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Login failed');
        }

        // Store token in localStorage
        if (browser) {
          localStorage.setItem('token', data.token);
        }

        set({ user: data.user, token: data.token, loading: false });
        return { success: true };
      } catch (error) {
        update(state => ({ ...state, loading: false }));
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Login failed'
        };
      }
    },

    async logout() {
      if (browser) {
        localStorage.removeItem('token');
      }
      set({ user: null, token: null, loading: false });
    },

    async checkAuth() {
      const token = browser ? localStorage.getItem('token') : null;

      if (!token) {
        set({ user: null, token: null, loading: false });
        return false;
      }

      update(state => ({ ...state, loading: true }));

      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Authentication failed');
        }

        const data = await response.json();
        set({ user: data.user, token, loading: false });
        return true;
      } catch (error) {
        // Token is invalid, clear it
        if (browser) {
          localStorage.removeItem('token');
        }
        set({ user: null, token: null, loading: false });
        return false;
      }
    }
  };
}

export const authStore = createAuthStore();
