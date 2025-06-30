import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from 'react';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import app from '../firebase/config';
import { saveUserData } from '../services/userData';

interface UserInfo {
  uid: string;
  email: string | null;
  displayName: string | null;
}

interface Context {
  user: UserInfo | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateName: (name: string) => Promise<void>;
}

const UserContext = createContext<Context>({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  updateName: async () => {},
});

export const useUser = () => useContext(UserContext);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth(app);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        setUser({
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, [auth]);

  const login = useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  }, [auth]);

  const register = useCallback(
    async (email: string, password: string, name: string) => {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (name) {
        await updateProfile(cred.user, { displayName: name });
      }
      await saveUserData(cred.user.uid, { settings: { name } });
    },
    [auth],
  );

  const logout = useCallback(async () => {
    await signOut(auth);
  }, [auth]);

  const updateName = useCallback(
    async (name: string) => {
      if (!auth.currentUser) return;
      await updateProfile(auth.currentUser, { displayName: name });
      setUser({
        uid: auth.currentUser.uid,
        email: auth.currentUser.email,
        displayName: name,
      });
      await saveUserData(auth.currentUser.uid, { settings: { name } });
    },
    [auth],
  );

  const value = useMemo(
    () => ({ user, loading, login, register, logout, updateName }),
    [user, loading, login, register, logout, updateName],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
