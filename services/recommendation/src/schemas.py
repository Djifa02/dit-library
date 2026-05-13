from pydantic import BaseModel
from typing import List, Optional

class RecommendationResponse(BaseModel):
    user_id: int
    recommendations: List[int]
    message: str

class TrainResponse(BaseModel):
    message: str
    rmse: float
    mae: float

class HealthResponse(BaseModel):
    status: str
    service: str
    model_loaded: bool

