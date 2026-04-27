"""Curated mock data for Yatra Planning - destinations, places, transport & hotels.
All image URLs are pre-verified to return 200 OK."""
import random

# Verified-working Unsplash + curated Emergent images
IMG = {
    "palace_jaipur": "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1200&q=80",
    "hawa_mahal":    "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200&q=80",
    "jantar":        "https://images.unsplash.com/photo-1524613032530-449a5d94c285?w=1200&q=80",
    "spice_market":  "https://static.prod-images.emergentagent.com/jobs/9652a5fd-9e96-4105-b768-e26038faca3c/images/cc9100d3eded0970e67ba29c733655f637c35983ab8b64cc4bff26c3904cebad.png",
    "kerala_boat":   "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&q=80",
    "kerala_hero":   "https://images.unsplash.com/photo-1705838617550-ae0573ebefc8?w=1600&q=85",
    "kerala_palms":  "https://images.unsplash.com/photo-1519181245277-cffeb31da2e3?w=1200&q=80",
    "manali_hero":   "https://images.unsplash.com/photo-1749191880983-dcc1afd1ad1e?w=1600&q=85",
    "manali_alps":   "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&q=80",
    "mountain":      "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=1200&q=80",
    "snow_temple":   "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=1200&q=80",
    "trek":          "https://images.unsplash.com/photo-1571536802807-30451e3955d8?w=1200&q=80",
    "goa_beach":     "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=1600&q=85",
    "beach_palms":   "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80",
    "church":        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=80",
    "waterfall":     "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80",
    "village":       "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&q=80",
    "lake":          "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1600&q=85",
    "dunes":         "https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=1200&q=80",
    "monastery":     "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=1200&q=80",
    "desert":        "https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=1200&q=80",
    "udaipur_lake":  "https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?w=1600&q=85",
    "udaipur_palace":"https://images.unsplash.com/photo-1611516491426-03025e6043c8?w=1200&q=80",
    "haveli":        "https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=1200&q=80",
    "varanasi_hero": "https://images.unsplash.com/photo-1573497019418-b400bb3ab074?w=1600&q=85",
    "river":         "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80",
    "luxury_room":   "https://static.prod-images.emergentagent.com/jobs/9652a5fd-9e96-4105-b768-e26038faca3c/images/6e8b3a28622e713381bbcc3ab0f23c6fe366aedbb009fb370a54982f1d7ee1fc.png",
    "resort":        "https://images.unsplash.com/photo-1692608582618-b7f6a06d5fea?w=1200&q=85",
    "main_palace":   "https://images.unsplash.com/photo-1712661200122-1574c0bca017?w=1600&q=85",
}


