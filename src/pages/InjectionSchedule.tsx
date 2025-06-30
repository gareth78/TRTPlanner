import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import useIsMobile from '../hooks/useIsMobile';
import 'react-calendar/dist/Calendar.css';
import styles from './InjectionSchedule.module.css';

interface Medication {
  name: string;
  disabled?: boolean;
}

type Frequency = 'daily' | 'everyOther' | 'specific';

interface ScheduleConfig {
  frequency: Frequency;
  anchor?: string; // ISO date string
  daysOfWeek?: number[];
}

interface ScheduleMap {
  [name: string]: ScheduleConfig;
}

function InjectionSchedule() {
  const [meds, setMeds] = useState<Medication[]>([]);
  const [configs, setConfigs] = useState<ScheduleMap>({});
  const [editing, setEditing] = useState<ScheduleMap>({});
  const isMobile = useIsMobile();

  useEffect(() => {
    try {
      const raw = localStorage.getItem('configSettings');
      const cfg = raw ? JSON.parse(raw) : {};
      const injectables: Medication[] = Array.isArray(cfg.injectables)
        ? cfg.injectables
        : JSON.parse(localStorage.getItem('injectables') || '[]');
      const active = injectables.filter((m) => m.name && !m.disabled);
      setMeds(active);

      const stored = localStorage.getItem('injectionSchedule');
      const parsed: ScheduleMap = stored ? JSON.parse(stored) : {};
      setConfigs(parsed);
      const edit: ScheduleMap = {};
      active.forEach((m) => {
        edit[m.name] =
          parsed[m.name] || { frequency: 'daily', daysOfWeek: [], anchor: undefined };
      });
      setEditing(edit);
    } catch {
      setMeds([]);
      setConfigs({});
      setEditing({});
    }
  }, []);

  const handleFreqChange = (name: string, freq: Frequency) => {
    setEditing((prev) => ({
      ...prev,
      [name]: { ...prev[name], frequency: freq },
    }));
  };

  const toggleDayOfWeek = (name: string, day: number) => {
    setEditing((prev) => {
      const days = prev[name].daysOfWeek || [];
      const updated = days.includes(day)
        ? days.filter((d) => d !== day)
        : [...days, day];
      return { ...prev, [name]: { ...prev[name], daysOfWeek: updated } };
    });
  };

  const applyConfig = (name: string) => {
    setConfigs((prev) => {
      const updated = { ...prev, [name]: editing[name] };
      localStorage.setItem('injectionSchedule', JSON.stringify(updated));
      return updated;
    });
  };

  const resetConfig = (name: string) => {
    setConfigs((prev) => {
      const updated = { ...prev };
      delete updated[name];
      localStorage.setItem('injectionSchedule', JSON.stringify(updated));
      return updated;
    });
    setEditing((prev) => ({
      ...prev,
      [name]: { frequency: 'daily', daysOfWeek: [], anchor: undefined },
    }));
  };

  const handleAnchorSelect = (name: string, date: Date) => {
    setEditing((prev) => ({
      ...prev,
      [name]: { ...prev[name], anchor: date.toISOString() },
    }));
    setConfigs((prev) => {
      const updated = {
        ...prev,
        [name]: { ...prev[name], anchor: date.toISOString(), frequency: 'everyOther' },
      };
      localStorage.setItem('injectionSchedule', JSON.stringify(updated));
      return updated;
    });
  };

  const tileClassName =
    (name: string) =>
    ({ date, view }: { date: Date; view: string }) => {
      if (view !== 'month') return undefined;
      const cfg = configs[name];
      if (!cfg) return undefined;
      if (cfg.frequency === 'daily') return styles.scheduledDay;
      if (cfg.frequency === 'everyOther' && cfg.anchor) {
        const diff = Math.round(
          (date.getTime() - new Date(cfg.anchor).getTime()) / 86400000,
        );
        return diff % 2 === 0 ? styles.scheduledDay : undefined;
      }
      if (cfg.frequency === 'specific' && cfg.daysOfWeek?.length) {
        return cfg.daysOfWeek.includes(date.getDay())
          ? styles.scheduledDay
          : undefined;
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
          <section
            key={m.name}
            className={`${styles.calendarSection} ${styles.medicationSection}`}
          >
            <h2 className={styles.sectionTitle}>{m.name}</h2>
            <div className={styles.configSection}>
              <label htmlFor={`freq-${m.name}`} className={styles.label}>
                Frequency
                <select
                  id={`freq-${m.name}`}
                  className={styles.select}
                  value={editing[m.name]?.frequency}
                  onChange={(e) =>
                    handleFreqChange(m.name, e.target.value as Frequency)
                  }
                >
                  <option value="daily">Every day</option>
                  <option value="everyOther">Every other day</option>
                  <option value="specific">Specific days of the week</option>
                </select>
              </label>
              {editing[m.name]?.frequency === 'specific' && (
                <div className={styles.daysOfWeek}>
                  {[0, 1, 2, 3, 4, 5, 6].map((d) => (
                    <div key={d} className={styles.dayToggle}>
                      <input
                        id={`day-${m.name}-${d}`}
                        type="checkbox"
                        checked={editing[m.name]?.daysOfWeek?.includes(d) || false}
                        onChange={() => toggleDayOfWeek(m.name, d)}
                      />
                      <label htmlFor={`day-${m.name}-${d}`}>{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d]}</label>
                    </div>
                  ))}
                </div>
              )}
              <div className={styles.buttonRow}>
                <button
                  type="button"
                  className={styles.applyButton}
                  onClick={() => applyConfig(m.name)}
                >
                  Apply
                </button>
                <button
                  type="button"
                  className={styles.resetButton}
                  onClick={() => resetConfig(m.name)}
                >
                  Reset
                </button>
              </div>
            </div>
            <Calendar
              showDoubleView={!isMobile}
              prev2Label={null}
              next2Label={null}
              onClickDay={(d) =>
                editing[m.name]?.frequency === 'everyOther' &&
                handleAnchorSelect(m.name, d)
              }
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
