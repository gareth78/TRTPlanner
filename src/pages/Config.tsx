import { useState } from 'react';
import styles from './Config.module.css';

function Config() {
  const [name, setName] = useState('');
  const [trt, setTrt] = useState('');
  const [hcg, setHcg] = useState('');

  return (
    <div className={styles.container}>
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
    </div>
  );
}

export default Config;
