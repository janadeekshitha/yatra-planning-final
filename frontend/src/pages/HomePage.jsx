import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import DestinationBento from "../components/DestinationBento";
import { Compass, ShieldCheck, Sparkles, Wind } from "lucide-react";

export default function HomePage() {
  return (
    <div className="App">
      <Navbar />
      <main>
        <Hero />
        <DestinationBento />
        <Why />
        <Manifesto />
      </main>
      <Footer />
    </div>
  );
}

function Why() {
  const items = [
    { Icon: Compass, title: "Considered", copy: "Editorially-curated destinations, not algorithmic noise." },
    { Icon: Wind, title: "Weather-aware", copy: "Live 5-day forecasts stitched into every itinerary." },
    { Icon: ShieldCheck, title: "One-tap Booking", copy: "Flights, trains, buses & stays — checkout in under a minute." },
    { Icon: Sparkles, title: "Designed to Delight", copy: "Every pixel tuned for the joy of anticipation." },
  ];
  return (
    <section className="mt-28 lg:mt-40 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
      <div className="overline text-[#B84B20]">Why Yatra</div>
      <h2 className="font-serif text-4xl sm:text-5xl mt-3 leading-tight max-w-3xl">A new kind of travel partner, woven from old-world craft.</h2>
      <div className="mt-14 grid md:grid-cols-4 gap-10">
        {items.map(({Icon, title, copy}) => (
          <div key={title} className="border-t border-[#E2D8CE] pt-6">
            <Icon className="w-6 h-6 text-[#1A237E]" strokeWidth={1.3}/>
            <div className="font-serif text-2xl mt-4">{title}</div>
            <div className="mt-2 text-sm text-[#4A5568] leading-relaxed">{copy}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Manifesto() {
  return (
    <section className="mt-28 lg:mt-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 grid md:grid-cols-12 gap-10 items-center">
        <div className="md:col-span-5 img-zoom overflow-hidden">
          <img src="https://images.unsplash.com/photo-1705838617550-ae0573ebefc8?w=1200&q=85" alt="Kerala backwaters" className="w-full h-[500px] object-cover"/>
        </div>
        <div className="md:col-span-7 md:pl-10">
          <div className="overline text-[#B84B20]">Manifesto</div>
          <p className="font-serif text-3xl sm:text-4xl mt-6 leading-snug text-[#0A1128]">
            “Travel isn't a transaction. It is a <em className="text-[#B84B20]">ritual</em> — of
            anticipation, of arrival, of quiet return. We built Yatra to
            honour that ritual, one journey at a time.”
          </p>
          <div className="mt-8 font-mono text-xs overline text-[#4A5568]">— The Yatra Studio</div>
        </div>
      </div>
    </section>
  );
}
