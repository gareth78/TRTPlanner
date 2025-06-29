import { useEffect, useState } from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';
import styles from './InjectionSchedule.module.css';

interface ScheduleItem {
  medication: string;
  date: string;
  time: string;
}

function InjectionSchedule() {
  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('injectionSchedule');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(
            parsed.map((i) => ({
              medication: i.medication ?? '',
              date: i.date ?? '',
              time: i.time ?? '',
            })),
          );
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Failed to parse schedule', e);
      }
    }
  }, []);

  const handleChange = (
    index: number,
    field: keyof ScheduleItem,
    value: string,
  ) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const addItem = () => {
    setItems([...items, { medication: '', date: '', time: '' }]);
  };

  const deleteItem = (index: number) => {
    // eslint-disable-next-line no-alert
    if (window.confirm('Delete this entry?')) {
      setItems((prev) => {
        const updated = [...prev];
        updated.splice(index, 1);
        return updated;
      });
    }
  };

  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDrop = (index: number) => {
    if (dragIndex === null || dragIndex === index) return;
    const updated = [...items];
    const [moved] = updated.splice(dragIndex, 1);
    updated.splice(index, 0, moved);
    setItems(updated);
    setDragIndex(null);
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    localStorage.setItem('injectionSchedule', JSON.stringify(items));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <>
      <h1 className={styles.pageTitle}>Injection Schedule</h1>
      <form className={styles.container} onSubmit={handleSave}>
        {items.map((item, idx) => (
          <div
            // eslint-disable-next-line react/no-array-index-key
            key={idx}
            className={styles.scheduleRow}
            draggable={items.length > 1}
            onDragStart={() => handleDragStart(idx)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(idx)}
          >
            {items.length > 1 && <span className={styles.dragHandle}>⠿</span>}
            <span className={styles.rowIndex}>{`${idx + 1}.`}</span>
            <input
              type="text"
              placeholder="Medication"
              className={`${styles.input} ${styles.medInput}`}
              value={item.medication}
              onChange={(e) => handleChange(idx, 'medication', e.target.value)}
            />
            <input
              type="date"
              className={styles.input}
              value={item.date}
              onChange={(e) => handleChange(idx, 'date', e.target.value)}
            />
            <input
              type="time"
              className={styles.input}
              value={item.time}
              onChange={(e) => handleChange(idx, 'time', e.target.value)}
            />
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.iconButton}
                onClick={() => deleteItem(idx)}
                aria-label="Delete entry"
              >
                <FaRegTrashAlt size={20} />
              </button>
            </div>
          </div>
        ))}
        <button type="button" className={styles.addButton} onClick={addItem}>
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

export default InjectionSchedule;
