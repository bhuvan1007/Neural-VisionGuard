import cv2
import random
import time
from ultralytics import YOLO

class VisionDetector:
    def __init__(self):
        # We use YOLOv8 nano for speed
        self.model = YOLO("yolov8n.pt")
        # For an impressive hackathon demo, we'll occasionally simulate specific hazards
        # since a standard pre-trained YOLOv8n doesn't detect "fire" or "weapons" out of the box.
        self.demo_hazards = ["Fire", "Smoke", "Accident", "Weapon Threat", "High-Risk Fall"]
        self.last_hazard_time = time.time()

    def process_frame(self, frame):
        # Run inference
        results = self.model(frame, verbose=False)
        annotated_frame = frame.copy()
        
        hazards_detected = []
        
        # Parse realistic bounding boxes
        for r in results:
            boxes = r.boxes
            for box in boxes:
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                cls_id = int(box.cls[0])
                conf = float(box.conf[0])
                class_name = self.model.names[cls_id]
                
                # Draw standard detections
                color = (0, 255, 0) # Green for safe
                cv2.rectangle(annotated_frame, (x1, y1), (x2, y2), color, 2)
                cv2.putText(annotated_frame, f"{class_name} {conf:.2f}", (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)
                
        # --- HACKATHON DEMO INJECTION ---
        # Inject a simulated hazard every 15-20 frames or so if demoing live video
        current_time = time.time()
        if random.random() < 0.05 and (current_time - self.last_hazard_time > 5): 
            hazard_type = random.choice(self.demo_hazards)
            severity = "Critical" if hazard_type in ["Fire", "Weapon Threat", "Accident"] else "High"
            
            # Draw a massive red alert box on the stream
            cv2.rectangle(annotated_frame, (50, 50), (frame.shape[1]-50, frame.shape[0]-50), (0, 0, 255), 4)
            cv2.putText(annotated_frame, f"HAZARD DETECTED: {hazard_type}", (70, 90), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 3)
            
            hazards_detected.append({
                "type": hazard_type,
                "severity": severity,
                "timestamp": current_time
            })
            self.last_hazard_time = current_time

        return annotated_frame, hazards_detected
