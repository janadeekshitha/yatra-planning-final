import { useEffect, useState } from "react";
import { http } from "../lib/api";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import SafeImg from "./SafeImg";

export default function DestinationBento() {
  const [items, setItems] = useState([]);
  useEffect(() => { http.get("/destinations").then(r => setItems(r.data)).catch(()=>{}); }, []);
  if (items.length === 0) return null;
  const big = items[0], two = items[1], three = items[2], four = items[3], five = items[4], six = items[5];
  const Card = ({ d, className="", big=false }) => (
    <Link to={`/destination/${d.slug}`} data-testid={`destination-card-${d.slug}`} className={`group relative img-zoom overflow-hidden ${className}`}>
      <SafeImg src={d.hero_image} alt={d.name} className="w-full h-full object-cover"/>
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent"/>
      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white">
        <div className="overline opacity-80">{d.state}</div>
        <div className={`font-serif ${big ? "text-5xl sm:text-6xl" : "text-3xl"} mt-1 leading-none`}>{d.name}</div>
        <div className="mt-2 text-sm opacity-90 italic font-serif">{d.tagline}</div>
      </div>
      <ArrowUpRight className="absolute top-5 right-5 w-5 h-5 text-white/90 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" strokeWidth={1.3}/>
    </Link>
  );

  return (
    <section className="mt-28 lg:mt-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <div className="overline text-[#B84B20]">Curated · India</div>
            <h2 className="font-serif text-4xl sm:text-5xl mt-3 leading-none">Journeys worth remembering.</h2>
          </div>
          <Link to="/destinations" data-testid="view-all-destinations" className="btn-outline">All Destinations</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-[180px] md:auto-rows-[220px]">
          {big && <Card d={big} big className="md:col-span-7 md:row-span-2"/>}
          {two && <Card d={two} className="md:col-span-5"/>}
          {three && <Card d={three} className="md:col-span-5"/>}
          {four && <Card d={four} className="md:col-span-4"/>}
          {five && <Card d={five} className="md:col-span-4"/>}
          {six && <Card d={six} className="md:col-span-4"/>}
        </div>
      </div>
    </section>
  );
}
