import { NavLink } from 'react-router-dom';
import version from '../version';

function Sidebar() {
  return (
    <div
      style={{
        width: '250px',
        height: '100vh',
        background: '#f5f5f5',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
      }}
    >
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <NavLink to="/">🏠 Home</NavLink>
        <NavLink to="/schedule">💉 Injection Schedule</NavLink>
        <NavLink to="/travel">✈️ Travel Plans</NavLink>
        <NavLink to="/config">⚙️ Config</NavLink>
      </nav>
      <div style={{ fontSize: '0.8rem', color: '#666' }}>
        Version: {version}
      </div>
    </div>
  );
}

export default Sidebar;
