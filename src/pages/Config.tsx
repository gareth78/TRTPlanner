/* eslint-disable no-alert */
import { useEffect, useState } from 'react';
import { GiSightDisabled } from 'react-icons/gi';
import { FaRegTrashAlt, FaExclamationTriangle } from 'react-icons/fa';
import { useUser } from '../UserContext';
import storageKey from '../storage';
import styles from './Config.module.css';

interface Medication {
  name: string;
  disabled?: boolean;
}

function Config() {
  const { uid } = useUser();
  const [name, setName] = useState('');
  const [injectables, setInjectables] = useState<Medication[]>([]);
  const [orals, setOrals] = useState<Medication[]>([]);
  const [injDragIndex, setInjDragIndex] = useState<number | null>(null);
  const [oralDragIndex, setOralDragIndex] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);

  const addInjectable = () => {
    setInjectables([...injectables, { name: '', disabled: false }]);
  };

  const addOral = () => {
    setOrals([...orals, { name: '', disabled: false }]);
  };

  const handleInjectableNameChange = (index: number, value: string) => {
    const updated = [...injectables];
    updated[index].name = value;
    setInjectables(updated);
  };

  const handleOralNameChange = (index: number, value: string) => {
    const updated = [...orals];
    updated[index].name = value;
    setOrals(updated);
  };

  const toggleInjectableDisable = (index: number) => {
    const updated = [...injectables];
    updated[index].disabled = !updated[index].disabled;
    setInjectables(updated);
  };

  const toggleOralDisable = (index: number) => {
    const updated = [...orals];
    updated[index].disabled = !updated[index].disabled;
    setOrals(updated);
  };

  const deleteInjectable = (index: number) => {
    // eslint-disable-next-line no-alert
    if (window.confirm('Are you sure you want to delete this entry?')) {
      setInjectables((prev) => {
        const updated = [...prev];
        updated.splice(index, 1);
        return updated;
      });
    }
  };

  const deleteOral = (index: number) => {
    // eslint-disable-next-line no-alert
    if (window.confirm('Are you sure you want to delete this entry?')) {
      setOrals((prev) => {
        const updated = [...prev];
        updated.splice(index, 1);
        return updated;
      });
    }
  };

  const handleInjectableDragStart = (index: number) => {
    setInjDragIndex(index);
  };

  const handleInjectableDrop = (index: number) => {
    if (injDragIndex === null || injDragIndex === index) return;
    const updated = [...injectables];
    const [moved] = updated.splice(injDragIndex, 1);
    updated.splice(index, 0, moved);
    setInjectables(updated);
    setInjDragIndex(null);
  };

  const handleOralDragStart = (index: number) => {
    setOralDragIndex(index);
  };

  const handleOralDrop = (index: number) => {
    if (oralDragIndex === null || oralDragIndex === index) return;
    const updated = [...orals];
    const [moved] = updated.splice(oralDragIndex, 1);
    updated.splice(index, 0, moved);
    setOrals(updated);
    setOralDragIndex(null);
  };

  useEffect(() => {
    const stored = localStorage.getItem(storageKey(uid, 'configSettings'));
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setName(parsed.name ?? '');
        const inj = Array.isArray(parsed.injectables)
          ? parsed.injectables
          : JSON.parse(
              localStorage.getItem(storageKey(uid, 'injectables')) || '[]',
            );
        const oral = Array.isArray(parsed.orals)
          ? parsed.orals
          : JSON.parse(localStorage.getItem(storageKey(uid, 'orals')) || '[]');
        setInjectables(
          Array.isArray(inj)
            ? inj.map((i: Medication) => ({
                name: i.name ?? '',
                disabled: i.disabled ?? false,
              }))
            : [],
        );
        setOrals(
          Array.isArray(oral)
            ? oral.map((o: Medication) => ({
                name: o.name ?? '',
                disabled: o.disabled ?? false,
              }))
            : [],
        );
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Failed to parse settings', e);
      }
    }
  }, [uid]);

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = {
      name,
      injectables,
      orals,
    };
    localStorage.setItem(
      storageKey(uid, 'configSettings'),
      JSON.stringify(data),
    );
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDeleteAll = () => {
    // eslint-disable-next-line no-alert
    if (
      window.confirm(
        'This will permanently delete all saved configuration and injectable data. Are you sure you want to continue?',
      )
    ) {
      localStorage.removeItem(storageKey(uid, 'configSettings'));
      localStorage.removeItem(storageKey(uid, 'injectables'));
      localStorage.removeItem(storageKey(uid, 'orals'));
      localStorage.removeItem('persist:root');
      setName('');
      setInjectables([]);
      setOrals([]);
      // eslint-disable-next-line no-alert
      window.alert('All data deleted.');
    }
  };

  return (
    <>
      <h1 className={styles.pageTitle}>General Configuration</h1>
      <form className={styles.container} onSubmit={handleSave}>
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>
            Name
            <input
              id="name"
              type="text"
              placeholder="Enter your name"
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
        </div>
        <h2 className={styles.sectionTitle}>Injectable Medication</h2>
        {injectables.map((inj, idx) => (
          <div
            key={idx} // eslint-disable-line react/no-array-index-key
            className={styles.injectableRow}
            draggable={injectables.length > 1}
            onDragStart={() => handleInjectableDragStart(idx)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleInjectableDrop(idx)}
          >
            {injectables.length > 1 && (
              <span className={styles.dragHandle}>⠿</span>
            )}
            <span className={styles.rowIndex}>{`${idx + 1}.`}</span>
            <input
              id={`inj-${idx}`}
              type="text"
              className={`${styles.input} ${styles.injectableInput} ${
                inj.disabled ? styles.disabledInput : ''
              }`}
              value={inj.name}
              disabled={inj.disabled}
              onChange={(e) => handleInjectableNameChange(idx, e.target.value)}
            />
            <div className={styles.injectableActions}>
              <button
                type="button"
                className={styles.iconButton}
                onClick={() => toggleInjectableDisable(idx)}
                aria-label={
                  inj.disabled ? 'Enable injectable' : 'Disable injectable'
                }
              >
                <GiSightDisabled size={20} />
              </button>
              <button
                type="button"
                className={styles.iconButton}
                onClick={() => deleteInjectable(idx)}
                aria-label="Delete injectable"
              >
                <FaRegTrashAlt size={20} />
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          className={styles.addButton}
          onClick={addInjectable}
        >
          Add another
        </button>

        <h2 className={styles.sectionTitle}>Oral Medication</h2>
        {orals.map((oral, idx) => (
          <div
            key={idx} // eslint-disable-line react/no-array-index-key
            className={styles.injectableRow}
            draggable={orals.length > 1}
            onDragStart={() => handleOralDragStart(idx)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleOralDrop(idx)}
          >
            {orals.length > 1 && <span className={styles.dragHandle}>⠿</span>}
            <span className={styles.rowIndex}>{`${idx + 1}.`}</span>
            <input
              id={`oral-${idx}`}
              type="text"
              className={`${styles.input} ${styles.injectableInput} ${
                oral.disabled ? styles.disabledInput : ''
              }`}
              value={oral.name}
              disabled={oral.disabled}
              onChange={(e) => handleOralNameChange(idx, e.target.value)}
            />
            <div className={styles.injectableActions}>
              <button
                type="button"
                className={styles.iconButton}
                onClick={() => toggleOralDisable(idx)}
                aria-label={oral.disabled ? 'Enable oral' : 'Disable oral'}
              >
                <GiSightDisabled size={20} />
              </button>
              <button
                type="button"
                className={styles.iconButton}
                onClick={() => deleteOral(idx)}
                aria-label="Delete oral"
              >
                <FaRegTrashAlt size={20} />
              </button>
            </div>
          </div>
        ))}
        <button type="button" className={styles.addButton} onClick={addOral}>
          Add another
        </button>
        <button type="submit" className={styles.saveButton}>
          Save
        </button>
        {saved && <div className={styles.savedMessage}>Settings saved!</div>}
        <div className={styles.deleteSection}>
          <button
            type="button"
            className={styles.deleteButton}
            onClick={handleDeleteAll}
          >
            <FaExclamationTriangle
              size={20}
              style={{ marginRight: '0.5rem' }}
            />
            Delete All
          </button>
        </div>
      </form>
    </>
  );
}

export default Config;
