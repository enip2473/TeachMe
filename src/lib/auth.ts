import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { app, db } from './firebase';
import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { UserRole } from './types';

const auth = getAuth(app);

interface AuthUser extends User {
  role?: UserRole;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setUser({ ...firebaseUser, role: userData.role as UserRole });
        } else {
          // New user, set default role to Student
          const defaultRole: UserRole = 'Student';
          await setDoc(userDocRef, { email: firebaseUser.email, role: defaultRole });
          setUser({ ...firebaseUser, role: defaultRole });
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return { user };
}