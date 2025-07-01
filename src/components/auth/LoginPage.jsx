import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import handleLogin from '@/services/auth';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleLogin(email, password);
      navigate('/dashboard');
    } catch {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="">
      <img
        src="https://via.placeholder.com/1200x300?text=Welcome"
        alt="Hero"
        className="img-fluid w-100"
      />
      <div className="container mt-n5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card shadow rounded p-4">
              <h2 className="text-center mb-4">Sign in to your account</h2>
              <form onSubmit={onSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="remember-me"
                    />
                    <label className="form-check-label" htmlFor="remember-me">
                      Remember me
                    </label>
                  </div>
                  <a href="#" className="small">
                    Forgot your password?
                  </a>
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Sign in
                </button>
              </form>
              <p className="mt-3 text-center small">
                Don’t have an account?{' '}
                <a href="#">Register here</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
