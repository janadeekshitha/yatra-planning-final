import { useEffect, useState } from "react";
import { http, WEATHER_CODES } from "../lib/api";
import { Sun, Cloud, CloudRain, CloudSnow, CloudDrizzle, CloudFog, CloudLightning, CloudSun, Droplets, Wind } from "lucide-react";

const ICON = { sun: Sun, cloud: Cloud, "cloud-sun": CloudSun, "cloud-rain": CloudRain, snowflake: CloudSnow, "cloud-drizzle": CloudDrizzle, "cloud-fog": CloudFog, "cloud-lightning": CloudLightning };

export default function WeatherPanel({ lat, lon, city }) {
  const [w, setW] = useState(null);
  const [err, setErr] = useState(false);
  useEffect(() => {
    if (!lat || !lon) return;
    http.get(`/weather?lat=${lat}&lon=${lon}`).then(r=>setW(r.data)).catch(()=>setErr(true));
  }, [lat, lon]);

  if (err) return <div className="text-sm text-[#4A5568]">Weather unavailable.</div>;
  if (!w) return <div className="font-mono text-sm text-[#4A5568] animate-pulse">Reading the skies…</div>;

  const now = w.current || {};
  const nowMeta = WEATHER_CODES[now.weather_code] || WEATHER_CODES[0];
  const NowIcon = ICON[nowMeta.icon] || Sun;

  return (
    <div className="bg-white border border-[#E2D8CE] p-8" data-testid="weather-panel">
      <div className="overline text-[#1A237E]">Live · {city}</div>
      <div className="mt-4 flex items-end gap-6 flex-wrap">
        <NowIcon className="w-16 h-16 text-[#B84B20]" strokeWidth={1} />
        <div>
          <div className="font-serif text-6xl leading-none text-[#0A1128]">{Math.round(now.temperature_2m)}°<span className="text-2xl align-top ml-1">C</span></div>
          <div className="mt-2 text-sm text-[#4A5568]">{nowMeta.label}</div>
        </div>
        <div className="ml-auto grid grid-cols-2 gap-4 text-sm text-[#4A5568]">
          <div className="flex items-center gap-2"><Droplets className="w-4 h-4" strokeWidth={1.3}/>{now.relative_humidity_2m}% humidity</div>
          <div className="flex items-center gap-2"><Wind className="w-4 h-4" strokeWidth={1.3}/>{Math.round(now.wind_speed_10m)} km/h</div>
        </div>
      </div>
      <div className="ticket-dash my-6"/>
      <div className="grid grid-cols-5 gap-3">
        {(w.daily?.time || []).slice(0, 5).map((t, i) => {
          const code = w.daily.weather_code[i];
          const meta = WEATHER_CODES[code] || WEATHER_CODES[0];
          const I = ICON[meta.icon] || Sun;
          const d = new Date(t);
          return (
            <div key={t} className="text-center">
              <div className="overline text-[#4A5568]">{d.toLocaleDateString("en-IN", { weekday: "short" })}</div>
              <I className="w-7 h-7 mx-auto mt-2 text-[#1A237E]" strokeWidth={1.3}/>
              <div className="font-serif text-2xl mt-2">{Math.round(w.daily.temperature_2m_max[i])}°</div>
              <div className="text-xs text-[#4A5568]">{Math.round(w.daily.temperature_2m_min[i])}°</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
