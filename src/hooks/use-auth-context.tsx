import { createContext, useContext } from 'react';
import { User } from 'firebase/auth';
import { UserRole } from '@/lib/types';

interface AuthUser extends User {
  role?: UserRole;
}

export const AuthContext = createContext<{ user: AuthUser | null }>({ user: null });

export const useAuthContext = () => useContext(AuthContext);