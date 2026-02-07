import { useCities } from "../Context/CitiesContext";
import styles from "./Stats.module.css";

function Stats() {
  const { cities } = useCities();
  const numCities = cities.length;

  const uniqueCountries = new Set(
    cities.map((city) => city.country)
  ).size;

  const percentage = Math.round((uniqueCountries / 195) * 100);
  if (!cities.length) return null;

  return (
    <div className={styles.stats}>
      <h2>Trip Statistics 🌍</h2>
    
      <div className={styles.statRow}>
        <div className={styles.statItem}>
          <strong>{numCities}</strong>
          <span>Cities</span>
        </div>
        <div className={styles.statItem}>
          <strong>{uniqueCountries}</strong>
          <span>Countries</span>
        </div>
      </div>

      <div className={styles.progressContainer}>
        <div className={styles.labels}>
          <span>World Exploration</span>
          <span>{percentage}%</span>
        </div>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill} 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default Stats;