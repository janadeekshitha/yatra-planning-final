export default function Footer() {
  return (
    <footer className="mt-32 border-t border-[#E2D8CE] bg-[#F4EBE1]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 grid md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <div className="font-serif text-3xl">yatra<span className="text-[#B84B20]">.</span>planning</div>
          <p className="mt-4 text-sm text-[#4A5568] max-w-sm leading-relaxed">
            Curated journeys, real-time weather, and effortless bookings —
            woven into a single, unhurried travel ritual.
          </p>
        </div>
        <div>
          <div className="overline text-[#1A237E]">Explore</div>
          <ul className="mt-4 space-y-2 text-sm">
            <li>Destinations</li><li>Flights</li><li>Trains</li><li>Buses</li><li>Hotels</li>
          </ul>
        </div>
        <div>
          <div className="overline text-[#1A237E]">Studio</div>
          <ul className="mt-4 space-y-2 text-sm">
            <li>About Yatra</li><li>Press</li><li>Careers</li><li>Contact</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[#E2D8CE]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-6 flex flex-col md:flex-row gap-3 justify-between text-xs text-[#4A5568]">
          <div>© 2026 Yatra Planning. Woven with care in India.</div>
          <div className="flex gap-6"><span>Privacy</span><span>Terms</span><span>Cookies</span></div>
        </div>
      </div>
    </footer>
  );
}
