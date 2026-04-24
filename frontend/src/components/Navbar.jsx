import { Link, useLocation } from "react-router-dom";
import { Compass } from "lucide-react";

export default function Navbar() {
  const loc = useLocation();
  const on = (p) => loc.pathname === p;
  const Link2 = ({ to, children, testid }) => (
    <Link
      to={to}
      data-testid={testid}
      className={`text-sm tracking-wide transition-colors ${on(to) ? "text-[#B84B20]" : "text-[#0A1128] hover:text-[#B84B20]"}`}
    >
      {children}
    </Link>
  );
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#FDFBF7]/85 backdrop-blur-md border-b border-[#E2D8CE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between">
        <Link to="/" data-testid="brand-logo" className="flex items-center gap-2 group">
          <Compass className="w-5 h-5 text-[#1A237E] group-hover:rotate-45 transition-transform duration-500" strokeWidth={1.5} />
          <span className="font-serif text-2xl font-medium tracking-tight">
            yatra<span className="text-[#B84B20]">.</span>planning
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-10">
          <Link2 to="/" testid="nav-home">Home</Link2>
          <Link2 to="/destinations" testid="nav-destinations">Destinations</Link2>
          <Link2 to="/search/flights" testid="nav-flights">Flights</Link2>
          <Link2 to="/search/trains" testid="nav-trains">Trains</Link2>
          <Link2 to="/search/buses" testid="nav-buses">Buses</Link2>
          <Link2 to="/search/hotels" testid="nav-hotels">Hotels</Link2>
          <Link2 to="/booking-lookup" testid="nav-booking-lookup">My Booking</Link2>
        </nav>
      </div>
    </header>
  );
}
