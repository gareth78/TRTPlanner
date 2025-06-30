import { useEffect, useState } from 'react';
import { GiSightDisabled } from 'react-icons/gi';
import { FaRegTrashAlt } from 'react-icons/fa';
import { useUser } from '../context/UserContext';
import { loadUserData, saveUserData } from '../services/userData';
import styles from './OralSchedule.module.css';

interface ScheduleEntry {
  medication: string;
  date: string;
  disabled?: boolean;
}

function OralSchedule() {
  const { user } = useUser();
  const [entries, setEntries] = useState<ScheduleEntry[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) return;
    loadUserData(user.uid)
      .then((data) => {
        const stored = data.oralSchedule;
        if (Array.isArray(stored)) {
          setEntries(
            stored.map((e: ScheduleEntry) => ({
              medication: e.medication ?? '',
              date: e.date ?? '',
              disabled: e.disabled ?? false,
            })),
          );
        }
      })
      .catch(() => setEntries([]));
  }, [user]);

  const handleMedicationChange = (idx: number, value: string) => {
    const updated = [...entries];
    updated[idx].medication = value;
    setEntries(updated);
  };

  const handleDateChange = (idx: number, value: string) => {
    const updated = [...entries];
    updated[idx].date = value;
    setEntries(updated);
  };

  const addEntry = () => {
    setEntries([...entries, { medication: '', date: '', disabled: false }]);
  };

  const toggleDisable = (idx: number) => {
    const updated = [...entries];
    updated[idx].disabled = !updated[idx].disabled;
    setEntries(updated);
  };

  const deleteEntry = (idx: number) => {
    // eslint-disable-next-line no-alert
    if (window.confirm('Are you sure you want to delete this entry?')) {
      setEntries((prev) => {
        const updated = [...prev];
        updated.splice(idx, 1);
        return updated;
      });
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    await saveUserData(user.uid, { oralSchedule: entries });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <>
      <h1 className={styles.pageTitle}>Oral Schedule</h1>
      <form className={styles.container} onSubmit={handleSave}>
        {entries.map((entry, idx) => (
          <div
            key={idx} // eslint-disable-line react/no-array-index-key
            className={styles.injectableRow}
          >
            <span className={styles.rowIndex}>{`${idx + 1}.`}</span>
            <input
              type="text"
              placeholder="Medication"
              className={`${styles.input} ${styles.injectableInput} ${
                entry.disabled ? styles.disabledInput : ''
              }`}
              value={entry.medication}
              disabled={entry.disabled}
              onChange={(e) => handleMedicationChange(idx, e.target.value)}
            />
            <input
              type="date"
              className={`${styles.input} ${styles.injectableInput} ${
                entry.disabled ? styles.disabledInput : ''
              }`}
              value={entry.date}
              disabled={entry.disabled}
              onChange={(e) => handleDateChange(idx, e.target.value)}
            />
            <div className={styles.injectableActions}>
              <button
                type="button"
                className={styles.iconButton}
                onClick={() => toggleDisable(idx)}
                aria-label={entry.disabled ? 'Enable entry' : 'Disable entry'}
              >
                <GiSightDisabled size={20} />
              </button>
              <button
                type="button"
                className={styles.iconButton}
                onClick={() => deleteEntry(idx)}
                aria-label="Delete entry"
              >
                <FaRegTrashAlt size={20} />
              </button>
            </div>
          </div>
        ))}
        <button type="button" className={styles.addButton} onClick={addEntry}>
          Add another
        </button>
        <button type="submit" className={styles.saveButton}>
          Save
        </button>
        {saved && <div className={styles.savedMessage}>Schedule saved!</div>}
      </form>
    </>
  );
}

export default OralSchedule;
