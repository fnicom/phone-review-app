import { useRouter } from 'expo-router';
import { onAuthStateChanged, User } from 'firebase/auth';
import React, { ReactNode, useEffect, useState } from 'react';
import { auth } from './config/firebase';

export default function AuthGuard({ children }: { children: ReactNode }) {
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setChecking(false);
      if (!firebaseUser) {
        router.replace('/login');
      }
    });
    return unsubscribe;
  }, []);

  if (checking) {
    return null; // Ou um loading spinner
  }

  return <>{children}</>;
} 