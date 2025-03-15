from sqlalchemy import create_engine, Column, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# SQLite database file location
DATABASE_URL = "sqlite:///./notiva.db"

# Create the database engine
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

# Create a session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()

# Dependency function to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
