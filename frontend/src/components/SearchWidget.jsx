import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plane, Train, Bus, BedDouble, ArrowRight } from "lucide-react";

const TABS = [
  { key: "flights", label: "Flights", Icon: Plane },
  { key: "trains",  label: "Trains",  Icon: Train },
  { key: "buses",   label: "Buses",   Icon: Bus },
  { key: "hotels",  label: "Hotels",  Icon: BedDouble },
];

const today = () => new Date().toISOString().slice(0, 10);
const plus = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x.toISOString().slice(0, 10); };

export default function SearchWidget({ initial = "flights", compact = false }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState(initial);
  const [from, setFrom] = useState("Delhi");
  const [to, setTo]     = useState("Jaipur");
  const [date, setDate] = useState(plus(today(), 3));
  const [checkOut, setCheckOut] = useState(plus(today(), 5));
  const [city, setCity] = useState("Jaipur");
  const [travelers, setTravelers] = useState(1);

  const submit = () => {
    const params = new URLSearchParams();
    if (tab === "hotels") {
      params.set("city", city);
      params.set("check_in", date);
      params.set("check_out", checkOut);
      params.set("guests", travelers);
    } else {
      params.set("origin", from);
      params.set("destination", to);
      params.set("date", date);
      params.set("passengers", travelers);
    }
    navigate(`/search/${tab}?${params.toString()}`);
  };

  return (
    <div className={`bg-white border border-[#E2D8CE] ${compact ? "p-6" : "p-8 sm:p-10"}`} data-testid="search-widget">
      <div className="flex flex-wrap gap-x-8 gap-y-3 border-b border-[#E2D8CE] pb-3 mb-8">
        {TABS.map(({ key, label, Icon }) => {
          const active = tab === key;
          return (
            <button
              key={key}
              onClick={() => setTab(key)}
              data-testid={`tab-${key}`}
              className={`relative flex items-center gap-2 pb-2 text-sm font-medium transition-colors tab-underline ${active ? "text-[#1A237E]" : "text-[#4A5568] tab-inactive hover:text-[#0A1128]"}`}
            >
              <Icon className="w-4 h-4" strokeWidth={1.5} /> {label}
            </button>
          );
        })}
      </div>

      {tab !== "hotels" ? (
        <div className="grid md:grid-cols-4 gap-6">
          <Field label="From">
            <input className="input-line" value={from} onChange={e=>setFrom(e.target.value)} data-testid="input-from" />
          </Field>
          <Field label="To">
            <input className="input-line" value={to} onChange={e=>setTo(e.target.value)} data-testid="input-to" />
          </Field>
          <Field label="Journey Date">
            <input type="date" className="input-line" value={date} onChange={e=>setDate(e.target.value)} data-testid="input-date" />
          </Field>
          <Field label="Travelers">
            <input type="number" min={1} max={9} className="input-line" value={travelers} onChange={e=>setTravelers(+e.target.value || 1)} data-testid="input-travelers" />
          </Field>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 gap-6">
          <Field label="City">
            <input className="input-line" value={city} onChange={e=>setCity(e.target.value)} data-testid="input-city" />
          </Field>
          <Field label="Check-In">
            <input type="date" className="input-line" value={date} onChange={e=>setDate(e.target.value)} data-testid="input-checkin" />
          </Field>
          <Field label="Check-Out">
            <input type="date" className="input-line" value={checkOut} onChange={e=>setCheckOut(e.target.value)} data-testid="input-checkout" />
          </Field>
          <Field label="Guests">
            <input type="number" min={1} max={9} className="input-line" value={travelers} onChange={e=>setTravelers(+e.target.value || 1)} data-testid="input-guests" />
          </Field>
        </div>
      )}

      <div className="mt-10 flex items-center justify-between gap-4 flex-wrap">
        <div className="font-mono text-xs text-[#4A5568]">
          <span className="overline text-[#1A237E]">Search</span>
          <span className="mx-3">—</span>
          Flexible dates · Best prices first
        </div>
        <button className="btn-primary inline-flex items-center gap-3" onClick={submit} data-testid="search-submit-button">
          Search Journeys <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <div className="overline text-[#4A5568] mb-1">{label}</div>
      {children}
    </label>
  );
}
