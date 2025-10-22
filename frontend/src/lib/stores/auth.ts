import { writable } from 'svelte/store';
import type { User } from '$lib/types';
import { browser } from '$app/environment';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

const getInitialState = (): AuthState => {
  if (browser) {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        return {
          user,
          token,
          isAuthenticated: true,
        };
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }
  return {
    user: null,
    token: null,
    isAuthenticated: false,
  };
};

function createAuthStore() {
  const { subscribe, set, update } = writable<AuthState>(getInitialState());

  return {
    subscribe,
    setAuth: (user: User, token: string) => {
      if (browser) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
      }
      set({
        user,
        token,
        isAuthenticated: true,
      });
    },
    logout: () => {
      if (browser) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      set({
        user: null,
        token: null,
        isAuthenticated: false,
      });
    },
    updateUser: (user: Partial<User>) => {
      update((state) => {
        if (state.user) {
          const updatedUser = { ...state.user, ...user };
          if (browser) {
            localStorage.setItem('user', JSON.stringify(updatedUser));
          }
          return {
            ...state,
            user: updatedUser,
          };
        }
        return state;
      });
    },
  };
}

export const authStore = createAuthStore();
