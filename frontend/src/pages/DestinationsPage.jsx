import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SafeImg from "../components/SafeImg";
import { http } from "../lib/api";
import { Link } from "react-router-dom";

export default function DestinationsPage() {
  const [items, setItems] = useState([]);
  useEffect(() => { http.get("/destinations").then(r=>setItems(r.data)).catch(()=>{}); }, []);
  return (
    <div className="App">
      <Navbar/>
      <main className="pt-28 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="overline text-[#B84B20]">Explore</div>
        <h1 className="font-serif text-5xl sm:text-6xl mt-3 leading-none">All Destinations</h1>
        <p className="mt-4 text-[#4A5568] max-w-xl">Eight hand-picked passages across India — each shaped by a distinct mood, climate, and culture.</p>

        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(d => (
            <Link to={`/destination/${d.slug}`} key={d.slug} data-testid={`destination-link-${d.slug}`} className="group card-hover block">
              <div className="img-zoom overflow-hidden">
                <SafeImg src={d.hero_image} alt={d.name} className="w-full h-[360px] object-cover"/>
              </div>
              <div className="p-5 border border-t-0 border-[#E2D8CE] bg-white">
                <div className="overline text-[#1A237E]">{d.state}</div>
                <div className="font-serif text-3xl mt-2">{d.name}</div>
                <div className="italic font-serif text-[#4A5568] mt-1">{d.tagline}</div>
                <div className="mt-3 text-xs font-mono text-[#B84B20]">Best · {d.best_time}</div>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer/>
    </div>
  );
}
