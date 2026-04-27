# Yatra Planning — PRD

## Original Problem Statement
> "make a really attractive website really really atractive travel planning, it should have booking of travel flights, train, bus and it should have hotel bookings, weather detections, places to visit in that locations, name of the app should be yatra planning and everything should work properly and should look really really attractive really attractive and inovative"

## User Choices (locked)
- Booking flow: simulated mock data (no paid APIs)
- Weather: Open-Meteo (free, no key) + offline fallback
- Places: curated database of Indian destinations
- Auth: guest only (no accounts)
- Payment: Stripe test integration (`sk_test_emergent`)

## Architecture
- React 19 + Tailwind 3 + shadcn/ui (Cormorant Garamond + Outfit fonts) — light, editorial, asymmetric layout
- FastAPI + Motor (MongoDB) + emergentintegrations Stripe + httpx
- All backend routes prefixed `/api`; frontend uses `REACT_APP_BACKEND_URL`
- Collections: `bookings`, `payment_transactions`

## User Personas
- **Traveler (guest)**: discovers destinations, checks weather, books flights/trains/buses/hotels with Stripe test card.
- **Student / demo viewer**: opens the project in VS Code locally with the README to show real working booking + payment flows.

## Core Requirements (static)
1. Bookable: flights, trains, buses, hotels (mock results, deterministic).
2. Curated Destinations module with hero, About, Places to Visit, 5-day Weather.
3. Stripe test checkout with success/cancel redirects and DB-backed transactions.
4. Guest booking lookup by `YTR-XXXXXXXX` reference.
5. Distinctive editorial design (no AI-slop palette / fonts / layouts).

## Implemented (2026-04-27 → 2026-04-27)
- ✅ 8 curated destinations (Jaipur, Kerala, Manali, Goa, Ladakh, Udaipur, Varanasi, Darjeeling) with verified imagery
- ✅ Hero + asymmetric search widget with tabs (flights / trains / buses / hotels)
- ✅ Bento destination grid + dedicated /destinations listing
- ✅ Destination detail with weather panel + Open-Meteo (auto-fallback on rate limit)
- ✅ Magazine-style results lists with sort + price slider
- ✅ Booking creation, lookup, Stripe checkout, status polling, success page with ticket UI
- ✅ Stripe sandbox-proxy fallback (creates work but proxy can't retrieve sessions; trusts redirect)
- ✅ SafeImg component with onError fallback to prevent broken images
- ✅ VS Code local-setup README at `/app/README.md`
- ✅ 23/23 backend pytest cases pass; frontend E2E verified by testing agent

## Backlog (P1)
- [ ] Multi-traveler passenger details on checkout (currently single guest)
- [ ] Booking email confirmation (Resend/SendGrid)
- [ ] Real flight/train/bus inventory (Amadeus / RailAPI / RedBus)
- [ ] Itinerary builder (combine flight + hotel + activities into one cart)
- [ ] User accounts + saved trips

## Backlog (P2)
- [ ] Multi-currency support
- [ ] Map view for destinations
- [ ] Reviews / ratings on hotels
- [ ] Promo codes & loyalty
- [ ] Production observability (Sentry, structured logs)
- [ ] Split server.py into routers (destinations.py, search.py, payments.py)

## Code-review notes (deferred)
- `logger` defined at bottom of `server.py` — works at call-time, but cleaner to hoist.
- `STRIPE_API_KEY` defaulted to "" — consider failing fast at startup.
- `@app.on_event('shutdown')` is deprecated — migrate to FastAPI lifespan.
- Payment-status fallback trusts the redirect; harden with webhook-only confirmation in production.
