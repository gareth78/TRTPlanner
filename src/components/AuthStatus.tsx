import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import LoginForm from './Auth/LoginForm';

function AuthStatus() {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usr) => {
      setUser(usr);
      if (usr) setShowLogin(false);
    });
    return () => unsubscribe();
  }, []);

  if (!user) {
    return (
      <div className="flex flex-col items-start gap-2 text-sm text-gray-700">
        <button
          type="button"
          className="text-blue-600 underline"
          onClick={() => setShowLogin((v) => !v)}
        >
          {showLogin ? 'Close' : 'Login'}
        </button>
        {showLogin && <LoginForm />}
      </div>
    );
  }

  const label = user.email || (user.isAnonymous ? 'Anonymous' : 'Unknown');

  return (
    <div className="text-gray-700 text-sm flex items-center gap-2">
      <span>Signed in: {label}</span>
      <button
        type="button"
        className="text-blue-600 underline"
        onClick={() => signOut(auth)}
      >
        Logout
      </button>
    </div>
  );
}

export default AuthStatus;
