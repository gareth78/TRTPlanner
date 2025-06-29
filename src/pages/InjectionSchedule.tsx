import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from './InjectionSchedule.module.css';

interface Medication {
  name: string;
  disabled?: boolean;
}

interface Selections {
  [name: string]: Date[];
}

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

function InjectionSchedule() {
  const [meds, setMeds] = useState<Medication[]>([]);
  const [dates, setDates] = useState<Selections>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem('configSettings');
      const cfg = raw ? JSON.parse(raw) : {};
      const injectables: Medication[] = Array.isArray(cfg.injectables)
        ? cfg.injectables
        : JSON.parse(localStorage.getItem('injectables') || '[]');
      setMeds(injectables.filter((m) => m.name && !m.disabled));
    } catch {
      setMeds([]);
    }
  }, []);

  const toggleDate = (name: string, date: Date) => {
    setDates((prev) => {
      const arr = prev[name] || [];
      const exists = arr.some((d) => sameDay(d, date));
      const updated = exists
        ? arr.filter((d) => !sameDay(d, date))
        : [...arr, date];
      return { ...prev, [name]: updated };
    });
  };

  const tileClassName =
    (name: string) =>
    ({ date, view }: { date: Date; view: string }) => {
      if (view === 'month' && dates[name]?.some((d) => sameDay(d, date))) {
        return styles.selectedDay;
      }
      return undefined;
    };

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Injection Schedule</h1>
      {meds.length === 0 ? (
        <p className={styles.emptyState}>
          No enabled injectable medications found.
        </p>
      ) : (
        meds.map((m) => (
          <section key={m.name} className={styles.calendarSection}>
            <h2 className={styles.sectionTitle}>{m.name}</h2>
            <Calendar
              showDoubleView
              prev2Label={null}
              next2Label={null}
              onClickDay={(d) => toggleDate(m.name, d)}
              tileClassName={tileClassName(m.name)}
              className={styles.calendar}
            />
          </section>
        ))
      )}
    </div>
  );
}

export default InjectionSchedule;
