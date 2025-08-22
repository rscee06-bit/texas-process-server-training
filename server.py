from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import jwt
from passlib.context import CryptContext
import secrets

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL')
if mongo_url:
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ.get('DB_NAME', 'texas_process_server')]
else:
    db = None

# Security
SECRET_KEY = os.environ.get('SECRET_KEY', secrets.token_urlsafe(32))
ALGORITHM = "HS256"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# Create the main app
app = FastAPI(title="Texas Process Server Training Platform")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create router with /api prefix
api_router = APIRouter(prefix="/api")

# User Models
class UserBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    phone: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(UserBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    role: str = "student"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    is_active: bool = True

# Course Models
class CourseType(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    title: str
    description: str
    duration_hours: int
    passing_score: int = 70
    ethics_hours_required: int = 0

class CourseModule(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    course_type_id: str
    title: str
    description: str
    content: str
    video_url: Optional[str] = None
    duration_minutes: int
    order: int
    is_ethics: bool = False

class QuizQuestion(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    module_id: str
    question: str
    options: List[str]
    correct_answer: int
    explanation: str

# Enrollment Models
class Enrollment(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    course_type_id: str
    enrollment_date: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    completion_date: Optional[datetime] = None
    certificate_issued: bool = False
    final_score: Optional[int] = None
    status: str = "in_progress"

class ModuleProgress(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    enrollment_id: str
    module_id: str
    completed: bool = False
    completion_date: Optional[datetime] = None
    time_spent_minutes: int = 0

class QuizAttempt(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    enrollment_id: str
    module_id: str
    score: int
    answers: List[int]
    attempt_date: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    passed: bool = False

# Auth Helper Functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    to_encode.update({"exp": datetime.now(timezone.utc).timestamp() + 86400})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not db:
        raise HTTPException(status_code=500, detail="Database not available")
    
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    except jwt.PyJWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    
    user = await db.users.find_one({"id": user_id})
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return User(**user)

# Basic routes
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

# Authentication Routes
@api_router.post("/auth/register", response_model=dict)
async def register(user_data: UserCreate):
    if not db:
        raise HTTPException(status_code=500, detail="Database not available")
        
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user_data.password)
    user_dict = user_data.dict()
    del user_dict['password']
    user = User(**user_dict)
    
    await db.users.insert_one({**user.dict(), "hashed_password": hashed_password})
    access_token = create_access_token(data={"sub": user.id})
    
    return {"access_token": access_token, "token_type": "bearer", "user": user}

@api_router.post("/auth/login", response_model=dict)
async def login(login_data: UserLogin):
    if not db:
        raise HTTPException(status_code=500, detail="Database not available")
        
    user = await db.users.find_one({"email": login_data.email})
    if not user or not verify_password(login_data.password, user["hashed_password"]):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token = create_access_token(data={"sub": user["id"]})
    return {"access_token": access_token, "token_type": "bearer", "user": User(**user)}

# Course Routes
@api_router.get("/courses", response_model=List[CourseType])
async def get_courses():
    if not db:
        return [
            CourseType(id="1", name="initial", title="Initial Process Server Certification",
                      description="7-hour JBCC approved initial certification course", duration_hours=7),
            CourseType(id="2", name="renewal", title="Process Server Continuing Education", 
                      description="8-hour JBCC approved continuing education course", duration_hours=8)
        ]
    
    courses = await db.course_types.find().to_list(1000)
    return [CourseType(**course) for course in courses]

@api_router.get("/courses/{course_id}/modules", response_model=List[CourseModule])
async def get_course_modules(course_id: str):
    if not db:
        return []
    modules = await db.course_modules.find({"course_type_id": course_id}).to_list(1000)
    return [CourseModule(**module) for module in modules]

# Enrollment Routes
@api_router.post("/enroll/{course_id}", response_model=Enrollment)
async def enroll_in_course(course_id: str, current_user: User = Depends(get_current_user)):
    if not db:
        raise HTTPException(status_code=500, detail="Database not available")
        
    existing_enrollment = await db.enrollments.find_one({
        "user_id": current_user.id,
        "course_type_id": course_id,
        "status": {"$in": ["in_progress", "completed"]}
    })
    
    if existing_enrollment:
        raise HTTPException(status_code=400, detail="Already enrolled in this course")
    
    enrollment = Enrollment(user_id=current_user.id, course_type_id=course_id)
    await db.enrollments.insert_one(enrollment.dict())
    return enrollment

@api_router.get("/my-courses", response_model=List[dict])
async def get_my_courses(current_user: User = Depends(get_current_user)):
    if not db:
        return []
        
    enrollments = await db.enrollments.find({"user_id": current_user.id}).to_list(1000)
    result = []
    
    for enrollment in enrollments:
        course = await db.course_types.find_one({"id": enrollment["course_type_id"]})
        if course:
            progress = await db.module_progress.count_documents({
                "enrollment_id": enrollment["id"],
                "completed": True
            })
            total_modules = await db.course_modules.count_documents({
                "course_type_id": enrollment["course_type_id"]
            })
            
            result.append({
                "enrollment": Enrollment(**enrollment),
                "course": CourseType(**course),
                "progress": {
                    "completed_modules": progress,
                    "total_modules": total_modules,
                    "percentage": (progress / total_modules * 100) if total_modules > 0 else 0
                }
            })
    
    return result

# Initialize data
@api_router.post("/admin/initialize-courses")
async def initialize_courses():
    if not db:
        return {"message": "Database not available"}
        
    existing_courses = await db.course_types.count_documents({})
    if existing_courses > 0:
        return {"message": "Courses already initialized"}
    
    initial_course = CourseType(
        name="initial",
        title="Initial Process Server Certification",
        description="7-hour JBCC approved initial certification course for Texas Process Servers",
        duration_hours=7,
        passing_score=70,
        ethics_hours_required=0
    )
    
    renewal_course = CourseType(
        name="renewal",
        title="Process Server Continuing Education",
        description="8-hour JBCC approved continuing education course for Texas Process Server renewal",
        duration_hours=8,
        passing_score=70,
        ethics_hours_required=2
    )
    
    await db.course_types.insert_many([initial_course.dict(), renewal_course.dict()])
    return {"message": "Courses initialized successfully"}

# Certificate endpoint
@api_router.get("/certificates/{enrollment_id}")
async def get_certificate(enrollment_id: str, current_user: User = Depends(get_current_user)):
    if not db:
        raise HTTPException(status_code=500, detail="Database not available")
        
    enrollment = await db.enrollments.find_one({
        "id": enrollment_id,
        "user_id": current_user.id,
        "status": "completed",
        "certificate_issued": True
    })
    
    if not enrollment:
        raise HTTPException(status_code=404, detail="Certificate not found or course not completed")
    
    course = await db.course_types.find_one({"id": enrollment["course_type_id"]})
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    certificate_data = {
        "certificate_id": f"JBCC-{enrollment['id'][:8].upper()}",
        "student_name": f"{current_user.first_name} {current_user.last_name}",
        "course_title": course["title"],
        "course_type": course["name"],
        "completion_date": enrollment["completion_date"],
        "total_hours": course["duration_hours"],
        "ethics_hours": course.get("ethics_hours_required", 0),
        "final_score": enrollment.get("final_score", 100),
        "issue_date": datetime.now(timezone.utc)
    }
    
    return certificate_data

# Include router
app.include_router(api_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
