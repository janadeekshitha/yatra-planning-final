# Yatra Planning — Local Setup (VS Code)

A premium travel-planning web app: book flights, trains, buses & hotels, browse curated destinations, see live 5-day weather, and pay with Stripe (test mode). Built with **React + FastAPI + MongoDB**.

---

## 1) Prerequisites

Install these once on your laptop:

| Tool | Version | Verify |
|------|---------|--------|
| Node.js | ≥ 18 | `node -v` |
| Yarn | ≥ 1.22 | `yarn -v` (install via `npm install -g yarn`) |
| Python | ≥ 3.10 | `python --version` |
| MongoDB Community | ≥ 6 | `mongod --version` |
| VS Code | latest | with Python + ESLint extensions |

> **Do not use `npm`** for the frontend — this project uses **Yarn** only.

### Install MongoDB locally

- **macOS**: `brew tap mongodb/brew && brew install mongodb-community && brew services start mongodb-community`
- **Windows**: Download installer from <https://www.mongodb.com/try/download/community> → run as a Windows Service.
- **Linux (Ubuntu/Debian)**: follow <https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/> → `sudo systemctl start mongod`.

Default URI used by this project: `mongodb://localhost:27017`.

---

## 2) Project Layout

```
yatra-planning/
├── backend/        # FastAPI + Mongo + Stripe
│   ├── server.py
│   ├── mock_data.py
│   ├── requirements.txt
│   └── .env
└── frontend/       # React (CRA + craco) + Tailwind
    ├── src/
    ├── package.json
    └── .env
```

---

## 3) Configure Environment Variables

### `backend/.env`
```env
MONGO_URL="mongodb://localhost:27017"
DB_NAME="yatra_planning"
CORS_ORIGINS="*"
STRIPE_API_KEY=sk_test_emergent
```

> `sk_test_emergent` is a **shared sandbox test key** that works only inside the Emergent platform. If running outside Emergent, replace it with your own Stripe test key from <https://dashboard.stripe.com/test/apikeys>.

### `frontend/.env`
```env
REACT_APP_BACKEND_URL=http://localhost:8001
WDS_SOCKET_PORT=3000
```

---

## 4) Install & Run

Open the project root in VS Code and use **two integrated terminals** (Terminal → Split Terminal).

### Terminal 1 — Backend
```bash
cd backend
python -m venv .venv
# macOS / Linux
source .venv/bin/activate
# Windows (PowerShell)
.venv\Scripts\Activate.ps1

pip install -r requirements.txt
uvicorn server:app --reload --host 0.0.0.0 --port 8001
```
Backend now serves at <http://localhost:8001> with API at <http://localhost:8001/api>.

### Terminal 2 — Frontend
```bash
cd frontend
yarn install
yarn start
```
Frontend opens at <http://localhost:3000>.

---

## 5) One-Command Quick Start (macOS / Linux)

After installing dependencies once, you can launch everything from the project root:

```bash
# Make sure mongod is running first
(cd backend && source .venv/bin/activate && uvicorn server:app --reload --host 0.0.0.0 --port 8001) & \
(cd frontend && yarn start) & \
wait
```

Stop with `Ctrl + C`.

---

## 6) Test the Stripe Checkout (Test Mode)

1. Pick any flight / train / bus / hotel and click **Book**.
2. Fill in name + email on the Checkout page.
3. Click **Pay Securely with Stripe** → you'll be redirected to Stripe's hosted test page.
4. Use card **`4242 4242 4242 4242`**, any future expiry (e.g. `12 / 30`), any CVC (e.g. `123`), any postal code.
5. You'll land on `/success` — booking is confirmed and a reference is shown.

> Look up any booking later via **My Booking** in the navbar using the `YTR-XXXXXXXX` reference.

---

## 7) Common Issues & Fixes

| Problem | Fix |
|---------|-----|
| `MongoServerError: connect ECONNREFUSED` | Start MongoDB: `brew services start mongodb-community` (mac) / `sudo systemctl start mongod` (linux) / start the Windows service. |
| Frontend cannot reach backend | Check `REACT_APP_BACKEND_URL` in `frontend/.env` — must match the backend URL. Restart `yarn start` after editing. |
| Port 8001 / 3000 already in use | Kill the process: `lsof -ti:8001 \| xargs kill -9` (mac/linux) or change the port. |
| `pip install` fails on `emergentintegrations` | Add the extra index: `pip install emergentintegrations==0.1.0 --extra-index-url https://d33sy5i8bnduwe.cloudfront.net/simple/`. |
| Weather panel shows fallback data | Open-Meteo rate-limited your IP — wait a few minutes; the fallback still produces a 5-day forecast so the demo never breaks. |
| Stripe redirect fails outside Emergent | Replace `STRIPE_API_KEY` with your own `sk_test_...` from your Stripe dashboard. |

---

## 8) What's Inside

- **Hero** — editorial split with live "Wander well. Book beautifully."
- **Search Widget** — tabbed (Flights / Trains / Buses / Hotels) with date pickers
- **Destination Bento** — 8 hand-curated Indian destinations with photography
- **Destination Detail** — hero image, About, **Live 5-day Weather** (Open-Meteo), Places to Visit
- **Results** — magazine-style listings with filters & price slider
- **Checkout** — ticket-style summary + Stripe Checkout
- **Success** — payment polling & booking confirmation
- **My Booking** — guest lookup by `YTR-XXXXXXXX`

---

## 9) Tech Stack

| Layer | Tools |
|-------|-------|
| Frontend | React 19, React Router, Tailwind 3, shadcn/ui (Radix), lucide-react, Sonner, Cormorant Garamond + Outfit fonts |
| Backend | FastAPI, Motor (async MongoDB), httpx, Pydantic v2, emergentintegrations (Stripe), Stripe Python SDK |
| Data | MongoDB (collections: `bookings`, `payment_transactions`) |
| External APIs | Stripe (test) · Open-Meteo (free, no key) |

---

Made with care · `yatra.planning` · 2026
