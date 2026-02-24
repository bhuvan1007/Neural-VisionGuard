import os
import json
from groq import AsyncGroq

client = AsyncGroq(api_key=os.environ.get("GROQ_API_KEY", "dummy_key_if_not_set"))

async def generate_alert(hazard_type: str, severity: str, timestamp: str) -> dict:
    if not os.environ.get("GROQ_API_KEY") or os.environ.get("GROQ_API_KEY") == "your_groq_api_key_here":
        return _fallback_mapping(hazard_type, severity)

    prompt = f"""
You are an intelligent emergency response mapping system.
A hazard has been detected:
- Type: {hazard_type}
- Severity: {severity}
- Time: {timestamp}

Which emergency authority should be immediately notified?
Respond ONLY with a valid JSON object in this exact format:
{{"mapped_authority": "authority name", "alert_message": "A concise, structured urgent alert message"}}
"""
    try:
        chat_completion = await client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama3-8b-8192",
            temperature=0.2,
            response_format={"type": "json_object"}
        )
        response_data = json.loads(chat_completion.choices[0].message.content)
        return {
            "authority": response_data.get("mapped_authority", "General Security"),
            "message": response_data.get("alert_message", f"{severity.upper()} Alert: {hazard_type} detected.")
        }
    except Exception as e:
        print(f"Groq API Error: {e}")
        return _fallback_mapping(hazard_type, severity)

def _fallback_mapping(hazard_type: str, severity: str) -> dict:
    authorities = {
        "fire": "Fire Department",
        "smoke": "Fire Department",
        "accident": "Police & EMT",
        "weapon": "Armed Police",
        "fall": "Medical Response"
    }
    # Match substring just in case
    matched_auth = "Campus Security"
    for key, auth in authorities.items():
        if key in hazard_type.lower():
            matched_auth = auth
            break
            
    return {
        "authority": matched_auth,
        "message": f"[{severity.upper()}] Automatically generated alert: {hazard_type} detected. Please dispatch {matched_auth}."
    }
