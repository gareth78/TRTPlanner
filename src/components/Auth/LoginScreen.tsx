import { useState } from 'react';
import {
  signInAnonymously,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import logo from '../../assets/meditrack-logo-horizontal.png';

function LoginScreen() {
  const [mode, setMode] = useState<'anon' | 'email'>('anon');
  const [emailMode, setEmailMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  let submitLabel = '';
  if (loading) {
    submitLabel = emailMode === 'signup' ? 'Creating account...' : 'Signing in...';
  } else {
    submitLabel = emailMode === 'signup' ? 'Sign Up' : 'Login';
  }

  const handleAnon = async () => {
    setError('');
    setLoading(true);
    try {
      await signInAnonymously(auth);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    setError('');
    setLoading(true);
    try {
      if (emailMode === 'signup') {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const activeTab =
    'px-4 py-2 font-medium rounded-t border-b-2 border-accent-primary text-accent-primary';
  const inactiveTab =
    'px-4 py-2 font-medium rounded-t border-b-2 border-transparent text-gray-500 hover:text-accent-primary';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded shadow-lg p-6">
        <img src={logo} alt="MediTrack logo" className="mx-auto mb-6 w-48" />
        <div className="flex justify-center mb-6 space-x-4 border-b">
          <button
            type="button"
            className={mode === 'anon' ? activeTab : inactiveTab}
            onClick={() => setMode('anon')}
          >
            Anonymous
          </button>
          <button
            type="button"
            className={mode === 'email' ? activeTab : inactiveTab}
            onClick={() => setMode('email')}
          >
            Email Login
          </button>
        </div>
        {mode === 'anon' && (
          <div className="text-center">
            {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
            <button
              type="button"
              onClick={handleAnon}
              disabled={loading}
              className="w-full rounded bg-accent-primary py-2 text-white disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Continue Anonymously'}
            </button>
          </div>
        )}
        {mode === 'email' && (
          <form
            onSubmit={handleEmail}
            className="flex flex-col space-y-3"
          >
            <input
              type="email"
              className="rounded border p-2"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              className="rounded border p-2"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <div className="text-sm text-red-600">{error}</div>}
            <button
              type="submit"
              disabled={loading}
              className="rounded bg-accent-primary p-2 text-white disabled:opacity-60"
            >
              {submitLabel}
            </button>
            <button
              type="button"
              className="text-sm text-accent-secondary underline mt-1"
              onClick={() =>
                setEmailMode((m) => (m === 'login' ? 'signup' : 'login'))
              }
            >
              {emailMode === 'login'
                ? "Don't have an account? Sign up"
                : 'Already have an account? Login'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default LoginScreen;
