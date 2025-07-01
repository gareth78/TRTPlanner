import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../assets/MediTrack_logo_svg.svg';
import { loginWithEmail, loginAnonymously } from '../firebase/firebase';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGuest = async () => {
    setError('');
    setLoading(true);
    try {
      await loginAnonymously();
      navigate('/');
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await loginWithEmail(email, password);
      navigate('/');
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 rounded-xl bg-white p-8 shadow-xl"
      >
        <img src={Logo} alt="MediTrack logo" className="mx-auto w-24" />
        <h1 className="text-center text-2xl font-semibold">Login</h1>
        <input
          type="text"
          className="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
          placeholder="Username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div className="text-right">
          <button type="button" className="text-sm text-blue-600 hover:underline">
            Forgot password?
          </button>
        </div>
        {error && <div className="text-sm text-red-600">{error}</div>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-gradient-to-r from-blue-500 to-purple-500 py-2 font-medium text-white hover:from-blue-600 hover:to-purple-600 disabled:opacity-60"
        >
          {loading ? 'Signing in...' : 'Login'}
        </button>
        <button
          type="button"
          onClick={handleGuest}
          disabled={loading}
          className="w-full rounded bg-gradient-to-r from-blue-500 to-purple-500 py-2 font-medium text-white hover:from-blue-600 hover:to-purple-600 disabled:opacity-60"
        >
          Login as Guest
        </button>
        <div className="flex items-center gap-2 text-gray-500">
          <span className="flex-grow border-t" />
          <span className="text-xs">or</span>
          <span className="flex-grow border-t" />
        </div>
        <div className="text-center text-sm">
          <Link to="/signup" className="text-blue-600 underline">
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
}