DESTINATIONS = [
    {
        "slug": "jaipur",
        "name": "Jaipur",
        "tagline": "The Pink City of Palaces",
        "state": "Rajasthan, India",
        "lat": 26.9124, "lon": 75.7873,
        "hero_image": IMG["main_palace"],
        "gallery": [IMG["spice_market"], IMG["hawa_mahal"]],
        "about": "A vibrant city where rose-tinted sandstone palaces, bustling bazaars, and regal forts narrate tales of Rajput royalty. Every corner is a canvas of culture.",
        "best_time": "Oct – Mar",
        "places": [
            {"name": "Amber Fort",   "img": IMG["palace_jaipur"], "desc": "Majestic hilltop fort with intricate mirror work."},
            {"name": "Hawa Mahal",   "img": IMG["hawa_mahal"],    "desc": "The iconic 953-windowed Palace of Winds."},
            {"name": "City Palace",  "img": IMG["udaipur_palace"],"desc": "A royal residence blending Rajput and Mughal architecture."},
            {"name": "Jantar Mantar","img": IMG["jantar"],        "desc": "UNESCO-listed astronomical observatory."},
        ],
    },
    {
        "slug": "kerala",
        "name": "Kerala",
        "tagline": "God's Own Backwaters",
        "state": "Kerala, India",
        "lat": 9.9312, "lon": 76.2673,
        "hero_image": IMG["kerala_hero"],
        "gallery": [IMG["kerala_boat"], IMG["kerala_palms"]],
        "about": "Drift through emerald backwaters on a houseboat, savour coconut-laced curries, and let Ayurvedic traditions slow your pulse to the rhythm of the tides.",
        "best_time": "Sep – Mar",
        "places": [
            {"name": "Alleppey Backwaters", "img": IMG["kerala_boat"],  "desc": "Iconic houseboat cruises through palm-lined canals."},
            {"name": "Munnar Tea Gardens",  "img": IMG["kerala_palms"], "desc": "Rolling emerald hills of fragrant tea estates."},
            {"name": "Fort Kochi",          "img": IMG["village"],      "desc": "Colonial lanes, Chinese fishing nets, and art cafes."},
            {"name": "Varkala Cliff",       "img": IMG["beach_palms"],  "desc": "Dramatic red cliffs overlooking the Arabian Sea."},
        ],
    },
    {
        "slug": "manali",
        "name": "Manali",
        "tagline": "Where Mountains Whisper",
        "state": "Himachal Pradesh, India",
        "lat": 32.2396, "lon": 77.1887,
        "hero_image": IMG["manali_hero"],
        "gallery": [IMG["manali_alps"], IMG["mountain"]],
        "about": "A Himalayan refuge of pine-scented valleys, snow-laced peaks, and apple orchards — ideal for trekkers, dreamers, and those seeking crisp alpine air.",
        "best_time": "Mar – Jun, Dec – Feb",
        "places": [
            {"name": "Rohtang Pass",   "img": IMG["mountain"],   "desc": "Snow-capped pass at 3,978m with panoramic Himalayan views."},
            {"name": "Solang Valley",  "img": IMG["manali_alps"],"desc": "Adventure hub for paragliding and winter skiing."},
            {"name": "Hadimba Temple", "img": IMG["snow_temple"],"desc": "Ancient cedar-wood temple hidden in deodar forests."},
            {"name": "Old Manali",     "img": IMG["trek"],       "desc": "Boho cafes, riverside walks, and mountain music."},
        ],
    },
    {
        "slug": "goa",
        "name": "Goa",
        "tagline": "Sun-drenched Shores & Portuguese Soul",
        "state": "Goa, India",
        "lat": 15.2993, "lon": 74.1240,
        "hero_image": IMG["goa_beach"],
        "gallery": [IMG["beach_palms"], IMG["church"]],
        "about": "Where palm-fringed beaches meet Portuguese villas, flea-market nights, and the kind of sunsets that slow time itself.",
        "best_time": "Nov – Feb",
        "places": [
            {"name": "Palolem Beach",         "img": IMG["beach_palms"], "desc": "Crescent-shaped beach with silent discos and sea kayaks."},
            {"name": "Basilica of Bom Jesus", "img": IMG["church"],      "desc": "UNESCO baroque church housing sacred relics."},
            {"name": "Dudhsagar Falls",       "img": IMG["waterfall"],   "desc": "Four-tiered 310m waterfall amid jungle."},
            {"name": "Fontainhas",            "img": IMG["village"],     "desc": "Goa's Latin Quarter with pastel-painted lanes."},
        ],
    },
    {
        "slug": "ladakh",
        "name": "Ladakh",
        "tagline": "Land of High Passes",
        "state": "Ladakh, India",
        "lat": 34.1526, "lon": 77.5771,
        "hero_image": IMG["lake"],
        "gallery": [IMG["dunes"], IMG["monastery"]],
        "about": "A high-altitude desert of turquoise lakes, moonlike valleys, and Buddhist monasteries perched on improbable cliffs.",
        "best_time": "May – Sep",
        "places": [
            {"name": "Pangong Lake",      "img": IMG["lake"],     "desc": "Surreal lake shifting through cobalt and sapphire hues."},
            {"name": "Nubra Valley",      "img": IMG["dunes"],    "desc": "Sand dunes, Bactrian camels, and alpine villages."},
            {"name": "Thiksey Monastery", "img": IMG["monastery"],"desc": "12-storey gompa echoing Potala Palace."},
            {"name": "Magnetic Hill",     "img": IMG["desert"],   "desc": "Optical-illusion slope defying gravity."},
        ],
    },
    {
        "slug": "udaipur",
        "name": "Udaipur",
        "tagline": "The Venice of the East",
        "state": "Rajasthan, India",
        "lat": 24.5854, "lon": 73.7125,
        "hero_image": IMG["udaipur_lake"],
        "gallery": [IMG["udaipur_palace"], IMG["haveli"]],
        "about": "Shimmering lake palaces, marble courtyards, and candlelit boat rides compose Udaipur's timeless romance.",
        "best_time": "Sep – Mar",
        "places": [
            {"name": "Lake Pichola",            "img": IMG["udaipur_lake"],  "desc": "Iconic lake encircling the City Palace and Jag Mandir."},
            {"name": "City Palace Udaipur",     "img": IMG["udaipur_palace"],"desc": "Sprawling royal complex overlooking the lake."},
            {"name": "Sajjangarh Monsoon Palace","img": IMG["palace_jaipur"],"desc": "Hilltop palace gazing at the Aravalli sunset."},
            {"name": "Bagore Ki Haveli",        "img": IMG["haveli"],        "desc": "Heritage mansion with nightly folk performances."},
        ],
    },
    {
        "slug": "varanasi",
        "name": "Varanasi",
        "tagline": "City of Eternal Light",
        "state": "Uttar Pradesh, India",
        "lat": 25.3176, "lon": 82.9739,
        "hero_image": IMG["varanasi_hero"],
        "gallery": [IMG["river"], IMG["haveli"]],
        "about": "One of the world's oldest living cities — where dawn Aartis, funeral pyres, and silk looms coexist along the sacred Ganga.",
        "best_time": "Oct – Mar",
        "places": [
            {"name": "Dashashwamedh Ghat", "img": IMG["varanasi_hero"], "desc": "Nightly Ganga Aarti of fire and chants."},
            {"name": "Sarnath",            "img": IMG["monastery"],     "desc": "Where Buddha preached his first sermon."},
            {"name": "Assi Ghat",          "img": IMG["river"],         "desc": "Quiet riverfront beloved by poets and pilgrims."},
            {"name": "Kashi Vishwanath",   "img": IMG["snow_temple"],   "desc": "Golden-spired Shiva temple at the city's heart."},
        ],
    },
    {
        "slug": "darjeeling",
        "name": "Darjeeling",
        "tagline": "Queen of the Himalayan Hills",
        "state": "West Bengal, India",
        "lat": 27.0360, "lon": 88.2627,
        "hero_image": IMG["mountain"],
        "gallery": [IMG["manali_alps"], IMG["trek"]],
        "about": "Mist-laced tea gardens, the UNESCO toy-train, and daybreak views of Kanchenjunga's silver spire.",
        "best_time": "Mar – May, Oct – Dec",
        "places": [
            {"name": "Tiger Hill",             "img": IMG["mountain"],   "desc": "Sunrise vistas over Kanchenjunga and Everest."},
            {"name": "Happy Valley Tea Estate","img": IMG["kerala_palms"],"desc": "Colonial-era plantation with tea-tasting tours."},
            {"name": "Batasia Loop",           "img": IMG["trek"],       "desc": "Spiral toy-train rail with memorial gardens."},
            {"name": "Peace Pagoda",           "img": IMG["monastery"],  "desc": "Serene Buddhist stupa with panoramic views."},
        ],
    },
]

