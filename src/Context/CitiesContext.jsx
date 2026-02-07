import { createContext, useContext, useEffect, useReducer } from "react";
import { useAuth } from "./FaceAuthContext";
import supabase from "../services/supabase";

const CitiesContext = createContext();
const BASE_URL = "http://localhost:9000";

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "city/updated":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.map((city) =>
          city.id === action.payload.id ? action.payload : city,
        ),
        currentCity: action.payload,
      };
    case "loading":
      return { ...state, isLoading: true };
    case "city/loaded":
      return { ...state, currentCity: action.payload, isLoading: false };
    case "cities/loaded":
      return { ...state, cities: action.payload, isLoading: false };
    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };
    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };
    case "rejected":
      return { ...state, isLoading: false, error: action.payload };
    default:
      return state;
  }
}

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState,
  );

  const { user } = useAuth();

  useEffect(
    function () {
      if (!user) {
        dispatch({ type: "cities/loaded", payload: [] });
        return;
      }

      async function fetchCities() {
        dispatch({ type: "loading" });

        try {
          const { data, error } = await supabase
            .from("cities")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

          if (error) throw new Error("Could not load cities");

          dispatch({ type: "cities/loaded", payload: data });
        } catch {
          dispatch({
            type: "rejected",
            payload: "There was an error loading cities...",
          });
        }
      }

      fetchCities();
    },
    [user],
  );

  async function getCity(id) {
    if (Number(id) === currentCity.id) return;

    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();
      dispatch({ type: "city/loaded", payload: data });
    } catch {
      dispatch({ type: "rejected", payload: "There was an error loading the city..." });
    }
  }

  async function createCity(newCity) {
    dispatch({ type: "loading" });

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error("User not logged in");
      const newCityWithId = {
        ...newCity,
        user_id: session.user.id,
      };
      const { data, error } = await supabase
        .from("cities")
        .insert([newCityWithId])
        .select();
      if (error) throw new Error("Could not create city");
      dispatch({ type: "city/created", payload: data[0] });
    } catch (err) {
      dispatch({
        type: "rejected",
        payload: "There was an error creating the city...",
      });
    }
  }

  async function deleteCity(id) {
    dispatch({ type: "loading" });

    try {
      const { error } = await supabase.from("cities").delete().eq("id", id);
      if (error) throw new Error("Could not delete city");
      dispatch({ type: "city/deleted", payload: id });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error deleting the city...",
      });
    }
  }

  async function updateCity(id, newCityData) {
    dispatch({ type: "loading" });
    try {
      const { data, error } = await supabase
        .from("cities")
        .update(newCityData)
        .eq("id", id)
        .select();

      if (error) throw new Error("Could not update city");
      dispatch({ type: "city/updated", payload: data[0] });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error updating the city...",
      });
    }
  }

  return (
    <CitiesContext.Provider
      value={{ cities, isLoading, currentCity, error, getCity, createCity, deleteCity, updateCity }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("CitiesContext was used outside the CitiesProvider");
  return context;
}
// eslint-disable-next-line react-refresh/only-export-components
export { CitiesProvider, useCities };
