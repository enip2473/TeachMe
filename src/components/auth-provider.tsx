'use client';
import { AuthContext } from '@/hooks/use-auth-context';
import { useAuth } from '@/lib/auth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
}
