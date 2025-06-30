import { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaSyringe, FaPlane, FaCog } from 'react-icons/fa';
import { GiMedicines } from 'react-icons/gi';
import { MdMenu, MdClose } from 'react-icons/md';
import version from '../version';
import logo from '../assets/MediTrack_logo_svg.svg';
import styles from './Sidebar.module.css';
import useOutsideClick from '../hooks/useOutsideClick';

function Sidebar() {
  const [open, setOpen] = useState(false);
  const [hasInjectables, setHasInjectables] = useState(false);
  const [hasOrals, setHasOrals] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const checkMedications = () => {
    try {
      const cfgRaw = localStorage.getItem('configSettings');
      const cfg = cfgRaw ? JSON.parse(cfgRaw) : {};
      const inj = Array.isArray(cfg.injectables)
        ? cfg.injectables
        : JSON.parse(localStorage.getItem('injectables') || '[]');
      const oral = Array.isArray(cfg.orals)
        ? cfg.orals
        : JSON.parse(localStorage.getItem('orals') || '[]');

      setHasInjectables(
        Array.isArray(inj) &&
          inj.some((i: { disabled?: boolean }) => !i.disabled),
      );
      setHasOrals(
        Array.isArray(oral) &&
          oral.some((o: { disabled?: boolean }) => !o.disabled),
      );
    } catch {
      setHasInjectables(false);
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
  }, [open]);

  const toggle = () => {
    checkMedications();
    setOpen((o) => !o);
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `${styles.link} ${isActive ? styles.active : ''}`;

  useOutsideClick(open, sidebarRef, buttonRef, () => setOpen(false));

  return (
    <>
      <button
        type="button"
        onClick={toggle}
        ref={buttonRef}
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
      <aside
        ref={sidebarRef}
        className={`${styles.sidebar} ${!open ? styles.closed : ''}`}
      >
        <div>
          <div className={styles.logoContainer}>
            <img src={logo} alt="MediTrack logo" className={styles.logo} />
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
