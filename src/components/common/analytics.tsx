'use client';

import { useEffect } from 'react';
import { analytics } from '@/lib/firebase';

export function Analytics() {

  if (analytics === null) {
    console.warn('Firebase Analytics is not supported in this browser.');
  }

  useEffect(() => {
    // This will initialize Firebase Analytics if it's supported by the browser.
    // The `analytics` export from `firebase.ts` is a promise that resolves
    // to the analytics instance.
  }, []);

  return null;
}
