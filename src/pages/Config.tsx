import { useEffect, useState } from 'react';
import styles from './Config.module.css';

function Config() {
  const [name, setName] = useState('');
  const [trt, setTrt] = useState('');
  const [hcg, setHcg] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('configSettings');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setName(parsed.name ?? '');
        setTrt(parsed.trt ?? '');
        setHcg(parsed.hcg ?? '');
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Failed to parse settings', e);
      }
    }
  }, []);

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = { name, trt, hcg };
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
        <button type="submit" className={styles.saveButton}>
          Save
        </button>
        {saved && <div className={styles.savedMessage}>Settings saved!</div>}
      </form>
    </>
  );
}

export default Config;
