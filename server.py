from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from motor.motor_asyncio import AsyncIOMotorClient
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Texas Process Server Training Platform")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection (optional - won't crash if not available)
mongo_url = os.environ.get('MONGO_URL')
if mongo_url:
    try:
        client = AsyncIOMotorClient(mongo_url)
        db = client[os.environ.get('DB_NAME', 'texas_process_server')]
        logger.info("MongoDB connected successfully")
    except Exception as e:
        logger.error(f"MongoDB connection failed: {e}")
        db = None
else:
    logger.info("No MongoDB URL provided, running without database")
    db = None

@app.get("/")
def read_root():
    return {"message": "Texas Process Server Training Platform", "status": "running"}

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "database": "connected" if db else "not connected",
        "environment": "production"
    }

@app.get("/api/health")
def api_health_check():
    return {
        "status": "healthy",
        "api": "working",
        "database": "connected" if db else "not connected"
    }

# Basic course endpoints for testing
@app.get("/api/courses")
def get_courses():
    return [
        {
            "id": "1",
            "name": "initial",
            "title": "Initial Process Server Certification",
            "description": "7-hour JBCC approved initial certification course",
            "duration_hours": 7
        },
        {
            "id": "2", 
            "name": "renewal",
            "title": "Process Server Continuing Education",
            "description": "8-hour JBCC approved continuing education course",
            "duration_hours": 8
        }
    ]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))
