'use client';

import { Button } from '@/components/ui/button';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

export default function SignInPage() {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  const signIn = async () => {
    await signInWithPopup(auth, provider);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Button onClick={signIn}>Sign in with Google</Button>
    </div>
  );
}
