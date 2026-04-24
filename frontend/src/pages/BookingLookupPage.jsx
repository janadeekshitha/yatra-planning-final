import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { http, inr } from "../lib/api";

export default function BookingLookupPage() {
  const [ref, setRef] = useState("");
  const [b, setB] = useState(null);
  const [err, setErr] = useState("");

  const lookup = async () => {
    setErr(""); setB(null);
    try {
      const r = await http.get(`/bookings/${ref.trim()}`);
      setB(r.data);
    } catch { setErr("No booking found with that reference."); }
  };

  return (
    <div className="App">
      <Navbar/>
      <main className="pt-28 pb-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="overline text-[#B84B20]">Lookup</div>
        <h1 className="font-serif text-5xl sm:text-6xl mt-3 leading-none">Find your booking</h1>
        <p className="mt-4 text-[#4A5568] max-w-xl">Enter the reference we issued at checkout (starts with <span className="font-mono">YTR-</span>).</p>
        <div className="mt-10 flex gap-4 max-w-xl">
          <input className="input-line flex-1 font-mono uppercase" placeholder="YTR-XXXXXXXX" value={ref} onChange={e=>setRef(e.target.value)} data-testid="booking-ref-input"/>
          <button className="btn-primary" onClick={lookup} data-testid="booking-lookup-button">Find</button>
        </div>
        {err && <div className="mt-6 text-sm text-[#D32F2F]" data-testid="lookup-error">{err}</div>}
        {b && (
          <div className="mt-10 bg-white border border-[#E2D8CE] p-8" data-testid="booking-result">
            <div className="overline text-[#1A237E]">Ref · {b.booking_ref} · <span className="uppercase text-[#B84B20]">{b.status}</span></div>
            <div className="font-serif text-4xl mt-3">{b.item.title}</div>
            <div className="italic font-serif text-[#4A5568]">{b.item.sub_title}</div>
            <div className="ticket-dash my-6"/>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <span className="overline text-[#4A5568]">Traveler</span><span className="text-right">{b.traveler_name} · {b.traveler_email}</span>
              {b.item.date && <><span className="overline text-[#4A5568]">Date</span><span className="text-right font-mono">{b.item.date}</span></>}
              <span className="overline text-[#4A5568]">Total</span><span className="text-right font-serif text-2xl text-[#1A237E]">{inr(b.amount)}</span>
              <span className="overline text-[#4A5568]">Payment</span><span className="text-right uppercase text-xs font-mono">{b.payment_status}</span>
            </div>
          </div>
        )}
      </main>
      <Footer/>
    </div>
  );
}
