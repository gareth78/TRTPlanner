import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from './InjectionSchedule.module.css';

export type Frequency = 'daily' | 'everyOther' | 'specific';

export interface ScheduleConfig {
  frequency: Frequency;
  anchor?: string;
  daysOfWeek?: number[];
}

interface DrugScheduleProps {
  name: string;
  editing: ScheduleConfig;
  isMobile: boolean;
  onFreqChange: (freq: Frequency) => void;
  onToggleDayOfWeek: (day: number) => void;
  onSetStartOption: (offset: number) => void;
  onApply: () => void;
  onReset: () => void;
  tileClassName: (args: { date: Date; view: string }) => string | undefined;
}

function DrugSchedule({
  name,
  editing,
  isMobile,
  onFreqChange,
  onToggleDayOfWeek,
  onSetStartOption,
  onApply,
  onReset,
  tileClassName,
}: DrugScheduleProps) {
  return (
    <section
      className={`${styles.calendarSection} ${styles.medicationSection}`}
    >
      <h2 className={styles.sectionTitle}>{name}</h2>
      <div className={styles.configSection}>
        <label htmlFor={`freq-${name}`} className={styles.label}>
          Frequency
          <select
            id={`freq-${name}`}
            className={styles.select}
            value={editing.frequency}
            onChange={(e) => onFreqChange(e.target.value as Frequency)}
          >
            <option value="daily">Every day</option>
            <option value="everyOther">Every other day</option>
            <option value="specific">Specific days of the week</option>
          </select>
        </label>
        {editing.frequency === 'everyOther' && (
          <div className={styles.startOptions}>
            <label htmlFor={`start-${name}-today`}>
              <input
                id={`start-${name}-today`}
                type="radio"
                name={`start-${name}`}
                checked={(() => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const anchor = editing.anchor
                    ? new Date(editing.anchor)
                    : today;
                  anchor.setHours(0, 0, 0, 0);
                  return anchor.getTime() === today.getTime();
                })()}
                onChange={() => onSetStartOption(0)}
              />
              Start today
            </label>
            <label htmlFor={`start-${name}-tomorrow`}>
              <input
                id={`start-${name}-tomorrow`}
                type="radio"
                name={`start-${name}`}
                checked={(() => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const tomorrow = new Date(today);
                  tomorrow.setDate(tomorrow.getDate() + 1);
                  const anchor = editing.anchor
                    ? new Date(editing.anchor)
                    : today;
                  anchor.setHours(0, 0, 0, 0);
                  return anchor.getTime() === tomorrow.getTime();
                })()}
                onChange={() => onSetStartOption(1)}
              />
              Start tomorrow
            </label>
          </div>
        )}
        {editing.frequency === 'specific' && (
          <div className={styles.daysOfWeek}>
            {[0, 1, 2, 3, 4, 5, 6].map((d) => (
              <div key={d} className={styles.dayToggle}>
                <input
                  id={`day-${name}-${d}`}
                  type="checkbox"
                  checked={editing.daysOfWeek?.includes(d) || false}
                  onChange={() => onToggleDayOfWeek(d)}
                />
                <label htmlFor={`day-${name}-${d}`}>
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d]}
                </label>
              </div>
            ))}
          </div>
        )}
        <div className={styles.buttonRow}>
          <button
            type="button"
            className={styles.applyButton}
            onClick={onApply}
          >
            Apply
          </button>
          <button
            type="button"
            className={styles.resetButton}
            onClick={onReset}
          >
            Reset
          </button>
        </div>
      </div>
      <Calendar
        showDoubleView={!isMobile}
        prev2Label={null}
        next2Label={null}
        tileClassName={tileClassName}
        className={styles.calendar}
      />
    </section>
  );
}

export default DrugSchedule;
