import { create } from 'zustand';

export type AuthUser = {
  _id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
};

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  status: 'idle' | 'loading' | 'authed' | 'guest';
  setSession: (user: AuthUser, token: string) => void;
  setUser: (user: AuthUser) => void;
  clear: () => void;
  setStatus: (s: AuthState['status']) => void;
}

const TOKEN_KEY = 'foody.token';

const initialToken =
  typeof localStorage !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: initialToken,
  status: initialToken ? 'loading' : 'guest',

  setSession: (user, token) => {
    localStorage.setItem(TOKEN_KEY, token);
    set({ user, token, status: 'authed' });
  },

  setUser: (user) => set({ user, status: 'authed' }),

  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    set({ user: null, token: null, status: 'guest' });
  },

  setStatus: (status) => set({ status }),
}));

export default useAuthStore;
