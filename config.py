
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'your-very-secret-key-for-dev'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or         'postgresql://user:password@localhost:5432/funding_portal_db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    CORS_ORIGINS = (os.environ.get('FRONTEND_URL') or 'http://localhost:3000').split(',')
