import { useState, useEffect, useRef, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaSyringe, FaPlane, FaCog } from 'react-icons/fa';
import { GiMedicines } from 'react-icons/gi';
import { MdMenu, MdClose } from 'react-icons/md';
import version from '../version';
import logo from '../assets/MediTrack_logo_svg.svg';
import AuthStatus from '../components/AuthStatus';
import { useUser } from '../UserContext';
import storageKey from '../storage';
import styles from './Sidebar.module.css';
import useOutsideClick from '../hooks/useOutsideClick';

function Sidebar() {
  const [open, setOpen] = useState(false);
  const [hasInjectables, setHasInjectables] = useState(false);
  const [hasOrals, setHasOrals] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { uid } = useUser();

  const checkMedications = useCallback(() => {
    try {
      const cfgRaw = localStorage.getItem(storageKey(uid, 'configSettings'));
      const cfg = cfgRaw ? JSON.parse(cfgRaw) : {};
      const inj = Array.isArray(cfg.injectables)
        ? cfg.injectables
        : JSON.parse(
            localStorage.getItem(storageKey(uid, 'injectables')) || '[]',
          );
      const oral = Array.isArray(cfg.orals)
        ? cfg.orals
        : JSON.parse(localStorage.getItem(storageKey(uid, 'orals')) || '[]');

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
  }, [uid]);

  useEffect(() => {
    checkMedications();
    const handle = (e: StorageEvent) => {
      if (
        e.key === storageKey(uid, 'injectables') ||
        e.key === storageKey(uid, 'orals') ||
        e.key === storageKey(uid, 'configSettings')
      ) {
        checkMedications();
      }
    };
    window.addEventListener('storage', handle);
    return () => window.removeEventListener('storage', handle);
  }, [open, uid, checkMedications]);

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
        className={`${styles.sidebar} sidebar-gradient ${!open ? styles.closed : ''}`}
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
            <div className="mt-4">
              <AuthStatus />
            </div>
            <div className="mt-6 text-center text-sm text-gray-500">
              v{version}
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
