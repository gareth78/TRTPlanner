import { useState, useEffect, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaSyringe, FaPlane, FaCog } from 'react-icons/fa';
import { GiMedicines } from 'react-icons/gi';
import { MdMenu, MdClose } from 'react-icons/md';
import version from '../version';
import logo from '../assets/trt_logo.svg';
import { useUser } from '../context/UserContext';
import { loadUserData } from '../services/userData';
import styles from './Sidebar.module.css';

function Sidebar() {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [hasInjectables, setHasInjectables] = useState(false);
  const [hasOrals, setHasOrals] = useState(false);

  const checkMedications = useCallback(() => {
    if (!user) {
      setHasInjectables(false);
      setHasOrals(false);
      return;
    }
    loadUserData(user.uid)
      .then((data) => {
        const cfg = data.settings || {};
        const inj = Array.isArray(cfg.injectables) ? cfg.injectables : [];
        const oral = Array.isArray(cfg.orals) ? cfg.orals : [];
        setHasInjectables(inj.some((i: { disabled?: boolean }) => !i.disabled));
        setHasOrals(oral.some((o: { disabled?: boolean }) => !o.disabled));
      })
      .catch(() => {
        setHasInjectables(false);
        setHasOrals(false);
      });
  }, [user]);

  useEffect(() => {
    checkMedications();
  }, [open, checkMedications]);

  const toggle = () => {
    checkMedications();
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
