import { useEffect, useState } from 'react';
import styles from './Config.module.css';

function Config() {
  const [name, setName] = useState('');
  const [trt, setTrt] = useState('');
  const [hcg, setHcg] = useState('');
  const [saved, setSaved] = useState(false);
  const [useInjectables, setUseInjectables] = useState(false);
  const [injectables, setInjectables] = useState<{ name: string }[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('configSettings');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setName(parsed.name ?? '');
        setTrt(parsed.trt ?? '');
        setHcg(parsed.hcg ?? '');
        if (Array.isArray(parsed.injectables)) {
          setInjectables(parsed.injectables);
          setUseInjectables(parsed.injectables.length > 0);
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
      injectables: useInjectables
        ? injectables.filter((i) => i.name.trim() !== '')
        : [],
    };
    localStorage.setItem('configSettings', JSON.stringify(data));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addInjectable = () => {
    setInjectables((prev) => [...prev, { name: '' }]);
  };

  const removeInjectable = (index: number) => {
    setInjectables((prev) => prev.filter((_, i) => i !== index));
  };

  const updateInjectable = (index: number, value: string) => {
    setInjectables((prev) =>
      prev.map((inj, i) => (i === index ? { name: value } : inj))
    );
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
          <span className={styles.label}>
            Are you taking any of the peptides or injectables you wish recorded?
          </span>
          <label htmlFor="injectYes">
            <input
              id="injectYes"
              type="radio"
              name="injectables"
              checked={useInjectables}
              onChange={() => {
                setUseInjectables(true);
                if (injectables.length === 0) setInjectables([{ name: '' }]);
              }}
            />
            Yes
          </label>
          <label htmlFor="injectNo">
            <input
              id="injectNo"
              type="radio"
              name="injectables"
              checked={!useInjectables}
              onChange={() => setUseInjectables(false)}
            />
            No
          </label>
        </div>
        {useInjectables && (
          <div className={styles.formGroup}>
            <span className={styles.label}>Injectables</span>
            {injectables.map((inj, idx) => (
              // eslint-disable-next-line react/no-array-index-key
              <div key={idx} className={styles.formGroup}>
                <input
                  type="text"
                  className={styles.input}
                  placeholder={`Injectable ${idx + 1}`}
                  value={inj.name}
                  onChange={(e) => updateInjectable(idx, e.target.value)}
                />
                {injectables.length > 1 && (
                  <button
                    type="button"
                    className={styles.removeButton}
                    onClick={() => removeInjectable(idx)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className={styles.addButton}
              onClick={addInjectable}
            >
              Add another
            </button>
          </div>
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
