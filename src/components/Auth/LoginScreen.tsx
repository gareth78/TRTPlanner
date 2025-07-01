import { useState } from 'react';
import logo from '../../assets/MediTrack_logo_svg.svg';
import {
  loginAnonymously,
  loginWithEmail,
  signUpWithEmail,
  loginWithGoogle,
  loginWithFacebook,
  resetPassword,
} from '../../firebase/firebase';

function LoginScreen() {
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPass, setSignupPass] = useState('');
  const [signupError, setSignupError] = useState('');
  const [signupLoading, setSignupLoading] = useState(false);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [socialLoading, setSocialLoading] = useState(false);
  const [resetMsg, setResetMsg] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError('');
    setResetMsg('');
    setSignupLoading(true);
    try {
      await signUpWithEmail(signupEmail, signupPass);
    } catch (err: unknown) {
      if (err instanceof Error) setSignupError(err.message);
      else setSignupError(String(err));
    } finally {
      setSignupLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setResetMsg('');
    setLoginLoading(true);
    try {
      await loginWithEmail(loginEmail, loginPass);
    } catch (err: unknown) {
      if (err instanceof Error) setLoginError(err.message);
      else setLoginError(String(err));
    } finally {
      setLoginLoading(false);
    }
  };

  const handleAnon = async () => {
    setResetMsg('');
    setSignupError('');
    setLoginError('');
    setSocialLoading(true);
    try {
      await loginAnonymously();
    } finally {
      setSocialLoading(false);
    }
  };

  const handleGoogle = async () => {
    setSocialLoading(true);
    setSignupError('');
    setLoginError('');
    setResetMsg('');
    try {
      await loginWithGoogle();
    } catch (err) {
      if (err instanceof Error) setLoginError(err.message);
      else setLoginError(String(err));
    } finally {
      setSocialLoading(false);
    }
  };

  const handleFacebook = async () => {
    setSocialLoading(true);
    setSignupError('');
    setLoginError('');
    setResetMsg('');
    try {
      await loginWithFacebook();
    } catch (err) {
      if (err instanceof Error) setLoginError(err.message);
      else setLoginError(String(err));
    } finally {
      setSocialLoading(false);
    }
  };

  const handleReset = async () => {
    if (!loginEmail) return;
    setResetMsg('');
    try {
      await resetPassword(loginEmail);
      setResetMsg('Password reset email sent');
    } catch (err) {
      if (err instanceof Error) setResetMsg(err.message);
      else setResetMsg(String(err));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <img src={logo} alt="MediTrack logo" className="w-48 mb-8" />
      <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          id="signup-card"
          className="bg-white rounded shadow p-6 flex flex-col"
        >
          <h2 className="text-xl font-bold mb-4 text-center">Sign Up</h2>
          <form
            onSubmit={handleSignup}
            className="flex flex-col space-y-3 flex-1"
          >
            <input
              type="email"
              className="rounded border p-2"
              placeholder="Email"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
              required
            />
            <input
              type="password"
              className="rounded border p-2"
              placeholder="Password"
              value={signupPass}
              onChange={(e) => setSignupPass(e.target.value)}
              required
            />
            {signupError && (
              <div className="text-sm text-red-600">{signupError}</div>
            )}
            <button
              type="submit"
              disabled={signupLoading}
              className="rounded bg-[#15b39c] p-2 text-white disabled:opacity-60"
            >
              {signupLoading ? 'Creating account...' : 'SIGN UP'}
            </button>
          </form>
          <button
            type="button"
            className="mt-2 text-sm text-[#f37ada] underline"
            onClick={() =>
              document
                .getElementById('login-card')
                ?.scrollIntoView({ behavior: 'smooth' })
            }
          >
            Already a user? LOGIN
          </button>
          <div className="my-4 flex items-center justify-center gap-2 text-sm text-gray-500">
            <span className="border-t flex-1" />
            OR
            <span className="border-t flex-1" />
          </div>
          <div className="flex justify-center gap-4">
            <button
              type="button"
              onClick={handleGoogle}
              disabled={socialLoading}
              className="rounded bg-red-500 text-white px-3 py-1 disabled:opacity-60"
            >
              Google
            </button>
            <button
              type="button"
              onClick={handleFacebook}
              disabled={socialLoading}
              className="rounded bg-blue-600 text-white px-3 py-1 disabled:opacity-60"
            >
              Facebook
            </button>
          </div>
        </div>
        <div
          id="login-card"
          className="bg-white rounded shadow p-6 flex flex-col"
        >
          <h2 className="text-xl font-bold mb-4 text-center">Login</h2>
          <form
            onSubmit={handleLogin}
            className="flex flex-col space-y-3 flex-1"
          >
            <input
              type="email"
              className="rounded border p-2"
              placeholder="Email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
            />
            <input
              type="password"
              className="rounded border p-2"
              placeholder="Password"
              value={loginPass}
              onChange={(e) => setLoginPass(e.target.value)}
              required
            />
            {loginError && (
              <div className="text-sm text-red-600">{loginError}</div>
            )}
            <button
              type="submit"
              disabled={loginLoading}
              className="rounded bg-[#15b39c] p-2 text-white disabled:opacity-60"
            >
              {loginLoading ? 'Signing in...' : 'LOGIN'}
            </button>
          </form>
          <div className="flex justify-between text-sm mt-2">
            <button
              type="button"
              className="text-[#15b39c] underline"
              onClick={handleReset}
            >
              Forgot Password?
            </button>
            <button
              type="button"
              className="text-[#f37ada] underline"
              onClick={() =>
                document
                  .getElementById('signup-card')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              Need an account? SIGN UP
            </button>
          </div>
          {resetMsg && (
            <div className="mt-2 text-sm text-gray-700">{resetMsg}</div>
          )}
          <div className="my-4 flex items-center justify-center gap-2 text-sm text-gray-500">
            <span className="border-t flex-1" />
            OR
            <span className="border-t flex-1" />
          </div>
          <div className="flex justify-center gap-4">
            <button
              type="button"
              onClick={handleGoogle}
              disabled={socialLoading}
              className="rounded bg-red-500 text-white px-3 py-1 disabled:opacity-60"
            >
              Google
            </button>
            <button
              type="button"
              onClick={handleFacebook}
              disabled={socialLoading}
              className="rounded bg-blue-600 text-white px-3 py-1 disabled:opacity-60"
            >
              Facebook
            </button>
          </div>
        </div>
      </div>
      <div className="mt-6 text-center">
        <button
          type="button"
          className="text-[#15b39c] underline"
          onClick={handleAnon}
          disabled={socialLoading}
        >
          OR continue anonymously
        </button>
      </div>
    </div>
  );
}

export default LoginScreen;
