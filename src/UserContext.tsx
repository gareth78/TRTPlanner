import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { initFirebaseAuth } from './firebase/firebase';

interface UserState {
  uid: string | null;
  loading: boolean;
}

const UserContext = createContext<UserState>({ uid: null, loading: true });

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [uid, setUid] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = initFirebaseAuth((id) => {
      setUid(id);
      setLoading(false);
    });
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const value = useMemo(() => ({ uid, loading }), [uid, loading]);
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  return useContext(UserContext);
}
