import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  username: string;
  role: 'admin' | 'user';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// For demo purposes only - in a real app, this would be validated against a backend
const VALID_CREDENTIALS = [
  { username: 'admin', password: 'password123', role: 'admin' as const },
  { username: 'user', password: 'user123', role: 'user' as const }
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (username: string, password: string) => {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const validUser = VALID_CREDENTIALS.find(
          cred => cred.username === username && cred.password === password
        );
        
        if (validUser) {
          set({
            user: {
              id: crypto.randomUUID(),
              username: validUser.username,
              role: validUser.role
            },
            isAuthenticated: true
          });
          return true;
        }
        
        return false;
      },
      logout: () => {
        set({
          user: null,
          isAuthenticated: false
        });
      }
    }),
    {
      name: 'spacex-explorer-auth'
    }
  )
);