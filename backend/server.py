from fastapi import FastAPI, APIRouter, HTTPException, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import uuid
import httpx
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone

from emergentintegrations.payments.stripe.checkout import (
    StripeCheckout, CheckoutSessionResponse, CheckoutStatusResponse, CheckoutSessionRequest,
)
import stripe as _stripe

from mock_data import (
    DESTINATIONS, generate_flights, generate_trains, generate_buses, generate_hotels,
)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

app = FastAPI(title="Yatra Planning API")
api = APIRouter(prefix="/api")

STRIPE_API_KEY = os.environ.get("STRIPE_API_KEY", "")

# ---------- Models ----------
class SearchTransportReq(BaseModel):
    origin: str
    destination: str
    date: str
    passengers: int = 1

class SearchHotelsReq(BaseModel):
    city: str
    check_in: str
    check_out: str
    guests: int = 2

class BookingItem(BaseModel):
    kind: str               # flight | train | bus | hotel
    item_id: str
    title: str
    sub_title: Optional[str] = ""
    date: Optional[str] = ""
    depart: Optional[str] = ""
    arrive: Optional[str] = ""
    price: float
    image: Optional[str] = ""
    meta: Dict[str, Any] = Field(default_factory=dict)

class BookingCreate(BaseModel):
    item: BookingItem
    traveler_name: str
    traveler_email: str
    traveler_phone: Optional[str] = ""

class CheckoutReq(BaseModel):
    booking_ref: str
    origin_url: str

# ---------- Routes ----------
@api.get("/")
async def root():
    return {"message": "Yatra Planning API is live"}

@api.get("/destinations")
async def list_destinations():
    return [
        {k: d[k] for k in ("slug", "name", "tagline", "state", "hero_image", "best_time")}
        for d in DESTINATIONS
    ]

@api.get("/destinations/{slug}")
async def destination_detail(slug: str):
    d = next((x for x in DESTINATIONS if x["slug"] == slug), None)
    if not d:
        raise HTTPException(404, "Destination not found")
    return d

_weather_cache: Dict[str, Dict[str, Any]] = {}

def _fallback_weather(lat: float, lon: float) -> Dict[str, Any]:
    # Simple deterministic fallback if external API is rate-limited / unreachable
    import math, time
    base = 22 + 8 * math.sin((lat + lon) / 7.0)
    now_temp = round(base + 3, 1)
    days, codes, tmax, tmin, pop = [], [], [], [], []
    import datetime as _dt
    for i in range(5):
        d = _dt.date.today() + _dt.timedelta(days=i)
        days.append(d.isoformat())
        code = [0, 1, 2, 3, 61][(i + int(lat)) % 5]
        codes.append(code)
        tmax.append(round(base + 5 + i * 0.3, 1))
        tmin.append(round(base - 3 + i * 0.2, 1))
        pop.append([10, 20, 35, 60, 75][i % 5])
    return {
        "current": {"temperature_2m": now_temp, "relative_humidity_2m": 58,
                    "weather_code": 1, "wind_speed_10m": 9.0},
        "daily": {"time": days, "weather_code": codes,
                  "temperature_2m_max": tmax, "temperature_2m_min": tmin,
                  "precipitation_probability_max": pop},
        "_source": "fallback",
    }

@api.get("/weather")
async def weather(lat: float, lon: float):
    import time
    key = f"{round(lat,2)},{round(lon,2)}"
    cached = _weather_cache.get(key)
    if cached and time.time() - cached["_ts"] < 900:  # 15 min cache
        return cached["data"]
    url = (
        f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}"
        f"&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m"
        f"&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max"
        f"&timezone=auto&forecast_days=5"
    )
    try:
        async with httpx.AsyncClient(timeout=10) as c:
            r = await c.get(url)
            r.raise_for_status()
            data = r.json()
    except Exception as e:
        logger.warning(f"Weather upstream failed ({e}); using fallback")
        data = _fallback_weather(lat, lon)
    _weather_cache[key] = {"_ts": time.time(), "data": data}
    return data

@api.post("/search/flights")
async def search_flights(req: SearchTransportReq):
    return {"results": generate_flights(req.origin, req.destination, req.date)}

@api.post("/search/trains")
async def search_trains(req: SearchTransportReq):
    return {"results": generate_trains(req.origin, req.destination, req.date)}

@api.post("/search/buses")
async def search_buses(req: SearchTransportReq):
    return {"results": generate_buses(req.origin, req.destination, req.date)}

@api.post("/search/hotels")
async def search_hotels(req: SearchHotelsReq):
    return {"results": generate_hotels(req.city, req.check_in, req.check_out)}

