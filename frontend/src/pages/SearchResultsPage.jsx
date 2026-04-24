import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SearchWidget from "../components/SearchWidget";
import { http, inr } from "../lib/api";
import { Plane, Train, Bus, BedDouble, Star, Clock, ArrowRight, SlidersHorizontal } from "lucide-react";

const TITLES = { flights: "Flights", trains: "Trains", buses: "Buses", hotels: "Stays" };
const ICONS = { flights: Plane, trains: Train, buses: Bus, hotels: BedDouble };

export default function SearchResultsPage() {
  const { type } = useParams();
  const [sp] = useSearchParams();
  const nav = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("price_asc");
  const [maxPrice, setMaxPrice] = useState(100000);

  const Icon = ICONS[type] || Plane;
  const title = TITLES[type] || "Search";

  const query = useMemo(() => Object.fromEntries([...sp.entries()]), [sp]);

  useEffect(() => {
    setLoading(true);
    const run = async () => {
      try {
        if (type === "hotels") {
          const r = await http.post("/search/hotels", {
            city: query.city || "Jaipur",
            check_in: query.check_in || new Date().toISOString().slice(0,10),
            check_out: query.check_out || new Date(Date.now()+2*864e5).toISOString().slice(0,10),
            guests: Number(query.guests || 2),
          });
          setItems(r.data.results);
        } else {
          const r = await http.post(`/search/${type}`, {
            origin: query.origin || "Delhi",
            destination: query.destination || "Jaipur",
            date: query.date || new Date().toISOString().slice(0,10),
            passengers: Number(query.passengers || 1),
          });
          setItems(r.data.results);
        }
      } finally { setLoading(false); }
    };
    run();
  }, [type, sp]);

  const priceKey = type === "hotels" ? "price_per_night" : "price";
  const sorted = useMemo(() => {
    let arr = [...items].filter(i => i[priceKey] <= maxPrice);
    if (sort === "price_asc") arr.sort((a,b)=>a[priceKey]-b[priceKey]);
    if (sort === "price_desc") arr.sort((a,b)=>b[priceKey]-a[priceKey]);
    return arr;
  }, [items, sort, maxPrice, priceKey]);

  const book = async (item) => {
    const bookingItem = mapToBookingItem(type, item);
    const r = await http.post("/bookings", {
      item: bookingItem,
      traveler_name: "Guest",
      traveler_email: "guest@yatra.planning",
    });
    nav(`/checkout/${r.data.booking_ref}`);
  };

  return (
    <div className="App">
      <Navbar/>
      <main className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center gap-3">
            <Icon className="w-5 h-5 text-[#B84B20]" strokeWidth={1.3}/>
            <div className="overline text-[#B84B20]">Results · {title}</div>
          </div>
          <h1 className="font-serif text-5xl sm:text-6xl mt-2 leading-none">
            {type === "hotels"
              ? <>Stays in <span className="italic text-[#B84B20]">{query.city || "Jaipur"}</span></>
              : <>{query.origin || "Delhi"} <span className="italic text-[#B84B20]">→</span> {query.destination || "Jaipur"}</>
            }
          </h1>
          <div className="mt-3 font-mono text-xs text-[#4A5568]">
            {type === "hotels"
              ? `${query.check_in} · ${query.check_out} · ${query.guests||2} guests`
              : `${query.date} · ${query.passengers||1} traveler`}
          </div>

          <div className="mt-8 border border-[#E2D8CE] bg-white p-6">
            <SearchWidget initial={type} compact />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 mt-10 grid lg:grid-cols-12 gap-10">
          {/* Filters */}
          <aside className="lg:col-span-3">
            <div className="border-t border-[#E2D8CE] pt-6 sticky top-24">
              <div className="flex items-center gap-2 overline text-[#1A237E]"><SlidersHorizontal className="w-3.5 h-3.5"/>Refine</div>
              <div className="mt-6">
                <div className="overline text-[#4A5568] mb-2">Sort</div>
                <select className="input-line" value={sort} onChange={e=>setSort(e.target.value)} data-testid="sort-select">
                  <option value="price_asc">Price · Low → High</option>
                  <option value="price_desc">Price · High → Low</option>
                </select>
              </div>
              <div className="mt-6">
                <div className="overline text-[#4A5568] mb-2">Max Price — {inr(maxPrice)}</div>
                <input type="range" min={1000} max={100000} step={500} value={maxPrice} onChange={e=>setMaxPrice(+e.target.value)} className="w-full accent-[#B84B20]" data-testid="price-slider"/>
              </div>
              <div className="mt-8 text-xs font-mono text-[#4A5568]">
                {sorted.length} of {items.length} options
              </div>
            </div>
          </aside>

          {/* Results */}
          <section className="lg:col-span-9">
            {loading ? (
              <div className="font-mono text-sm text-[#4A5568]">Gathering the best routes…</div>
            ) : sorted.length === 0 ? (
              <div className="text-[#4A5568]">No options match these filters.</div>
            ) : sorted.map((item, idx) => (
              <ResultCard key={item.id} idx={idx} type={type} item={item} onBook={() => book(item)} />
            ))}
          </section>
        </div>
      </main>
      <Footer/>
    </div>
  );
}

