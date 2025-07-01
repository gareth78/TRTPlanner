import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  loginWithEmail,
  loginAnonymously,
  resetPassword,
} from '../firebase/firebase';
import Logo from '../assets/MediTrack_logo_svg.svg';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');
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

  const handleGuest = async () => {
    setError('');
    setInfo('');
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

  const handleReset = async () => {
    if (!email) return;
    try {
      await resetPassword(email);
      setInfo('Password reset email sent');
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError(String(err));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <div className="w-full max-w-md space-y-4 rounded-xl bg-white p-8 shadow-lg">
        <img src={Logo} alt="MediTrack logo" className="mx-auto w-32" />
        <h1 className="text-center text-2xl font-semibold text-gray-700">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            className="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
            placeholder="Email"
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
          {error && <div className="text-sm text-red-600">{error}</div>}
          {info && !error && <div className="text-sm text-green-600">{info}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-gradient-to-r from-blue-500 to-purple-600 py-2 font-semibold text-white hover:opacity-90 disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>
        <button
          type="button"
          onClick={handleGuest}
          disabled={loading}
          className="w-full rounded bg-gradient-to-r from-blue-500 to-purple-600 py-2 font-semibold text-white hover:opacity-90 disabled:opacity-60"
        >
          Login as Guest
        </button>
        <button type="button" onClick={handleReset} className="text-sm text-blue-600 hover:underline">
          Forgot password?
        </button>
        <div className="my-2 flex items-center gap-2 text-gray-400">
          <span className="h-px flex-1 bg-gray-200" />
          <span className="text-sm">or</span>
          <span className="h-px flex-1 bg-gray-200" />
        </div>
        <p className="text-center text-sm">
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