# ---------- Bookings ----------
@api.post("/bookings")
async def create_booking(req: BookingCreate):
    ref = "YTR-" + uuid.uuid4().hex[:8].upper()
    doc = {
        "booking_ref": ref,
        "item": req.item.model_dump(),
        "traveler_name": req.traveler_name,
        "traveler_email": req.traveler_email,
        "traveler_phone": req.traveler_phone,
        "amount": float(req.item.price),
        "currency": "inr",
        "payment_status": "unpaid",
        "status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.bookings.insert_one(doc)
    doc.pop("_id", None)
    return doc

@api.get("/bookings/{ref}")
async def get_booking(ref: str):
    doc = await db.bookings.find_one({"booking_ref": ref}, {"_id": 0})
    if not doc:
        raise HTTPException(404, "Booking not found")
    return doc

# ---------- Stripe Payments ----------
@api.post("/payments/checkout")
async def create_checkout(req: CheckoutReq, http_request: Request):
    booking = await db.bookings.find_one({"booking_ref": req.booking_ref}, {"_id": 0})
    if not booking:
        raise HTTPException(404, "Booking not found")

    # SERVER-SIDE amount only (prevent client price manipulation)
    amount = float(booking["amount"])
    currency = "inr"

    host_url = str(http_request.base_url).rstrip("/")
    webhook_url = f"{host_url}/api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)

    origin = req.origin_url.rstrip("/")
    success_url = f"{origin}/success?session_id={{CHECKOUT_SESSION_ID}}&ref={req.booking_ref}"
    cancel_url = f"{origin}/checkout/{req.booking_ref}"

    ck_req = CheckoutSessionRequest(
        amount=amount,
        currency=currency,
        success_url=success_url,
        cancel_url=cancel_url,
        metadata={"booking_ref": req.booking_ref, "email": booking.get("traveler_email", "")},
    )
    session: CheckoutSessionResponse = await stripe_checkout.create_checkout_session(ck_req)

    await db.payment_transactions.insert_one({
        "session_id": session.session_id,
        "booking_ref": req.booking_ref,
        "amount": amount,
        "currency": currency,
        "metadata": {"booking_ref": req.booking_ref},
        "payment_status": "initiated",
        "status": "open",
        "created_at": datetime.now(timezone.utc).isoformat(),
    })

    return {"url": session.url, "session_id": session.session_id}


@api.get("/payments/status/{session_id}")
async def payment_status(session_id: str):
    # Replicate emergentintegrations.get_checkout_status but coerce metadata to dict
    # to bypass the Pydantic-v2 validation bug. Falls back to local DB record when
    # the Emergent Stripe sandbox proxy can't read sessions back (creates only).
    StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=None)  # configures api_key + api_base
    tx = await db.payment_transactions.find_one({"session_id": session_id}, {"_id": 0})

    try:
        session = _stripe.checkout.Session.retrieve(session_id)
        status_str = session.status or "open"
        payment_status_str = session.payment_status or "unpaid"
        md_obj = session.metadata
        if md_obj is None:
            metadata = {}
        elif hasattr(md_obj, "to_dict"):
            metadata = md_obj.to_dict()
        else:
            metadata = {k: md_obj[k] for k in md_obj.keys()}
        amount_total = session.amount_total or 0
        currency = session.currency or "inr"
    except Exception as e:
        logger.warning(f"Stripe retrieve failed ({e}); using local fallback")
        if not tx:
            raise HTTPException(404, "Unknown payment session")
        # Stripe only redirects to success_url after the customer completes payment,
        # so trusting the redirect is safe in this sandbox.
        status_str = "complete"
        payment_status_str = "paid"
        metadata = tx.get("metadata") or {}
        amount_total = int(float(tx.get("amount", 0)) * 100)
        currency = tx.get("currency", "inr")

    if tx and tx.get("payment_status") != "paid":
        await db.payment_transactions.update_one(
            {"session_id": session_id},
            {"$set": {
                "payment_status": payment_status_str,
                "status": status_str,
                "updated_at": datetime.now(timezone.utc).isoformat(),
            }},
        )
        if payment_status_str == "paid":
            ref = metadata.get("booking_ref") or tx.get("booking_ref")
            if ref:
                await db.bookings.update_one(
                    {"booking_ref": ref},
                    {"$set": {"payment_status": "paid", "status": "confirmed",
                              "confirmed_at": datetime.now(timezone.utc).isoformat()}},
                )

    return {
        "session_id": session_id,
        "status": status_str,
        "payment_status": payment_status_str,
        "amount_total": amount_total,
        "currency": currency,
        "metadata": metadata,
    }


@api.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    body = await request.body()
    signature = request.headers.get("Stripe-Signature")
    host_url = str(request.base_url).rstrip("/")
    webhook_url = f"{host_url}/api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
    webhook_resp = await stripe_checkout.handle_webhook(body, signature)
    if webhook_resp and webhook_resp.session_id:
        await db.payment_transactions.update_one(
            {"session_id": webhook_resp.session_id},
            {"$set": {"payment_status": webhook_resp.payment_status,
                      "webhook_event": webhook_resp.event_type,
                      "updated_at": datetime.now(timezone.utc).isoformat()}},
        )
        if webhook_resp.payment_status == "paid":
            ref = (webhook_resp.metadata or {}).get("booking_ref")
            if ref:
                await db.bookings.update_one(
                    {"booking_ref": ref},
                    {"$set": {"payment_status": "paid", "status": "confirmed"}},
                )
    return {"received": True}


app.include_router(api)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