function ResultCard({ type, item, onBook, idx }) {
  if (type === "hotels") {
    return (
      <div className="grid grid-cols-12 gap-5 py-6 border-b border-[#E2D8CE] first:border-t" data-testid={`result-card-${idx}`}>
        <div className="col-span-12 sm:col-span-4 img-zoom overflow-hidden">
          <img src={item.image} alt={item.name} className="w-full h-full object-cover min-h-[200px]"/>
        </div>
        <div className="col-span-12 sm:col-span-5">
          <div className="overline text-[#1A237E]">{"★".repeat(item.stars)} · {item.location}</div>
          <div className="font-serif text-3xl mt-2 leading-tight">{item.name}</div>
          <div className="mt-2 flex items-center gap-2 text-sm text-[#4A5568]">
            <Star className="w-4 h-4 text-[#B84B20] fill-[#B84B20]" strokeWidth={0}/>
            {item.rating} · {item.reviews.toLocaleString("en-IN")} reviews
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {item.amenities.slice(0,5).map(a => (
              <span key={a} className="text-xs font-mono px-2 py-1 bg-[#F4EBE1] text-[#0A1128]">{a}</span>
            ))}
          </div>
        </div>
        <div className="col-span-12 sm:col-span-3 sm:text-right flex sm:flex-col justify-between sm:justify-end items-end gap-3">
          <div>
            <div className="overline text-[#4A5568]">per night</div>
            <div className="font-serif text-4xl text-[#1A237E]">{inr(item.price_per_night)}</div>
          </div>
          <button className="btn-primary" onClick={onBook} data-testid={`book-btn-${idx}`}>Book</button>
        </div>
      </div>
    );
  }
  const sub = type === "flights" ? `${item.airline} · ${item.flight_no}` : type === "trains" ? `${item.operator} · #${item.train_no}` : `${item.operator} · ${item.bus_type}`;
  return (
    <div className="grid grid-cols-12 gap-4 py-6 border-b border-[#E2D8CE] first:border-t items-center" data-testid={`result-card-${idx}`}>
      <div className="col-span-12 md:col-span-4">
        <div className="overline text-[#1A237E]">{sub}</div>
        {type === "buses" && <div className="mt-2 text-sm text-[#4A5568] flex items-center gap-2"><Star className="w-4 h-4 text-[#B84B20] fill-[#B84B20]" strokeWidth={0}/>{item.rating} · {item.seats_left} seats</div>}
        {type === "flights" && <div className="mt-2 text-sm text-[#4A5568]">{item.stop_info} · {item.class}</div>}
        {type === "trains" && <div className="mt-2 text-sm text-[#4A5568]">{item.classes.join(" · ")}</div>}
      </div>
      <div className="col-span-12 md:col-span-5 grid grid-cols-3 gap-2 items-center">
        <div>
          <div className="font-serif text-4xl leading-none">{item.depart}</div>
          <div className="overline text-[#4A5568] mt-1">{item.from}</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-xs font-mono text-[#4A5568]">
            <Clock className="w-3.5 h-3.5"/>{item.duration}
          </div>
          <div className="ticket-dash mt-2"/>
        </div>
        <div className="text-right">
          <div className="font-serif text-4xl leading-none">{item.arrive}</div>
          <div className="overline text-[#4A5568] mt-1">{item.to}</div>
        </div>
      </div>
      <div className="col-span-12 md:col-span-3 md:text-right flex md:flex-col justify-between items-end gap-3">
        <div>
          <div className="overline text-[#4A5568]">from</div>
          <div className="font-serif text-4xl text-[#1A237E]">{inr(item.price)}</div>
        </div>
        <button className="btn-primary inline-flex items-center gap-2" onClick={onBook} data-testid={`book-btn-${idx}`}>
          Book <ArrowRight className="w-4 h-4" strokeWidth={1.3}/>
        </button>
      </div>
    </div>
  );
}

function mapToBookingItem(type, it) {
  if (type === "hotels") {
    return {
      kind: "hotel", item_id: it.id, title: it.name, sub_title: it.location,
      date: `${it.check_in} → ${it.check_out}`, price: it.price_per_night,
      image: it.image, meta: { rating: it.rating, stars: it.stars, amenities: it.amenities },
    };
  }
  const subMap = {
    flights: `${it.airline} · ${it.flight_no}`,
    trains: `${it.operator} · #${it.train_no}`,
    buses: `${it.operator} · ${it.bus_type}`,
  };
  return {
    kind: type.slice(0,-1), item_id: it.id,
    title: `${it.from} → ${it.to}`, sub_title: subMap[type],
    date: it.date, depart: it.depart, arrive: it.arrive,
    price: it.price, meta: { duration: it.duration },
  };
}
