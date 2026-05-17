from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter()

class DistrictData(BaseModel):
    district_id: int
    party_a_votes: int
    party_b_votes: int

class ElectionData(BaseModel):
    districts: List[DistrictData]

@router.post("/efficiency-gap")
def calculate_efficiency_gap(election: ElectionData):
    """
    Calculates the Efficiency Gap to detect potential gerrymandering.
    
    Mathematical Structure:
    1. For each district, determine the winner.
    2. Calculate "Wasted Votes":
       - Winning Party: Wasted Votes = Total Votes for Winner - (Total Votes / 2 + 1)
       - Losing Party: Wasted Votes = Total Votes for Loser
    3. Sum total wasted votes for Party A and Party B across all districts.
    4. Efficiency Gap (EG) = (Total Wasted Party A - Total Wasted Party B) / Total Statewide Votes
    
    A high EG indicates a disproportionate advantage for one party.
    """
    total_wasted_a = 0
    total_wasted_b = 0
    total_votes_overall = 0

    for district in election.districts:
        total_district_votes = district.party_a_votes + district.party_b_votes
        total_votes_overall += total_district_votes
        
        # Determine winning threshold (simple majority)
        win_threshold = (total_district_votes // 2) + 1
        
        if district.party_a_votes > district.party_b_votes:
            # Party A wins
            wasted_a = district.party_a_votes - win_threshold
            wasted_b = district.party_b_votes
        else:
            # Party B wins
            wasted_a = district.party_a_votes
            wasted_b = district.party_b_votes - win_threshold
            
        total_wasted_a += wasted_a
        total_wasted_b += wasted_b

    if total_votes_overall == 0:
        return {"efficiency_gap": 0.0, "message": "No votes recorded."}

    efficiency_gap = (total_wasted_a - total_wasted_b) / total_votes_overall

    # Positive EG favors Party B (since A wasted more)
    # Negative EG favors Party A (since B wasted more)
    
    return {
        "efficiency_gap": efficiency_gap,
        "total_wasted_a": total_wasted_a,
        "total_wasted_b": total_wasted_b,
        "total_votes": total_votes_overall
    }
