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
    setEditing((prev) => {
      const today = new Date();
      const anchor =
        freq === 'everyOther'
          ? prev[name].anchor || today.toISOString()
          : undefined;
      return {
        ...prev,
        [name]: { ...prev[name], frequency: freq, anchor },
      };
    });
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

  const setStartOption = (name: string, offset: number) => {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    setEditing((prev) => ({
      ...prev,
      [name]: { ...prev[name], anchor: date.toISOString() },
    }));
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
              {editing[m.name]?.frequency === 'everyOther' && (
                <div className={styles.startOptions}>
                  <label htmlFor={`start-${m.name}-today`}>
                    <input
                      id={`start-${m.name}-today`}
                      type="radio"
                      name={`start-${m.name}`}
                      checked={(() => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const anchor = editing[m.name]?.anchor
                          ? new Date(editing[m.name].anchor)
                          : today;
                        anchor.setHours(0, 0, 0, 0);
                        return anchor.getTime() === today.getTime();
                      })()}
                      onChange={() => setStartOption(m.name, 0)}
                    />
                    Start today
                  </label>
                  <label htmlFor={`start-${m.name}-tomorrow`}>
                    <input
                      id={`start-${m.name}-tomorrow`}
                      type="radio"
                      name={`start-${m.name}`}
                      checked={(() => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const tomorrow = new Date(today);
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        const anchor = editing[m.name]?.anchor
                          ? new Date(editing[m.name].anchor)
                          : today;
                        anchor.setHours(0, 0, 0, 0);
                        return anchor.getTime() === tomorrow.getTime();
                      })()}
                      onChange={() => setStartOption(m.name, 1)}
                    />
                    Start tomorrow
                  </label>
                </div>
              )}
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
