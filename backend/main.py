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
    
    # Normally this would be a local webcam (0) or IP camera RTSP link.
    # For demo without hardware, we'll try standard webcam.
    cap = cv2.VideoCapture(0)
    
    # If no webcam, you could optionally fall back to a dummy frame or video file.
    
    try:
        while True:
            ret, frame = cap.read()
            if not ret or frame is None:
                # Fallback frame for headless hackathon demo
                import numpy as np
                frame = np.zeros((480, 640, 3), dtype=np.uint8)
                cv2.putText(frame, "NO CAMERA DETECTED - SIMULATING", (50, 240), cv2.FONT_HERSHEY_SIMPLEX, 1, (200, 200, 200), 2)
                
            # Process Frame via YOLOv8
            annotated_frame, hazards = detector.process_frame(frame)
            
            # Encode frame as JPEG to send over WebSocket
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
            
            # Broadcast frame and any alerts
            payload = {
                "type": "frame_update",
                "image": f"data:image/jpeg;base64,{jpg_as_text}",
                "alerts": alerts_payload
            }
            
            await websocket.send_json(payload)
            await asyncio.sleep(0.05) # control frame rate to ~20 FPS

    except WebSocketDisconnect:
        print("Client disconnected from stream.")
    except Exception as e:
        print(f"WebSocket Error: {e}")
    finally:
        cap.release()
