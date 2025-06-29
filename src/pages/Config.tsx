import { useEffect, useState } from 'react';
import styles from './Config.module.css';

function Config() {
  const [name, setName] = useState('');
  const [trt, setTrt] = useState('');
  const [hcg, setHcg] = useState('');
  const [injectablesEnabled, setInjectablesEnabled] = useState('');
  const [injectables, setInjectables] = useState<{ name: string }[]>([]);
  const [saved, setSaved] = useState(false);

  const handleInjectablesEnabledChange = (value: string) => {
    setInjectablesEnabled(value);
    if (value === 'Yes' && injectables.length === 0) {
      setInjectables([{ name: '' }]);
    }
    if (value !== 'Yes') {
      setInjectables([]);
    }
  };

  const addInjectable = () => {
    setInjectables([...injectables, { name: '' }]);
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
        setInjectables(parsed.injectables ?? []);
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
              // eslint-disable-next-line react/no-array-index-key
              <div className={styles.formGroup} key={idx}>
                <label htmlFor={`inj-${idx}`} className={styles.label}>
                  {`${idx + 1}. Name`}
                  <input
                    id={`inj-${idx}`}
                    type="text"
                    className={styles.input}
                    value={inj.name}
                    onChange={(e) => {
                      const updated = [...injectables];
                      updated[idx].name = e.target.value;
                      setInjectables(updated);
                    }}
                  />
                </label>
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
