import { useEffect, useState } from 'react';
import styles from './InjectionSchedule.module.css';

interface Medication {
  name: string;
  disabled?: boolean;
}

interface CalendarState {
  [medication: string]: string[];
}

const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);

const addMonths = (date: Date, amount: number) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + amount);
  return d;
};

const isSameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();

const generateCalendar = (year: number, month: number) => {
  const first = new Date(year, month, 1);
  const start = new Date(first);
  start.setDate(first.getDate() - first.getDay());

  const weeks: Date[][] = [];
  let current = start;
  for (let w = 0; w < 6; w += 1) {
    const week: Date[] = [];
    for (let d = 0; d < 7; d += 1) {
      week.push(new Date(current));
      current = new Date(current);
      current.setDate(current.getDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
};

type CalendarProps = {
  selected: string[];
  onToggleDate: (date: string) => void;
};

function Calendar({ selected, onToggleDate }: CalendarProps) {
  const [monthOffset, setMonthOffset] = useState(0);
  const today = new Date();
  const firstMonth = startOfMonth(addMonths(today, monthOffset));
  const secondMonth = addMonths(firstMonth, 1);
  const selectedSet = new Set(selected);

  const renderMonth = (date: Date) => {
    const weeks = generateCalendar(date.getFullYear(), date.getMonth());
    const monthName = date.toLocaleString(undefined, {
      month: 'long',
      year: 'numeric',
    });

    return (
      <div className={styles.month}>
        <div className={styles.monthName}>{monthName}</div>
        <div className={styles.weekdays}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className={styles.weekday}>
              {d}
            </div>
          ))}
        </div>
        <div className={styles.days}>
          {weeks.flat().map((day) => {
            const inMonth = day.getMonth() === date.getMonth();
            const dayStr = day.toISOString().split('T')[0];
            const classes = [styles.day];
            if (!inMonth) classes.push(styles.otherMonth);
            if (isSameDay(day, today)) classes.push(styles.today);
            if (selectedSet.has(dayStr)) classes.push(styles.selected);
            return (
              <div
                key={dayStr}
                className={classes.join(' ')}
                role="button"
                tabIndex={0}
                onClick={() => onToggleDate(dayStr)}
                onKeyDown={(e) => e.key === 'Enter' && onToggleDate(dayStr)}
              >
                {day.getDate()}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.calendar}>
      <div className={styles.calendarNav}>
        <button
          type="button"
          className={styles.navButton}
          onClick={() => setMonthOffset((m) => m - 1)}
        >
          ‹
        </button>
        <button
          type="button"
          className={styles.navButton}
          onClick={() => setMonthOffset((m) => m + 1)}
        >
          ›
        </button>
      </div>
      <div className={styles.months}>{[firstMonth, secondMonth].map(renderMonth)}</div>
    </div>
  );
}

function InjectionSchedule() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [calendar, setCalendar] = useState<CalendarState>({});

  useEffect(() => {
    try {
      const cfgRaw = localStorage.getItem('configSettings');
      if (cfgRaw) {
        const cfg = JSON.parse(cfgRaw);
        if (Array.isArray(cfg.injectables)) {
          setMedications(
            cfg.injectables.filter(
              (i: Medication) => i.name && !i.disabled,
            ),
          );
        }
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to load config', err);
    }
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('injectionCalendar');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          setCalendar(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('injectionCalendar', JSON.stringify(calendar));
  }, [calendar]);

  const toggleDate = (med: string, date: string) => {
    setCalendar((prev) => {
      const current = new Set(prev[med] || []);
      if (current.has(date)) {
        current.delete(date);
      } else {
        current.add(date);
      }
      return { ...prev, [med]: Array.from(current).sort() };
    });
  };

  if (medications.length === 0) {
    return (
      <>
        <h1 className={styles.pageTitle}>Injection Schedule</h1>
        <div className={styles.container}>
          <p>No injectable medications enabled. Configure them first.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <h1 className={styles.pageTitle}>Injection Schedule</h1>
      {medications.map((med) => (
        <div key={med.name} className={styles.container}>
          <h2 className={styles.sectionTitle}>{med.name}</h2>
          <Calendar
            selected={calendar[med.name] || []}
            onToggleDate={(d) => toggleDate(med.name, d)}
          />
        </div>
      ))}
    </>
  );
}

export default InjectionSchedule;
