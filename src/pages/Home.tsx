import logo from '../assets/meditrack-logo-horizontal.png';
import styles from './Home.module.css';

function Home() {
  return (
    <div className={styles.home}>
      <div className={styles.card}>
        <img src={logo} alt="MediTrack Logo" className={styles.logo} />
        <h1 className={styles.title}>MediTrack</h1>
      </div>
    </div>
  );
}

export default Home;
