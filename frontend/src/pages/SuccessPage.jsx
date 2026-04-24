import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { http, inr } from "../lib/api";
import { Check, Loader2, XCircle } from "lucide-react";

export default function SuccessPage() {
  const [sp] = useSearchParams();
  const sid = sp.get("session_id");
  const ref = sp.get("ref");
  const [state, setState] = useState("polling"); // polling | paid | expired | error
  const [booking, setBooking] = useState(null);
  const attempts = useRef(0);

  useEffect(() => {
    if (!sid) { setState("error"); return; }
    const tick = async () => {
      try {
        const r = await http.get(`/payments/status/${sid}`);
        if (r.data.payment_status === "paid") {
          setState("paid");
          if (ref) {
            const bk = await http.get(`/bookings/${ref}`);
            setBooking(bk.data);
          }
          return;
        }
        if (r.data.status === "expired") { setState("expired"); return; }
        attempts.current += 1;
        if (attempts.current >= 10) { setState("error"); return; }
        setTimeout(tick, 2000);
      } catch {
        attempts.current += 1;
        if (attempts.current >= 10) { setState("error"); return; }
        setTimeout(tick, 2000);
      }
    };
    tick();
  }, [sid, ref]);

  return (
    <div className="App">
      <Navbar />
      <main className="pt-28 pb-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-10">
        {state === "polling" && (
          <div className="text-center py-20">
            <Loader2 className="w-10 h-10 text-[#1A237E] mx-auto animate-spin" strokeWidth={1.2}/>
            <div className="overline text-[#B84B20] mt-6">Confirming</div>
            <h1 className="font-serif text-5xl mt-3">Weaving your ticket…</h1>
          </div>
        )}
        {state === "paid" && (
          <div className="bg-white border border-[#E2D8CE] p-10 md:p-14 grain-overlay">
            <div className="inline-flex items-center gap-2 overline text-[#2E7D32]">
              <Check className="w-4 h-4" strokeWidth={1.5}/> Payment received
            </div>
            <h1 className="font-serif text-6xl mt-4 leading-none">Yatra confirmed.</h1>
            {booking && <>
              <div className="mt-2 font-mono text-xs text-[#4A5568]">Ref · {booking.booking_ref}</div>
              <div className="ticket-dash my-8"/>
              <div className="grid md:grid-cols-5 gap-8">
                {booking.item.image && <div className="md:col-span-2 img-zoom overflow-hidden"><img src={booking.item.image} alt="" className="w-full h-52 object-cover"/></div>}
                <div className="md:col-span-3">
                  <div className="overline text-[#1A237E] capitalize">{booking.item.kind}</div>
                  <div className="font-serif text-4xl mt-2 leading-tight">{booking.item.title}</div>
                  <div className="italic font-serif text-[#4A5568] mt-1">{booking.item.sub_title}</div>
                  <div className="mt-5 grid grid-cols-2 gap-y-3 text-sm">
                    {booking.item.date && <><span className="overline text-[#4A5568]">Date</span><span className="text-right font-mono">{booking.item.date}</span></>}
                    {booking.item.depart && <><span className="overline text-[#4A5568]">Depart</span><span className="text-right font-mono">{booking.item.depart}</span></>}
                    {booking.item.arrive && <><span className="overline text-[#4A5568]">Arrive</span><span className="text-right font-mono">{booking.item.arrive}</span></>}
                    <span className="overline text-[#4A5568]">Total paid</span><span className="text-right font-serif text-2xl text-[#1A237E]">{inr(booking.amount)}</span>
                  </div>
                </div>
              </div>
            </>}
            <div className="mt-10 flex gap-3 flex-wrap">
              <Link to="/" className="btn-primary">Return Home</Link>
              <Link to="/destinations" className="btn-outline">Plan Another Journey</Link>
            </div>
          </div>
        )}
        {state === "expired" && (
          <Errorish title="Session expired" body="Your payment session timed out before we could confirm it. Please try again." />
        )}
        {state === "error" && (
          <Errorish title="Could not verify payment" body="We couldn't confirm your payment in time. If your card was charged, check your email for the ticket." />
        )}
      </main>
      <Footer/>
    </div>
  );
}

function Errorish({ title, body }) {
  return (
    <div className="text-center py-20">
      <XCircle className="w-10 h-10 text-[#D32F2F] mx-auto" strokeWidth={1.2}/>
      <div className="overline text-[#D32F2F] mt-6">Unresolved</div>
      <h1 className="font-serif text-5xl mt-3">{title}</h1>
      <p className="mt-4 text-[#4A5568] max-w-xl mx-auto">{body}</p>
      <Link to="/" className="btn-primary mt-8 inline-block">Return Home</Link>
    </div>
  );
}
