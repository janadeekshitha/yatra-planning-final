"""Yatra Planning backend API tests."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://wanderlust-hub-309.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---------- Destinations ----------
class TestDestinations:
    def test_list(self, session):
        r = session.get(f"{API}/destinations", timeout=30)
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list) and len(data) == 8
        for d in data:
            for k in ("slug", "name", "hero_image", "best_time"):
                assert k in d and d[k]

    def test_detail_jaipur(self, session):
        r = session.get(f"{API}/destinations/jaipur", timeout=30)
        assert r.status_code == 200
        d = r.json()
        assert d["slug"] == "jaipur"
        assert "lat" in d and "lon" in d
        assert isinstance(d.get("places"), list) and len(d["places"]) > 0

    def test_detail_404(self, session):
        r = session.get(f"{API}/destinations/nonexistent-xyz", timeout=30)
        assert r.status_code == 404


# ---------- Weather ----------
class TestWeather:
    def test_weather_jaipur(self, session):
        r = session.get(f"{API}/weather", params={"lat": 26.9124, "lon": 75.7873}, timeout=30)
        assert r.status_code == 200
        d = r.json()
        assert "current" in d and "daily" in d
        assert "temperature_2m" in d["current"]
        assert len(d["daily"]["time"]) == 5


# ---------- Search ----------
class TestSearch:
    def test_flights_sorted(self, session):
        r = session.post(f"{API}/search/flights", json={
            "origin": "DEL", "destination": "JAI", "date": "2026-02-10", "passengers": 1
        }, timeout=30)
        assert r.status_code == 200
        res = r.json()["results"]
        assert len(res) > 0
        prices = [x["price"] for x in res]
        assert prices == sorted(prices)

    def test_trains(self, session):
        r = session.post(f"{API}/search/trains", json={
            "origin": "DEL", "destination": "JAI", "date": "2026-02-10", "passengers": 1
        }, timeout=30)
        assert r.status_code == 200
        res = r.json()["results"]
        assert len(res) > 0
        for k in ("operator", "train_no", "duration", "price"):
            assert k in res[0]

    def test_buses(self, session):
        r = session.post(f"{API}/search/buses", json={
            "origin": "DEL", "destination": "JAI", "date": "2026-02-10", "passengers": 1
        }, timeout=30)
        assert r.status_code == 200
        res = r.json()["results"]
        assert len(res) > 0
        for k in ("operator", "bus_type", "rating", "price"):
            assert k in res[0]

    def test_hotels(self, session):
        r = session.post(f"{API}/search/hotels", json={
            "city": "Jaipur", "check_in": "2026-02-10", "check_out": "2026-02-12", "guests": 2
        }, timeout=30)
        assert r.status_code == 200
        res = r.json()["results"]
        assert len(res) > 0
        for k in ("image", "stars", "amenities", "price_per_night"):
            assert k in res[0]


# ---------- Booking ----------
@pytest.fixture(scope="module")
def booking_ref(session):
    r = session.post(f"{API}/bookings", json={
        "item": {
            "kind": "hotel", "item_id": "htl-1", "title": "TEST_Heritage Palace Hotel",
            "sub_title": "Jaipur", "date": "2026-02-10", "price": 4500.0,
            "image": "https://x.y/z.jpg", "meta": {"stars": 4}
        },
        "traveler_name": "TEST_Arjun Sharma",
        "traveler_email": "test_arjun@example.com",
        "traveler_phone": "9999999999"
    }, timeout=30)
    assert r.status_code == 200, r.text
    b = r.json()
    assert b["booking_ref"].startswith("YTR-")
    assert b["payment_status"] == "unpaid"
    assert b["status"] == "pending"
    assert b["amount"] == 4500.0
    return b["booking_ref"]


class TestBookings:
    def test_get_booking(self, session, booking_ref):
        r = session.get(f"{API}/bookings/{booking_ref}", timeout=30)
        assert r.status_code == 200
        b = r.json()
        assert b["booking_ref"] == booking_ref
        assert b["traveler_email"] == "test_arjun@example.com"
        assert b["amount"] == 4500.0

    def test_get_booking_invalid(self, session):
        r = session.get(f"{API}/bookings/YTR-BADREF00", timeout=30)
        assert r.status_code == 404


# ---------- Payments ----------
class TestPayments:
    def test_checkout_creates_stripe_session(self, session, booking_ref):
        r = session.post(f"{API}/payments/checkout", json={
            "booking_ref": booking_ref,
            "origin_url": "https://wanderlust-hub-309.preview.emergentagent.com"
        }, timeout=45)
        assert r.status_code == 200, r.text
        d = r.json()
        assert "url" in d and "session_id" in d
        assert "stripe.com" in d["url"]
        pytest.session_id = d["session_id"]

    def test_payment_status(self, session):
        sid = getattr(pytest, "session_id", None)
        if not sid:
            pytest.skip("no session_id")
        r = session.get(f"{API}/payments/status/{sid}", timeout=45)
        assert r.status_code == 200
        d = r.json()
        assert d["session_id"] == sid
        assert "status" in d and "payment_status" in d

    def test_checkout_invalid_booking(self, session):
        r = session.post(f"{API}/payments/checkout", json={
            "booking_ref": "YTR-FAKEXXXX",
            "origin_url": "https://wanderlust-hub-309.preview.emergentagent.com"
        }, timeout=30)
        assert r.status_code == 404
