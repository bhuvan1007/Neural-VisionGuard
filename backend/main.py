import os
import cv2
import asyncio
import base64
from datetime import datetime
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from vision.detector import VisionDetector
from services.authorities import generate_alert

load_dotenv()

app = FastAPI(title="Neural VisionGuard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize AI Pipeline
detector = VisionDetector()

@app.get("/")
def read_root():
    return {"status": "Neural VisionGuard Backend API is running"}

@app.websocket("/ws/stream")
async def video_stream(websocket: WebSocket):
    await websocket.accept()
    print("WebSocket Connected!")
    
    try:
        while True:
            # Receive base64 frame from the React frontend
            payload = await websocket.receive_json()
            
            if payload.get("type") == "client_frame":
                b64_data = payload.get("image")
                
                # Strip the data URL prefix if present (e.g., 'data:image/jpeg;base64,')
                if b64_data and ',' in b64_data:
                    b64_data = b64_data.split(',')[1]
                
                # Decode base64 to numpy array
                import numpy as np
                try:
                    img_data = base64.b64decode(b64_data)
                    np_arr = np.frombuffer(img_data, np.uint8)
                    frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
                except Exception as e:
                    print(f"Error decoding base64 image: {e}")
                    continue
                
                if frame is None:
                    continue
                
                # Process Frame via YOLOv8
                annotated_frame, hazards = detector.process_frame(frame)
                
                # Encode processed frame as JPEG
                _, buffer = cv2.imencode('.jpg', annotated_frame)
                jpg_as_text = base64.b64encode(buffer).decode('utf-8')
                
                alerts_payload = []
                
                # If hazard, trigger Groq Authority Mapping
                if hazards:
                    for hazard in hazards:
                        timestamp_str = datetime.now().isoformat()
                        # Trigger Groq AI
                        mapping_result = await generate_alert(hazard["type"], hazard["severity"], timestamp_str)
                        
                        alerts_payload.append({
                            "type": hazard["type"],
                            "severity": hazard["severity"],
                            "timestamp": timestamp_str,
                            "description": mapping_result["message"],
                            "authorityMapped": mapping_result["authority"]
                        })
                
                # Broadcast annotated frame and any alerts back to frontend
                response_payload = {
                    "type": "frame_update",
                    "image": f"data:image/jpeg;base64,{jpg_as_text}",
                    "alerts": alerts_payload
                }
                
                await websocket.send_json(response_payload)

    except WebSocketDisconnect:
        print("Client disconnected from stream.")
    except Exception as e:
        print(f"WebSocket Error: {e}")
