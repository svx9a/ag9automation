FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8000

WORKDIR /app

# Install system packages if needed
# RUN apt-get update && apt-get install -y build-essential && rm -rf /var/lib/apt/lists/*

# Copy requirements and install first for better caching
COPY server/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

# Copy backend and (optional) built frontend
COPY server /app/server
COPY dist /app/dist

EXPOSE 8000

CMD ["gunicorn", "server.main:app", "--bind=0.0.0.0:8000", "--workers=2", "--worker-class", "uvicorn.workers.UvicornWorker"]