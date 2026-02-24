FROM python:3.11

WORKDIR /app

# Copy requirements from the backend folder and install dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend files
COPY backend/ .

# Run the FastAPI server.
# Cloud platforms like Render or Railway provide their own PORT environment variable.
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
