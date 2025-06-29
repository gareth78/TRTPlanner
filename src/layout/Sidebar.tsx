import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaSyringe, FaPlane, FaCog, FaBars } from 'react-icons/fa';
import version from '../version';
import logo from '../assets/trt_logo.svg';
import styles from './Sidebar.module.css';

function Sidebar() {
  const [open, setOpen] = useState(false);

  const toggle = () => {
    setOpen((o) => !o);
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `${styles.link} ${isActive ? styles.active : ''}`;

  return (
    <>
      <button
        type="button"
        onClick={toggle}
        className={`${styles.toggleButton} ${open ? styles.buttonOpen : ''}`}
      >
        <FaBars />
      </button>
      <aside className={`${styles.sidebar} ${!open ? styles.closed : ''}`}>
        <div>
          <div className={styles.logoContainer}>
            <img src={logo} alt="logo" className={styles.logo} />
            <h2>TRT Planner</h2>
          </div>
          <nav className={styles.nav}>
            <NavLink to="/" className={linkClass} onClick={() => setOpen(false)}>
              <FaHome /> Home
            </NavLink>
            <NavLink
              to="/schedule"
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              <FaSyringe /> Injection Schedule
            </NavLink>
            <NavLink
              to="/travel"
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              <FaPlane /> Travel Plans
            </NavLink>
            <NavLink
              to="/config"
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              <FaCog /> Config
            </NavLink>
          </nav>
        </div>
        <div className={styles.version}>v{version}</div>
      </aside>
    </>
  );
}

export default Sidebar;