AIRLINES = ["IndiGo", "Vistara", "Air India", "SpiceJet", "Akasa Air", "Go First"]
TRAIN_OPS = ["Rajdhani Express", "Shatabdi Express", "Vande Bharat", "Duronto Express", "Tejas Express"]
BUS_OPS = ["RedExpress Travels", "VRL Luxury", "Orange Tours", "SRS Sleeper", "Zingbus Premium"]
HOTEL_IMGS = [
    IMG["luxury_room"], IMG["resort"],
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80",
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=80",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80",
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&q=80",
]


def _rand_time(base_hour):
    return f"{(base_hour + random.randint(0, 2)) % 24:02d}:{random.choice(['00','15','30','45'])}"


def _duration(h_min=1, h_max=3):
    h = random.randint(h_min, h_max); m = random.choice([0, 15, 30, 45])
    return f"{h}h {m:02d}m"


def _airport_code(city):
    return {"jaipur":"JAI","kerala":"COK","manali":"KUU","goa":"GOI","ladakh":"IXL","udaipur":"UDR","varanasi":"VNS","darjeeling":"IXB"}.get(city.lower(), city[:3].upper())


def generate_flights(src, dst, date, seed_key=None):
    random.seed(f"{src}{dst}{date}flights")
    out = []
    for i in range(8):
        dep_h = random.randint(5, 21)
        dep = _rand_time(dep_h)
        dur = _duration(1, 4)
        price = random.randint(3200, 14500)
        stops = random.choice([0, 0, 0, 1, 1])
        out.append({
            "id": f"FL{i:03d}{random.randint(100,999)}",
            "airline": random.choice(AIRLINES),
            "flight_no": f"{random.choice(['6E','UK','AI','SG','QP'])}-{random.randint(100,999)}",
            "from": src.upper(), "from_code": _airport_code(src),
            "to": dst.upper(), "to_code": _airport_code(dst),
            "date": date,
            "depart": dep,
            "arrive": _rand_time(dep_h + int(dur.split('h')[0])),
            "duration": dur,
            "stops": stops,
            "stop_info": "Non-stop" if stops == 0 else f"{stops} stop",
            "price": price,
            "class": "Economy",
        })
    return sorted(out, key=lambda x: x["price"])


