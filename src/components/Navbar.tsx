import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';

function Navbar() {
  const { user, logout } = useUser();

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem' }}>
      <div>
        {user && <span style={{ marginRight: '1rem' }}>Hello, {user.displayName || user.email}</span>}
      </div>
      <nav>
        {user ? (
          <>
            <Link to="/profile" style={{ marginRight: '1rem' }}>
              My Profile
            </Link>
            <button type="button" onClick={logout} style={{ marginRight: '1rem' }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ marginRight: '1rem' }}>
              Login
            </Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
