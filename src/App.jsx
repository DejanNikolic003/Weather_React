import { useEffect, useState } from "react";
import "./App.css";

const API_KEY = import.meta.env.VITE_API_KEY;

function App() {
  const [weather, setWeather] = useState({});
  const [search, setSearch] = useState("");

  const getWeather = async (loc) => {
    if (!loc) return;
    try {
      const response = await fetch(
        `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${loc}`
      );

      if (!response.ok) throw new Error("Failed to fetch weater");

      const result = await response.json();

      const { current, location } = result;

      setWeather({
        location: location.name,
        country: location.country,
        icon: current.condition.icon,
        text: current.condition.text,
        temp_c: current.temp_c,
        uv: current.uv,
        humidity: current.humidity,
      });
    } catch (error) {
      console.error("Error fetching weather:", error);
    }
  };

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            getWeather(`${latitude},${longitude}`);
          },
          () => {}
        );
      }
    };

    getLocation();
  }, []);

  return (
    <>
      <div>
        <input
          type="text"
          name="search"
          placeholder="Enter a location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          type="button"
          onClick={() => {
            if (!search) return;

            getWeather(search);
          }}
        >
          Search
        </button>
        {weather && (
          <>
            <div>{weather.location}</div>
            <img src={weather.icon} />
          </>
        )}
      </div>
    </>
  );
}

export default App;
