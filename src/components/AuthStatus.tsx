import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { useUser } from '../UserContext';

function AuthStatus() {
  const { user } = useUser();

  if (!user) {
    return null;
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
