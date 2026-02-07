// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"
import "react-datepicker/dist/react-datepicker.css";
import { useEffect, useState } from "react";

import styles from "./Form.module.css";
import Button from "./Button";
import ButtonBack from "./ButtonBack";
import { useUrlPosition } from "../Hooks/useUrlPosition";
import Message from "./Message";
import DatePicker from "react-datepicker";
import { useCities } from "../Context/CitiesContext";
import { useNavigate } from "react-router-dom";
import supabase from "../services/supabase";

function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  const [mapLat, mapLng] = useUrlPosition();
  const [cityName, setCityName] = useState("");
  const { createCity, isLoading } = useCities();
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingCityData, setIsLoadingCityData] = useState(false);
  const [emoji, setEmoji] = useState("");
  const [codingError, setCodingError] = useState("");

  const navigate = useNavigate();

  useEffect(
    function () {
      if (!mapLat || !mapLng) return;
      async function fetchCityData() {
        try {
          setIsLoadingCityData(true);
          setCodingError("");
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${mapLat}&longitude=${mapLng}`,
          );
          const data = await res.json();
          if (!data.countryCode)
            throw new Error("No country found for the provided coordinates");
          setCityName(data.city || data.locality || "");
          setCountry(data.countryName || "");
          setEmoji(convertToEmoji(data.countryCode));
        } catch (err) {
          setCodingError(err.message);
        } finally {
          setIsLoadingCityData(false);
        }
      }
      if (mapLat && mapLng) fetchCityData();
    },
    [mapLat, mapLng],
  );

  async function handleSubmit(e) {
    e.preventDefault();
    if (!cityName || !date) return;
    let imagePath = null;

    if (file) {
      setIsUploading(true);
      const fileName = `${Math.random()}-${file.name}`.replaceAll("/", "");
      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(fileName, file);

      if (uploadError) {
        alert("Failed to upload the image, please try again");
        setIsUploading(false);
        return;
      }

      const { data } = supabase.storage.from("images").getPublicUrl(fileName);
      imagePath = data.publicUrl;
      setIsUploading(false)
    }

    const newCity = {
      cityName,
      country,
      date,
      notes,
      position: {
        lat: mapLat,
        lng: mapLng,
      },
      emoji,
      imageUrl: imagePath,
    };
    await createCity(newCity);
    navigate("/app/cities");
  }

  if (isLoadingCityData) return <Message message="Loading city data..." />;
  if (!mapLat || !mapLng) return <Message message="No position selected yet..." />;
  if (codingError) return <Message message={codingError} />;

  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ""}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <DatePicker selected={date} onChange={(date) => setDate(date)} id="date" />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea id="notes" onChange={(e) => setNotes(e.target.value)} value={notes} />
      </div>

      <div className={styles.row}>
        <label htmlFor="image">Trip Photo 📸</label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          disabled={isUploading}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <ButtonBack />
      </div>
    </form>
  );
}

export default Form;
