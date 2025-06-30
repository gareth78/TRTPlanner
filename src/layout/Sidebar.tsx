import { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaSyringe, FaPlane, FaCog } from 'react-icons/fa';
import { GiMedicines } from 'react-icons/gi';
import { MdMenu, MdClose } from 'react-icons/md';
import version from '../version';
import logo from '../assets/MediTrack_logo_svg.svg';
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
    `flex items-center gap-2 p-2 rounded-md transition hover:bg-[var(--hover-bg)] hover:pl-3 hover:scale-105 ${
      isActive
        ? 'font-bold bg-[var(--accent-secondary)] text-white'
        : 'text-slate-100'
    }`;

  useOutsideClick(open, sidebarRef, buttonRef, () => setOpen(false));

  return (
    <>
      <button
        type="button"
        onClick={toggle}
        ref={buttonRef}
        className="fixed top-4 left-4 z-50 w-14 h-14 bg-[var(--accent-primary)] border-2 border-white rounded-full text-white shadow-md flex items-center justify-center transition-all hover:bg-[var(--hover-bg)] hover:shadow-lg"
        style={{ left: open ? 'calc(min(80vw, 250px) + 1rem)' : undefined }}
      >
        {open ? (
          <MdClose className="text-3xl transform rotate-180 transition" />
        ) : (
          <MdMenu className="text-3xl" />
        )}
      </button>
      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 w-[min(80vw,250px)] h-screen bg-gradient-to-b from-white via-gray-100 to-teal-700 shadow-lg p-4 flex flex-col justify-between rounded-r-lg transform transition-transform duration-300 z-40 ${!open ? '-translate-x-full' : ''}`}
      >
        <div>
          <div className="flex justify-center items-center mb-6 pt-4 pb-2">
            <img src={logo} alt="MediTrack logo" className="max-w-40 h-auto" />
          </div>
          <nav className="flex flex-col gap-4">
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
        <div className="text-center mt-4 text-xs text-white/70">v{version}</div>
      </aside>
    </>
  );
}

export default Sidebar;
