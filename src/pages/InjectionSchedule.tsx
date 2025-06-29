import { useEffect, useState } from 'react';
import styles from './InjectionSchedule.module.css';

interface Medication {
  name: string;
  disabled?: boolean;
}

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function Calendar({ monthOffset }: { monthOffset: number }) {
  const today = new Date();
  const first = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  const year = first.getFullYear();
  const month = first.getMonth();
  const label = first.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  const startDay = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < startDay; i += 1) {
    cells.push(<div key={`b${i}`} className={styles.empty} />);
  }
  for (let d = 1; d <= daysInMonth; d += 1) {
    const isToday = monthOffset === 0 && d === today.getDate();
    cells.push(
      <div key={d} className={`${styles.day} ${isToday ? styles.today : ''}`}>{d}</div>,
    );
  }
  const remaining = (startDay + daysInMonth) % 7;
  if (remaining !== 0) {
    for (let i = 0; i < 7 - remaining; i += 1) {
      cells.push(<div key={`e${i}`} className={styles.empty} />);
    }
  }

  return (
    <div className={styles.calendar}>
      <div className={styles.calendarHeader}>{label}</div>
      <div className={styles.dayHeaders}>
        {days.map((d) => (
          <div key={d} className={styles.dayHeader}>
            {d}
          </div>
        ))}
      </div>
      <div className={styles.grid}>{cells}</div>
    </div>
  );
}

function MedicationSection({ name }: { name: string }) {
  const [offset, setOffset] = useState(0);
  return (
    <section className={styles.medSection}>
      <h2 className={styles.sectionTitle}>{name}</h2>
      <div className={styles.calendarNav}>
        <button type="button" onClick={() => setOffset((o) => o - 1)} className={styles.smallButton}>
          Previous
        </button>
        <button type="button" onClick={() => setOffset((o) => o + 1)} className={styles.smallButton}>
          Next
        </button>
      </div>
      <div className={styles.calendarWrapper}>
        <Calendar monthOffset={offset} />
        <Calendar monthOffset={offset + 1} />
      </div>
    </section>
  );
}

function InjectionSchedule() {
  const [injectables, setInjectables] = useState<Medication[]>([]);

  const loadInjectables = () => {
    try {
      const cfgRaw = localStorage.getItem('configSettings');
      const cfg = cfgRaw ? JSON.parse(cfgRaw) : {};
      const inj = Array.isArray(cfg.injectables)
        ? cfg.injectables
        : JSON.parse(localStorage.getItem('injectables') || '[]');
      const enabled = Array.isArray(inj)
        ? inj.filter((i: Medication) => i.name && !i.disabled)
        : [];
      setInjectables(enabled);
    } catch {
      setInjectables([]);
    }
  };

  useEffect(() => {
    loadInjectables();
    const handler = (e: StorageEvent) => {
      if (e.key === 'configSettings' || e.key === 'injectables') {
        loadInjectables();
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  return (
    <>
      <h1 className={styles.pageTitle}>Injection Schedule</h1>
      <div className={styles.container}>
        {injectables.length === 0 ? (
          <p className={styles.emptyState}>No injectable medications enabled.</p>
        ) : (
          injectables.map((inj) => <MedicationSection key={inj.name} name={inj.name} />)
        )}
      </div>
    </>
  );
}

export default InjectionSchedule;