def generate_trains(src, dst, date):
    random.seed(f"{src}{dst}{date}trains")
    out = []
    for i in range(6):
        dep_h = random.randint(4, 22)
        out.append({
            "id": f"TR{random.randint(10000,99999)}",
            "operator": random.choice(TRAIN_OPS),
            "train_no": str(random.randint(12000, 22999)),
            "from": src.upper(), "to": dst.upper(), "date": date,
            "depart": _rand_time(dep_h),
            "arrive": _rand_time(dep_h + random.randint(4, 12)),
            "duration": _duration(4, 14),
            "classes": ["Sleeper", "3AC", "2AC", "1AC"],
            "price": random.randint(450, 3800),
        })
    return sorted(out, key=lambda x: x["price"])


def generate_buses(src, dst, date):
    random.seed(f"{src}{dst}{date}buses")
    out = []
    for i in range(6):
        dep_h = random.randint(6, 23)
        out.append({
            "id": f"BU{random.randint(10000,99999)}",
            "operator": random.choice(BUS_OPS),
            "bus_type": random.choice(["Volvo AC Sleeper", "AC Seater", "Non-AC Sleeper", "Luxury Sleeper"]),
            "from": src.upper(), "to": dst.upper(), "date": date,
            "depart": _rand_time(dep_h),
            "arrive": _rand_time(dep_h + random.randint(6, 14)),
            "duration": _duration(6, 14),
            "rating": round(random.uniform(3.8, 4.9), 1),
            "seats_left": random.randint(3, 28),
            "price": random.randint(650, 2500),
        })
    return sorted(out, key=lambda x: x["price"])


def generate_hotels(city, check_in, check_out):
    random.seed(f"{city}{check_in}{check_out}hotels")
    names = ["The Oberoi", "Taj Heritage", "Leela Palace", "ITC Royal", "Radisson Blu", "Novotel Wellness", "Four Seasons Retreat", "Ananda Spa Resort"]
    out = []
    for i in range(6):
        out.append({
            "id": f"HT{random.randint(10000,99999)}",
            "name": f"{random.choice(names)} {city.title()}",
            "city": city.title(),
            "check_in": check_in, "check_out": check_out,
            "image": random.choice(HOTEL_IMGS),
            "rating": round(random.uniform(3.9, 4.9), 1),
            "reviews": random.randint(180, 4200),
            "stars": random.choice([3, 4, 4, 5, 5]),
            "amenities": random.sample(["Free WiFi", "Pool", "Spa", "Gym", "Breakfast", "AC", "Parking", "Restaurant", "Bar", "Airport Shuttle"], 6),
            "price_per_night": random.randint(2800, 22000),
            "location": f"{random.choice(['Heritage District','Lake View','City Centre','Mountain Side','Beach Front'])}, {city.title()}",
        })
    return sorted(out, key=lambda x: x["price_per_night"])
