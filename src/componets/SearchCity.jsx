import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SearchCity.module.css";

const BASE_URL = "https://nominatim.openstreetmap.org/search";

function SearchCity() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!query) return;

    setIsLoading(true);
    try {
      const res = await fetch(`${BASE_URL}?q=${query}&format=json`);
      const data = await res.json();
      if (data.length === 0) throw new Error("City not found");
      const { lat, lon } = data[0];

      navigate(`form?lat=${lat}&lng=${lon}`); 
      
      setQuery("");
    } catch (err) {
      alert("City not found, please try typing the name again...");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className={styles.searchForm} onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search for a city..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        disabled={isLoading}
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? "..." : "🔍"}
      </button>
    </form>
  );
}

export default SearchCity;