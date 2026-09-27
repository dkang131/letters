from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import httpx
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5816"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID")


class FeedbackRequest(BaseModel):
    message: str


@app.post("/api/feedback")
async def send_feedback(data: FeedbackRequest):

    telegram_url = (
        f"https://api.telegram.org/bot"
        f"{TELEGRAM_BOT_TOKEN}/sendMessage"
    )

    payload = {
        "chat_id": TELEGRAM_CHAT_ID,
        "text": f"💌 New feedback from Lauren:\n\n{data.message}",
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(
            telegram_url,
            json=payload,
        )

    response.raise_for_status()

    return {"success": True}