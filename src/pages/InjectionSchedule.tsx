import { useEffect, useState } from 'react';
import useIsMobile from '../hooks/useIsMobile';
import 'react-calendar/dist/Calendar.css';
import DrugSchedule from './DrugSchedule';
import type { Frequency, ScheduleConfig } from './DrugSchedule';
import styles from './InjectionSchedule.module.css';
import { useUser } from '../UserContext';
import { loadSchedule, saveSchedule } from '../firebase';

interface Medication {
  name: string;
  disabled?: boolean;
}

interface ScheduleMap {
  [name: string]: ScheduleConfig;
}

function InjectionSchedule() {
  const [meds, setMeds] = useState<Medication[]>([]);
  const [configs, setConfigs] = useState<ScheduleMap>({});
  const [editing, setEditing] = useState<ScheduleMap>({});
  const isMobile = useIsMobile();
  const [activeDrug, setActiveDrug] = useState('');
  const { uid } = useUser();
  const [loading, setLoading] = useState(true);

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
        edit[m.name] = parsed[m.name] || {
          frequency: 'daily',
          daysOfWeek: [],
          anchor: undefined,
        };
      });
      setEditing(edit);
      if (active.length > 0) {
        setActiveDrug((cur) =>
          cur && active.some((a) => a.name === cur) ? cur : active[0].name,
        );
      }
    } catch {
      setMeds([]);
      setConfigs({});
      setEditing({});
    }
  }, []);

  useEffect(() => {
    const fetch = async () => {
      if (!uid || meds.length === 0) {
        setLoading(false);
        return;
      }
      try {
        const parsed: ScheduleMap = {};
        await Promise.all(
          meds.map(async (m) => {
            const data = await loadSchedule(uid, m.name);
            if (data) parsed[m.name] = data as ScheduleConfig;
          }),
        );
        setConfigs((prev) => ({ ...prev, ...parsed }));
        setEditing((prev) => {
          const edit = { ...prev };
          meds.forEach((m) => {
            edit[m.name] = parsed[m.name] || edit[m.name];
          });
          return edit;
        });
      } catch (err) {
        console.error('Failed to load schedules', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid, meds]);

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
    if (uid) {
      saveSchedule(uid, name, editing[name]).catch((err) => {
        // eslint-disable-next-line no-console
        console.error('Failed to save schedule', err);
      });
    }
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
    if (uid) {
      saveSchedule(uid, name, {
        frequency: 'daily',
        daysOfWeek: [],
        anchor: undefined,
      }).catch((err) => {
        // eslint-disable-next-line no-console
        console.error('Failed to reset schedule', err);
      });
    }
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

  const renderContent = () => {
    if (loading) {
      return <p className={styles.emptyState}>Loading schedules...</p>;
    }
    if (meds.length === 0) {
      return (
        <p className={styles.emptyState}>
          No enabled injectable medications found.
        </p>
      );
    }
    return (
      <>
        <div role="tablist" className="mb-4 flex space-x-4 font-bold text-lg">
          {meds.map((m) => (
            <button
              key={m.name}
              type="button"
              role="tab"
              aria-selected={activeDrug === m.name}
              className={`focus:outline-none ${
                activeDrug === m.name ? 'border-b-2 border-blue-600' : 'text-gray-500'
              }`}
              onClick={() => setActiveDrug(m.name)}
            >
              {m.name}
            </button>
          ))}
        </div>
        {meds.map((m) =>
          activeDrug === m.name ? (
            <DrugSchedule
              key={m.name}
              name={m.name}
              editing={editing[m.name]}
              isMobile={isMobile}
              onFreqChange={(f) => handleFreqChange(m.name, f)}
              onToggleDayOfWeek={(d) => toggleDayOfWeek(m.name, d)}
              onSetStartOption={(o) => setStartOption(m.name, o)}
              onApply={() => applyConfig(m.name)}
              onReset={() => resetConfig(m.name)}
              tileClassName={tileClassName(m.name)}
            />
          ) : null,
        )}
      </>
    );
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Injection Schedule</h1>
      {renderContent()}
    </div>
  );
}

export default InjectionSchedule;
