from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from src.schemas import RecommendationResponse, TrainResponse, HealthResponse
from src import model as ml_model

app = FastAPI(title="DIT Library - Recommendation Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health", response_model=HealthResponse)
def health():
    return {
        "status": "OK",
        "service": "recommendation",
        "model_loaded": ml_model.is_model_loaded()
    }

@app.get("/recommendations/{user_id}", response_model=RecommendationResponse)
def get_recommendations(user_id: int, n: int = 5):
    try:
        recommendations = ml_model.get_recommendations(user_id, n)
        return {
            "user_id": user_id,
            "recommendations": recommendations,
            "message": f"{len(recommendations)} recommandations trouvees"
        }
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/train", response_model=TrainResponse)
def train():
    try:
        rmse, mae = ml_model.train_model()
        return {
            "message": "Modele entraine avec succes",
            "rmse": rmse,
            "mae": mae
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))