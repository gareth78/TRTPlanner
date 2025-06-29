import logo from '../assets/trt_logo.svg';
import styles from './Home.module.css';

function Home() {
  return (
    <div className={styles.home}>
      <div className={styles.card}>
        <img src={logo} alt="TRT Planner Logo" className={styles.logo} />
        <h1 className={styles.title}>TRT Planner</h1>
      </div>
    </div>
  );
}

export default Home;
