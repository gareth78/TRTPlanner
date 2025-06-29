import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaSyringe, FaPlane, FaCog } from 'react-icons/fa';
import { GiMedicines } from 'react-icons/gi';
import { MdMenu, MdClose } from 'react-icons/md';
import version from '../version';
import logo from '../assets/trt_logo.svg';
import styles from './Sidebar.module.css';

function Sidebar() {
  const [open, setOpen] = useState(false);
  const [hasInjectables, setHasInjectables] = useState(false);
  const [hasOrals, setHasOrals] = useState(false);

  const checkMedications = () => {
    try {
      const injRaw = localStorage.getItem('injectables');
      const inj = injRaw ? JSON.parse(injRaw) : [];
      setHasInjectables(
        Array.isArray(inj) &&
          inj.some((i: { disabled?: boolean }) => !i.disabled),
      );
    } catch {
      setHasInjectables(false);
    }

    try {
      const oralRaw = localStorage.getItem('orals');
      const oral = oralRaw ? JSON.parse(oralRaw) : [];
      setHasOrals(
        Array.isArray(oral) &&
          oral.some((o: { disabled?: boolean }) => !o.disabled),
      );
    } catch {
      setHasOrals(false);
    }
  };

  useEffect(() => {
    checkMedications();
    const handle = (e: StorageEvent) => {
      if (
        e.key === 'injectables' ||
        e.key === 'orals' ||
        e.key === 'configSettings'
      ) {
        checkMedications();
      }
    };
    window.addEventListener('storage', handle);
    return () => window.removeEventListener('storage', handle);
  }, []);

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
        {open ? (
          <MdClose
            className={`${styles.icon} ${styles.iconOpen}`}
            color="white"
          />
        ) : (
          <MdMenu className={styles.icon} color="white" />
        )}
      </button>
      <aside className={`${styles.sidebar} ${!open ? styles.closed : ''}`}>
        <div>
          <div className={styles.logoContainer}>
            <div className={styles.logoWrapper}>
              <img src={logo} alt="logo" className={styles.logo} />
            </div>
            <h2 className={styles.title}>TRT Planner</h2>
          </div>
          <nav className={styles.nav}>
            <NavLink
              to="/"
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              <FaHome /> Home
            </NavLink>
            {hasInjectables && (
              <NavLink
                to="/schedule"
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                <FaSyringe /> Injection Schedule
              </NavLink>
            )}
            {hasOrals && (
              <NavLink
                to="/oral"
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                <GiMedicines /> Oral Schedule
              </NavLink>
            )}
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
              <FaCog /> Configuration
            </NavLink>
          </nav>
        </div>
        <div className={styles.version}>v{version}</div>
      </aside>
    </>
  );
}

export default Sidebar;
