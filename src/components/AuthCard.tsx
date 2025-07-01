/* eslint-disable import/no-unresolved, no-console */
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

function AuthCard() {
  const router = useRouter();
  const pathname = usePathname();
  const isLogin = pathname === '/login';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder submit handler
    // In a real app, call authentication logic here
    console.log('submit', { email, password });
  };

  const switchHref = isLogin ? '/signup' : '/login';
  const switchText = isLogin ? 'Need an account? Sign up' : 'Already have an account? Login';

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[400px] space-y-4 rounded-lg bg-white p-6 shadow"
      >
        <h1 className="text-center text-2xl font-semibold">
          {isLogin ? 'Login' : 'Sign Up'}
        </h1>
        <input
          type="email"
          className="w-full rounded border p-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="w-full rounded border p-2"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {isLogin && (
          <button
            type="button"
            onClick={() => router.push('/forgot-password')}
            className="text-sm text-blue-600 underline"
          >
            Forgot password?
          </button>
        )}
        <button type="submit" className="w-full rounded bg-teal-600 p-2 text-white">
          {isLogin ? 'Login' : 'Create Account'}
        </button>
        <p className="text-center text-sm">
          <Link href={switchHref} className="text-blue-600 underline">
            {switchText}
          </Link>
        </p>
      </form>
    </div>
  );
}

export default AuthCard;
