"""One-shot script to generate authentic India destination images via Gemini Nano Banana.
Run: python scripts/gen_destination_images.py
Outputs to /app/frontend/public/destinations/*.png
"""
import asyncio, os, base64, sys
from pathlib import Path
from dotenv import load_dotenv
sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "backend"))
load_dotenv(Path(__file__).resolve().parent.parent / "backend" / ".env")

from emergentintegrations.llm.chat import LlmChat, UserMessage

OUT = Path(__file__).resolve().parent.parent / "frontend" / "public" / "destinations"
OUT.mkdir(parents=True, exist_ok=True)

PROMPTS = {
    "goa": "Editorial travel photography of Goa, India: a sweeping golden-hour beach with tall coconut palms casting long shadows, warm Arabian sea waves, pastel-painted Portuguese-style church visible in distance, cinematic wide-angle, magazine-quality, no people, ultra realistic, 16:9.",
    "ladakh": "Editorial travel photography of Ladakh, India: turquoise Pangong Lake reflecting jagged Himalayan peaks, a small whitewashed Buddhist monastery on a rocky outcrop, prayer flags fluttering, dramatic blue sky with scattered clouds, no people, ultra realistic, 16:9.",
    "udaipur": "Editorial travel photography of Udaipur, India: the white marble City Palace and floating Lake Palace mirrored on calm Lake Pichola at sunset, soft golden light, Aravalli hills in background, ornate Rajput architecture, no people, ultra realistic, 16:9.",
    "varanasi": "Editorial travel photography of Varanasi, India: the sacred Ganges river at dawn with stone ghats and ornate temples, wooden boats on the water, soft mist, warm golden sunrise light, no people in foreground, ultra realistic, 16:9.",
    "darjeeling": "Editorial travel photography of Darjeeling, India: terraced emerald tea gardens cascading down mist-covered Himalayan slopes at sunrise, snow-capped Kanchenjunga visible in distance, soft pastel sky, no people, ultra realistic, 16:9.",
    "spice_market": "Editorial travel photography of an Indian spice bazaar in Jaipur: pyramids of vibrant red, yellow, and orange spice powders in burlap sacks, brass scales, soft warm market light, no people, ultra realistic, 16:9.",
}


async def gen(slug: str, prompt: str):
    chat = LlmChat(api_key=os.environ["EMERGENT_LLM_KEY"], session_id=f"img-{slug}", system_message="You generate cinematic travel photography images.")
    chat.with_model("gemini", "gemini-3.1-flash-image-preview").with_params(modalities=["image", "text"])
    text, images = await chat.send_message_multimodal_response(UserMessage(text=prompt))
    if not images:
        print(f"  [{slug}] no image returned, text:", text[:200])
        return
    out = OUT / f"{slug}.png"
    out.write_bytes(base64.b64decode(images[0]["data"]))
    print(f"  [{slug}] saved {out.relative_to(OUT.parent.parent)} ({out.stat().st_size//1024} KB)")


async def main():
    for slug, prompt in PROMPTS.items():
        try:
            print(f"Generating {slug}…")
            await gen(slug, prompt)
        except Exception as e:
            print(f"  [{slug}] FAILED: {e}")


if __name__ == "__main__":
    asyncio.run(main())
