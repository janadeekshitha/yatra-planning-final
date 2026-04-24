import SearchWidget from "./SearchWidget";
import { ArrowDownRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 grid lg:grid-cols-12 gap-10 lg:gap-14 pt-8 pb-20">
        {/* Left editorial */}
        <div className="lg:col-span-7 order-2 lg:order-1">
          <div className="overline text-[#B84B20] mb-6 animate-fade-up">Est. Travel Atelier · 2026</div>
          <h1 className="font-serif font-medium leading-[0.9] tracking-tighter text-[14vw] sm:text-[10vw] lg:text-[7.2rem] text-[#0A1128]">
            <span className="hero-letter" style={{animationDelay:"80ms"}}>Wander</span>{" "}
            <span className="hero-letter italic text-[#B84B20]" style={{animationDelay:"180ms"}}>well.</span><br/>
            <span className="hero-letter" style={{animationDelay:"280ms"}}>Book</span>{" "}
            <span className="hero-letter" style={{animationDelay:"360ms"}}>beautifully.</span>
          </h1>
          <p className="mt-8 max-w-xl text-[#4A5568] leading-relaxed">
            From the marble ghats of Varanasi to Himalayan meadows and Kerala's lazy backwaters — design a journey
            that feels less like a trip and more like a chapter. Flights, trains, buses, stays & weather — all in one ritual.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-6 max-w-md border-t border-[#E2D8CE] pt-6">
            <Stat n="180+" l="Destinations" />
            <Stat n="48hr" l="Avg. Planning" />
            <Stat n="4.9" l="Traveler Rating" />
          </div>
        </div>

        {/* Right image */}
        <div className="lg:col-span-5 order-1 lg:order-2 relative">
          <div className="img-zoom overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1712661200122-1574c0bca017?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400"
              alt="Jaipur palace"
              className="w-full h-[56vh] lg:h-[72vh] object-cover"
            />
          </div>
          <div className="hidden lg:flex absolute -bottom-6 -left-10 bg-white border border-[#E2D8CE] px-6 py-5 items-center gap-4 shadow-xl">
            <ArrowDownRight className="w-5 h-5 text-[#B84B20]" strokeWidth={1.2} />
            <div>
              <div className="font-serif text-2xl leading-none">Jaipur</div>
              <div className="overline text-[#4A5568] mt-1">Rajasthan · 28°C Clear</div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlapping widget */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 -mt-4 relative z-10">
        <SearchWidget />
      </div>
    </section>
  );
}

function Stat({ n, l }) {
  return (
    <div>
      <div className="font-serif text-3xl text-[#1A237E]">{n}</div>
      <div className="overline text-[#4A5568] mt-1">{l}</div>
    </div>
  );
}
