from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import auth
import fairness
import json
import os

app = FastAPI(
    title="VoteShield API",
    description="AI-Powered Digital Voting & Fair Electoral District System",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # In production, specify the frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(fairness.router, prefix="/api/fairness", tags=["Fairness"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the VoteShield API"}

@app.get("/api/districts", tags=["Data"])
def get_districts():
    return {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "properties": {
                    "id": 1,
                    "name": "Islamabad Urban",
                    "party_a_votes": 120000,
                    "party_b_votes": 115000,
                    "efficiency_gap": 1.2,
                    "status": "Fair"
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [72.95, 33.65],
                            [73.15, 33.65],
                            [73.15, 33.75],
                            [72.95, 33.75],
                            [72.95, 33.65]
                        ]
                    ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "id": 2,
                    "name": "Rawalpindi North",
                    "party_a_votes": 150000,
                    "party_b_votes": 80000,
                    "efficiency_gap": 5.4,
                    "status": "Warning"
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [72.90, 33.55],
                            [73.05, 33.55],
                            [73.05, 33.65],
                            [72.90, 33.65],
                            [72.90, 33.55]
                        ]
                    ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "id": 3,
                    "name": "Rawalpindi South",
                    "party_a_votes": 200000,
                    "party_b_votes": 30000,
                    "efficiency_gap": 8.1,
                    "status": "Biased"
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [73.05, 33.55],
                            [73.15, 33.55],
                            [73.15, 33.65],
                            [73.05, 33.65],
                            [73.05, 33.55]
                        ]
                    ]
                }
            }
        ]
    }
