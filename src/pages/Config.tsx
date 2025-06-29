import { useEffect, useState } from 'react';
import { GiSightDisabled } from 'react-icons/gi';
import { FaRegTrashAlt } from 'react-icons/fa';
import styles from './Config.module.css';

interface Injectable {
  name: string;
  disabled?: boolean;
}

function Config() {
  const [name, setName] = useState('');
  const [trt, setTrt] = useState('');
  const [hcg, setHcg] = useState('');
  const [injectablesEnabled, setInjectablesEnabled] = useState('');
  const [injectables, setInjectables] = useState<Injectable[]>([]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);

  const handleInjectablesEnabledChange = (value: string) => {
    setInjectablesEnabled(value);
    if (value === 'Yes' && injectables.length === 0) {
      setInjectables([{ name: '', disabled: false }]);
    }
    if (value !== 'Yes') {
      setInjectables([]);
    }
  };

  const addInjectable = () => {
    setInjectables([...injectables, { name: '', disabled: false }]);
  };

  const handleNameChange = (index: number, value: string) => {
    const updated = [...injectables];
    updated[index].name = value;
    setInjectables(updated);
  };

  const toggleDisable = (index: number) => {
    const updated = [...injectables];
    updated[index].disabled = !updated[index].disabled;
    setInjectables(updated);
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

  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDrop = (index: number) => {
    if (dragIndex === null || dragIndex === index) return;
    const updated = [...injectables];
    const [moved] = updated.splice(dragIndex, 1);
    updated.splice(index, 0, moved);
    setInjectables(updated);
    setDragIndex(null);
  };

  useEffect(() => {
    const stored = localStorage.getItem('configSettings');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setName(parsed.name ?? '');
        setTrt(parsed.trt ?? '');
        setHcg(parsed.hcg ?? '');
        setInjectablesEnabled(parsed.injectablesEnabled ?? '');
        if (Array.isArray(parsed.injectables)) {
          setInjectables(
            parsed.injectables.map((i: Injectable) => ({
              name: i.name ?? '',
              disabled: i.disabled ?? false,
            })),
          );
        } else {
          setInjectables([]);
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Failed to parse settings', e);
      }
    }
  }, []);

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = {
      name,
      trt,
      hcg,
      injectablesEnabled,
      injectables,
    };
    localStorage.setItem('configSettings', JSON.stringify(data));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
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
        <div className={styles.formGroup}>
          <label htmlFor="trt" className={styles.label}>
            Are you currently on TRT?
            <select
              id="trt"
              className={styles.select}
              value={trt}
              onChange={(e) => setTrt(e.target.value)}
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </label>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="hcg" className={styles.label}>
            Are you currently on HCG?
            <select
              id="hcg"
              className={styles.select}
              value={hcg}
              onChange={(e) => setHcg(e.target.value)}
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </label>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="injectablesEnabled" className={styles.label}>
            Are you taking any of the peptides or injectables you wish recorded?
            <select
              id="injectablesEnabled"
              className={styles.select}
              value={injectablesEnabled}
              onChange={(e) => handleInjectablesEnabledChange(e.target.value)}
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </label>
        </div>
        {injectablesEnabled === 'Yes' && (
          <>
            {injectables.map((inj, idx) => (
              <div
                key={idx} // eslint-disable-line react/no-array-index-key
                className={styles.injectableRow}
                draggable={injectables.length > 1}
                onDragStart={() => handleDragStart(idx)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(idx)}
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
                  onChange={(e) => handleNameChange(idx, e.target.value)}
                />
                <div className={styles.injectableActions}>
                  <button
                    type="button"
                    className={styles.iconButton}
                    onClick={() => toggleDisable(idx)}
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
          </>
        )}
        <button type="submit" className={styles.saveButton}>
          Save
        </button>
        {saved && <div className={styles.savedMessage}>Settings saved!</div>}
      </form>
    </>
  );
}

export default Config;
