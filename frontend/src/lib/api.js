import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;
export const http = axios.create({ baseURL: API });

export const inr = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

export const WEATHER_CODES = {
  0: { label: "Clear", icon: "sun" },
  1: { label: "Mainly clear", icon: "sun" },
  2: { label: "Partly cloudy", icon: "cloud-sun" },
  3: { label: "Overcast", icon: "cloud" },
  45: { label: "Fog", icon: "cloud-fog" },
  48: { label: "Rime fog", icon: "cloud-fog" },
  51: { label: "Light drizzle", icon: "cloud-drizzle" },
  53: { label: "Drizzle", icon: "cloud-drizzle" },
  55: { label: "Heavy drizzle", icon: "cloud-drizzle" },
  61: { label: "Light rain", icon: "cloud-rain" },
  63: { label: "Rain", icon: "cloud-rain" },
  65: { label: "Heavy rain", icon: "cloud-rain" },
  71: { label: "Light snow", icon: "snowflake" },
  73: { label: "Snow", icon: "snowflake" },
  75: { label: "Heavy snow", icon: "snowflake" },
  80: { label: "Showers", icon: "cloud-rain" },
  81: { label: "Showers", icon: "cloud-rain" },
  82: { label: "Violent showers", icon: "cloud-rain" },
  95: { label: "Thunderstorm", icon: "cloud-lightning" },
  96: { label: "Thunderstorm+hail", icon: "cloud-lightning" },
  99: { label: "Severe storm", icon: "cloud-lightning" },
};
