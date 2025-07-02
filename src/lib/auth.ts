'use client';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { app } from './firebase';
import { useEffect, useState } from 'react';

const auth = getAuth(app);

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return { user };
}
