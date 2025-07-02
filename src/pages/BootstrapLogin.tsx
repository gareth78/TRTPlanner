/* eslint-disable jsx-a11y/label-has-associated-control, jsx-a11y/anchor-is-valid, no-alert */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  loginWithEmail,
  loginWithGoogle,
  loginWithFacebook,
  loginAnonymously,
} from '../firebase/firebase';
import './BootstrapLogin.css';

export default function BootstrapLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginWithEmail(email, password);
      navigate('/');
    } catch (err: unknown) {
      if (err instanceof Error) alert(err.message);
      else alert('Invalid credentials');
    }
  };

  const handleGoogle = async () => {
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (err: unknown) {
      if (err instanceof Error) alert(err.message);
      else alert('Login failed');
    }
  };

  const handleFacebook = async () => {
    try {
      await loginWithFacebook();
      navigate('/');
    } catch (err: unknown) {
      if (err instanceof Error) alert(err.message);
      else alert('Login failed');
    }
  };

  const handleAnon = async () => {
    try {
      await loginAnonymously();
      navigate('/');
    } catch (err: unknown) {
      if (err instanceof Error) alert(err.message);
      else alert('Login failed');
    }
  };

  return (
    <section className="vh-100">
      <div className="container py-5 h-100">
        <div className="row d-flex align-items-center justify-content-center h-100">
          <div className="col-md-8 col-lg-7 col-xl-6">
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
              className="img-fluid"
              alt="Phone"
            />
          </div>
          <div className="col-md-7 col-lg-5 col-xl-5 offset-xl-1">
            <form onSubmit={onSubmit}>
              <div className="form-outline mb-4">
                <input
                  type="email"
                  id="email"
                  className="form-control form-control-lg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <label className="form-label" htmlFor="email">
                  Email address
                </label>
              </div>
              <div className="form-outline mb-4">
                <input
                  type="password"
                  id="password"
                  className="form-control form-control-lg"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <label className="form-label" htmlFor="password">
                  Password
                </label>
              </div>
              <div className="d-flex justify-content-around align-items-center mb-4">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="remember-me"
                    defaultChecked
                  />
                  <label className="form-check-label" htmlFor="remember-me">
                    Remember me
                  </label>
                </div>
                <a href="#">Forgot password?</a>
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-lg btn-block"
              >
                Sign in
              </button>
              <div className="divider d-flex align-items-center my-4">
                <p className="text-center fw-bold mx-3 mb-0 text-muted">OR</p>
              </div>
              <button
                type="button"
                className="btn btn-danger btn-lg btn-block mb-2"
                onClick={handleGoogle}
              >
                Continue with Google
              </button>
              <button
                type="button"
                className="btn btn-primary btn-lg btn-block mb-2"
                onClick={handleFacebook}
              >
                Continue with Facebook
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-lg btn-block"
                onClick={handleAnon}
              >
                Continue as Guest
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
