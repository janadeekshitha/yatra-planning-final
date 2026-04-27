import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WeatherPanel from "../components/WeatherPanel";
import SafeImg from "../components/SafeImg";
import { http } from "../lib/api";
import { MapPin, Calendar, ArrowRight } from "lucide-react";

export default function DestinationDetailPage() {
  const { slug } = useParams();
  const [d, setD] = useState(null);
  useEffect(() => { http.get(`/destinations/${slug}`).then(r=>setD(r.data)).catch(()=>{}); }, [slug]);
  if (!d) return <div className="App"><Navbar/><div className="pt-32 text-center text-[#4A5568]">Loading…</div></div>;

  return (
    <div className="App">
      <Navbar />
      <main className="pt-16">
        {/* Hero */}
        <section className="relative">
          <div className="img-zoom overflow-hidden">
            <SafeImg src={d.hero_image} alt={d.name} className="w-full h-[80vh] object-cover"/>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"/>
          <div className="absolute bottom-0 left-0 right-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pb-14 text-white">
              <div className="overline opacity-90">{d.state}</div>
              <h1 className="font-serif text-7xl sm:text-8xl mt-3 leading-none">{d.name}</h1>
              <div className="mt-4 font-serif italic text-2xl opacity-90">{d.tagline}</div>
            </div>
          </div>
        </section>

        {/* About + Weather */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 -mt-10 relative z-10 grid md:grid-cols-12 gap-8">
          <div className="md:col-span-7 bg-white border border-[#E2D8CE] p-8">
            <div className="overline text-[#B84B20]">About</div>
            <p className="mt-4 font-serif text-2xl leading-snug text-[#0A1128]">{d.about}</p>
            <div className="mt-6 flex gap-8 text-sm text-[#4A5568]">
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[#1A237E]" strokeWidth={1.3}/>{d.state}</div>
              <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-[#1A237E]" strokeWidth={1.3}/>Best · {d.best_time}</div>
            </div>
          </div>
          <div className="md:col-span-5">
            <WeatherPanel lat={d.lat} lon={d.lon} city={d.name} />
          </div>
        </section>

        {/* Places */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 mt-24">
          <div className="overline text-[#B84B20]">Places to Visit</div>
          <h2 className="font-serif text-4xl sm:text-5xl mt-3 leading-none">Where to wander</h2>
          <div className="mt-12 grid md:grid-cols-2 gap-8">
            {d.places.map((p, i) => (
              <div key={p.name} data-testid={`place-card-${i}`} className="grid grid-cols-12 gap-5 card-hover">
                <div className="col-span-5 img-zoom overflow-hidden">
                  <SafeImg src={p.img} alt={p.name} className="w-full h-full object-cover min-h-[180px]"/>
                </div>
                <div className="col-span-7 py-2">
                  <div className="overline text-[#1A237E]">No. {String(i+1).padStart(2,"0")}</div>
                  <div className="font-serif text-2xl mt-2">{p.name}</div>
                  <div className="mt-2 text-sm text-[#4A5568] leading-relaxed">{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 mt-24">
          <div className="bg-[#0A1128] text-white p-10 md:p-16 grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8">
              <div className="overline text-[#D4A373]">Plan your yatra</div>
              <h3 className="font-serif text-4xl sm:text-5xl mt-3 leading-tight">Ready to journey to {d.name}?</h3>
              <p className="mt-4 text-sm opacity-80 max-w-xl">Curate flights, trains, buses, and heritage stays — all from a single, unhurried dashboard.</p>
            </div>
            <div className="md:col-span-4 flex flex-col gap-3">
              <Link to={`/search/flights?origin=Delhi&destination=${d.name}&date=${new Date(Date.now()+3*864e5).toISOString().slice(0,10)}`} className="btn-primary text-center inline-flex items-center justify-center gap-2" data-testid="cta-flights">
                Find Flights <ArrowRight className="w-4 h-4" strokeWidth={1.3}/>
              </Link>
              <Link to={`/search/hotels?city=${d.name}&check_in=${new Date(Date.now()+3*864e5).toISOString().slice(0,10)}&check_out=${new Date(Date.now()+5*864e5).toISOString().slice(0,10)}`} className="btn-outline bg-transparent border-white text-white hover:bg-white/10 text-center inline-flex items-center justify-center gap-2" data-testid="cta-hotels">
                Find Stays <ArrowRight className="w-4 h-4" strokeWidth={1.3}/>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
