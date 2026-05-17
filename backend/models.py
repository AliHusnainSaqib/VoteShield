import os
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker, relationship
from sqlalchemy.sql import func
from sqlalchemy import create_engine
from geoalchemy2 import Geometry

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://voteshield_user:secure_password_123@localhost:5432/voteshield_db")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_admin = Column(Boolean, default=False)
    has_voted = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    votes = relationship("Vote", back_populates="voter")


class District(Base):
    __tablename__ = "districts"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    # Using GeoAlchemy2 for PostGIS native geometry
    geom = Column(Geometry(geometry_type='POLYGON', srid=4326))
    population = Column(Integer)
    
    votes = relationship("Vote", back_populates="district")


class Vote(Base):
    __tablename__ = "votes"
    
    id = Column(Integer, primary_key=True, index=True)
    voter_id = Column(Integer, ForeignKey("users.id"))
    district_id = Column(Integer, ForeignKey("districts.id"))
    # In a real system, the vote payload would be heavily encrypted
    encrypted_payload = Column(String)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    voter = relationship("User", back_populates="votes")
    district = relationship("District", back_populates="votes")

# Create tables logic to be called on startup or migrations
def init_db():
    # Note: the PostGIS extension must be enabled in the DB before this runs
    # CREATE EXTENSION IF NOT EXISTS postgis;
    Base.metadata.create_all(bind=engine)
