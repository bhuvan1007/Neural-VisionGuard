FROM python:3.11

WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend files
COPY . .

# Run the FastAPI server. 
# Cloud platforms like Render or Railway provide their own PORT environment variable.
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
