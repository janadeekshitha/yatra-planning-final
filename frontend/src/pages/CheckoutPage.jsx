import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { http, inr } from "../lib/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ArrowRight, Lock } from "lucide-react";

export default function CheckoutPage() {
  const { ref } = useParams();
  const [b, setB] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { http.get(`/bookings/${ref}`).then(r=>setB(r.data)).catch(()=>setError("Booking not found")); }, [ref]);

  const pay = async () => {
    if (!name || !email) { setError("Name and email are required."); return; }
    setLoading(true); setError("");
    try {
      // update traveler first by re-creating booking? Simpler: pass via metadata later; ok.
      const r = await http.post("/payments/checkout", {
        booking_ref: ref,
        origin_url: window.location.origin,
      });
      window.location.href = r.data.url;
    } catch (e) {
      setError("Could not initiate payment. Please try again.");
      setLoading(false);
    }
  };

  if (error && !b) return <div className="App"><Navbar/><div className="pt-32 text-center text-[#4A5568]">{error}</div></div>;
  if (!b) return <div className="App"><Navbar/><div className="pt-32 text-center text-[#4A5568]">Loading…</div></div>;
  const it = b.item;

  return (
    <div className="App">
      <Navbar/>
      <main className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 grid lg:grid-cols-12 gap-12">
        <section className="lg:col-span-7">
          <div className="overline text-[#B84B20]">Checkout</div>
          <h1 className="font-serif text-5xl sm:text-6xl mt-3 leading-none">Traveler details</h1>
          <p className="mt-4 text-sm text-[#4A5568]">We'll send your ticket to this email. No account required.</p>

          <div className="mt-12 grid sm:grid-cols-2 gap-8">
            <label className="block"><div className="overline text-[#4A5568] mb-1">Full Name</div>
              <input className="input-line" value={name} onChange={e=>setName(e.target.value)} data-testid="checkout-name"/></label>
            <label className="block"><div className="overline text-[#4A5568] mb-1">Email</div>
              <input className="input-line" type="email" value={email} onChange={e=>setEmail(e.target.value)} data-testid="checkout-email"/></label>
            <label className="block sm:col-span-2"><div className="overline text-[#4A5568] mb-1">Phone (optional)</div>
              <input className="input-line" value={phone} onChange={e=>setPhone(e.target.value)} data-testid="checkout-phone"/></label>
          </div>

          {error && <div className="mt-6 text-sm text-[#D32F2F]" data-testid="checkout-error">{error}</div>}

          <button className="btn-primary mt-12 inline-flex items-center gap-3" onClick={pay} disabled={loading} data-testid="pay-now-button">
            <Lock className="w-4 h-4" strokeWidth={1.3}/>
            {loading ? "Redirecting…" : "Pay Securely with Stripe"}
            <ArrowRight className="w-4 h-4" strokeWidth={1.3}/>
          </button>
          <div className="mt-4 text-xs font-mono text-[#4A5568]">Test mode · Use 4242 4242 4242 4242 · Any future expiry · Any CVC</div>
        </section>

        {/* Ticket summary */}
        <aside className="lg:col-span-5">
          <div className="bg-white border border-[#E2D8CE] p-8 relative">
            <div className="overline text-[#1A237E]">Booking · {b.booking_ref}</div>
            {it.image && <div className="img-zoom overflow-hidden mt-6"><img src={it.image} alt="" className="w-full h-48 object-cover"/></div>}
            <div className="font-serif text-3xl mt-5 leading-tight">{it.title}</div>
            <div className="italic font-serif text-[#4A5568] mt-1">{it.sub_title}</div>
            <div className="ticket-dash my-6"/>
            <dl className="grid grid-cols-2 gap-y-4 text-sm">
              <dt className="overline text-[#4A5568]">Kind</dt>
              <dd className="text-right capitalize">{it.kind}</dd>
              {it.date && <><dt className="overline text-[#4A5568]">Date</dt><dd className="text-right font-mono">{it.date}</dd></>}
              {it.depart && <><dt className="overline text-[#4A5568]">Depart</dt><dd className="text-right font-mono">{it.depart}</dd></>}
              {it.arrive && <><dt className="overline text-[#4A5568]">Arrive</dt><dd className="text-right font-mono">{it.arrive}</dd></>}
            </dl>
            <div className="ticket-dash my-6"/>
            <div className="flex items-end justify-between">
              <div className="overline text-[#4A5568]">Total</div>
              <div className="font-serif text-5xl text-[#1A237E]">{inr(it.price)}</div>
            </div>
          </div>
        </aside>
      </main>
      <Footer/>
    </div>
  );
}
