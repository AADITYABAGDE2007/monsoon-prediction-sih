import os
import json
from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import List, Optional
from twilio.rest import Client
import pandas as pd

router = APIRouter()

# File to store our mock database of subscribers
SUBSCRIBERS_FILE = os.path.join(os.path.dirname(__file__), "subscribers.json")

class Subscriber(BaseModel):
    phone_number: str
    block_id: str
    name: Optional[str] = "Citizen"
    language: Optional[str] = "en"

class TriggerRequest(BaseModel):
    date: str = "2025-09-30"

def get_subscribers() -> List[dict]:
    if not os.path.exists(SUBSCRIBERS_FILE):
        return []
    with open(SUBSCRIBERS_FILE, "r") as f:
        try:
            return json.load(f)
        except:
            return []

def save_subscribers(subs: List[dict]):
    with open(SUBSCRIBERS_FILE, "w") as f:
        json.dump(subs, f, indent=4)

@router.post("/subscribe")
def subscribe(sub: Subscriber):
    subs = get_subscribers()
    # Check if already subscribed for this block
    for s in subs:
        if s["phone_number"] == sub.phone_number and s["block_id"] == sub.block_id:
            return {"status": "ok", "message": "Already subscribed to this block"}
    
    subs.append(sub.model_dump())
    save_subscribers(subs)
    return {"status": "ok", "message": "Successfully subscribed to alerts"}

def get_production_df(target_date: str):
    # Locate the parquet from Phase A
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    parquet_path = os.path.join(base_dir, "forecast", "risk", "risk_alert_forecast_2025-09-30.parquet")
    if not os.path.exists(parquet_path):
        return None
    try:
        df = pd.read_parquet(parquet_path)
        df['date'] = df['date'].astype(str)
        df = df[df['date'].str.startswith(target_date)]
        return df
    except Exception as e:
        print(f"Error loading parquet: {e}")
        return None

def send_twilio_sms(phone: str, message_body: str):
    account_sid = os.environ.get("TWILIO_ACCOUNT_SID")
    auth_token = os.environ.get("TWILIO_AUTH_TOKEN")
    from_number = os.environ.get("TWILIO_FROM_NUMBER")

    if not account_sid or not auth_token or not from_number:
        print(f"[MOCK SMS] Would have sent to {phone}: {message_body}")
        return False

    try:
        client = Client(account_sid, auth_token)
        message = client.messages.create(
            body=message_body,
            from_=from_number,
            to=phone
        )
        print(f"SMS sent to {phone}. SID: {message.sid}")
        return True
    except Exception as e:
        print(f"Twilio error for {phone}: {e}")
        return False

@router.post("/trigger")
def trigger_alerts(req: TriggerRequest, background_tasks: BackgroundTasks):
    df = get_production_df(req.date)
    if df is None:
        raise HTTPException(status_code=404, detail="Production forecast not found for date")

    # Find high risk blocks (RED or ORANGE)
    high_risk_blocks = df[df['alert_level'].isin(['RED', 'ORANGE'])]
    if high_risk_blocks.empty:
        return {"status": "ok", "message": "No high risk blocks found. No alerts sent."}

    high_risk_dict = {row['block_id']: row for _, row in high_risk_blocks.iterrows()}
    
    subs = get_subscribers()
    sent_count = 0
    
    for sub in subs:
        if sub["block_id"] in high_risk_dict:
            block_data = high_risk_dict[sub["block_id"]]
            alert_level = block_data["alert_level"]
            risk_desc = block_data.get("advisory_action", "").replace("_", " ")
            
            msg = f"⚠️ IMD Alert: Namaskar {sub['name']}, aapke block {sub['block_id']} me {alert_level} risk hai. Advisory: {risk_desc}. - Ministry of Earth Sciences"
            
            background_tasks.add_task(send_twilio_sms, sub["phone_number"], msg)
            sent_count += 1
            
    return {"status": "ok", "message": f"Alert job triggered for {sent_count} subscribers."}
