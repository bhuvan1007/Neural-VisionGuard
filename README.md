# Neural VisionGuard

An AI-Based Intelligent Emergency Response and Multi-Hazard Detection System.

## Project Structure
- `frontend/` - React/Vite web application with a premium dark-mode interface.
- `backend/` - FastAPI application serving YOLOv8 object detection via WebSockets, and generating mapping alerts using the Groq Llama 3 API.

---

## 🚀 Running Locally

### 1. Start the Backend
```bash
cd backend
python -m venv venv
# On Windows: .\venv\Scripts\activate
# On Mac/Linux: source venv/bin/activate
pip install -r requirements.txt

# Start the FastAPI server
python -m uvicorn main:app --reload --port 8000
```

### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 🌐 Connecting the GitHub Pages URL to your Backend

Currently, the GitHub Pages link (`https://bhuvan1007.github.io/Neural-VisionGuard/`) is a **static frontend**. Because the backend processes real-time video frames using OpenCV and YOLO, it needs to be hosted on a live server (or exposed via your laptop) for the frontend to connect to it.

Here are the 2 ways to make the GitHub Pages URL work perfectly for your Hackathon Demo:

### Option A: Expose your Laptop via Ngrok (Fastest for Demo)
If you are running the backend on your laptop during the demo, you can securely expose it to the internet so the GitHub Pages site can reach it:
1. Download [Ngrok](https://ngrok.com/) and authenticate your account.
2. In a new terminal on your laptop, run:
   ```bash
   ngrok http 8000
   ```
3. Ngrok will give you an `https://` forwarding URL (e.g., `https://1234.ngrok-free.app`).
4. Go to your **GitHub Repository Settings** -> **Environments** or **Variables**.
5. Add a Repository Variable named `VITE_WS_URL`.
6. Set its value to the secure websocket version of your ngrok URL. For example: `wss://1234.ngrok-free.app/ws/stream`.
7. Re-run your GitHub Action (Pages build). The live site will now stream YOLO from your laptop over the internet!

### Option B: Deploy Backend to Render / Railway
If you want the backend to live permanently in the cloud:
1. Create an account on [Railway.app](https://railway.app/) or [Render.com](https://render.com/).
2. Connect your GitHub repository and point the root directory to `backend`.
3. Add `GROQ_API_KEY` to the environment variables on Render/Railway.
4. Set the Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Once your backend deploys, you will receive a public URL (e.g., `https://my-backend.up.railway.app`).
6. Go to your GitHub Repository Settings and add a Repository Variable named `VITE_WS_URL` with the value:
   `wss://my-backend.up.railway.app/ws/stream`
7. Re-run your GitHub Action. The live site will now stream from the cloud backend.

---

## Technical Features
- **Real-time Inference**: YOLOv8 extracts bounding boxes and confidences per frame.
- **WebSocket Streaming**: Frame-by-frame base64 JPEG broadcasting.
- **Intelligent Authority Mapping**: Llama 3 dynamically maps hazards (Fire/Weapons/Accidents/Falls) to the correct response protocol (Police/EMT/Fire Dept).
- **Simulated Hazards**: A demo-injection module randomly triggers critical hazards on the stream so you can effectively demonstrate the mapping logic without requiring a physical fire or weapon on-camera.
