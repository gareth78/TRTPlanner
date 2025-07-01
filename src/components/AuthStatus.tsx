import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { auth } from '../firebase/firebase';

function AuthStatus() {
  const [user, setUser] = useState<User | null>(auth.currentUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  if (!user) {
    return (
      <div className="text-gray-700 text-sm flex items-center gap-2">
        <span>Signed in: None</span>
        <button
          type="button"
          className="text-blue-600 underline"
          onClick={() => {}}
        >
          Login
        </button>
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
