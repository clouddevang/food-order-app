import { useEffect, useState } from "react";
import { getAuthToken } from "../firebase";

const CACHE_KEY = "meals_cache";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const useMeals = () => {
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMeals = async () => {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_TTL) {
          setMeals(data);
          setIsLoading(false);
          return;
        }
      }

      const token = await getAuthToken();
      const response = await fetch(
        `${import.meta.env.VITE_FIREBASE_URL}/meals.json?auth=${token}`
      );
      if (!response.ok) throw new Error("Could not fetch meals.");

      const responseData = await response.json();
      const loadedMeals = Object.keys(responseData).map((key) => ({
        id: key,
        name: responseData[key].name,
        description: responseData[key].description,
        price: responseData[key].price,
      }));

      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ data: loadedMeals, timestamp: Date.now() })
      );
      setMeals(loadedMeals);
      setIsLoading(false);
    };

    fetchMeals().catch((err) => {
      setError(err.message);
      setIsLoading(false);
    });
  }, []);

  return { meals, isLoading, error };
};

export default useMeals;
