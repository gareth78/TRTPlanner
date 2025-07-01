import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { User } from 'firebase/auth';
import { initFirebaseAuth } from './firebase/firebase';

interface UserState {
  user: User | null;
  uid: string | null;
  loading: boolean;
}
const UserContext = createContext<UserState>({
  user: null,
  uid: null,
  loading: true,
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [uid, setUid] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = initFirebaseAuth((usr) => {
      setUser(usr);
      setUid(usr ? usr.uid : null);
      setLoading(false);
    });
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const value = useMemo(() => ({ user, uid, loading }), [user, uid, loading]);
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  return useContext(UserContext);
}
