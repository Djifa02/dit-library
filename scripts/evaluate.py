import pandas as pd
import numpy as np
import joblib
import json
import os
from sklearn.metrics import mean_squared_error, mean_absolute_error

def evaluate():
    df = pd.read_csv('data/loans_clean.csv')
    model_data = joblib.load('services/recommendation/model/model.pkl')
    user_book_matrix = model_data['user_book_matrix']

    predictions = []
    actuals = []

    for _, row in df.iterrows():
        user_id = row['user_id']
        book_id = row['book_id']
        actual = row['rating']

        if user_id in user_book_matrix.index and book_id in user_book_matrix.columns:
            pred = user_book_matrix.loc[user_id, book_id]
            predictions.append(pred)
            actuals.append(actual)

    rmse = float(np.sqrt(mean_squared_error(actuals, predictions)))
    mae = float(mean_absolute_error(actuals, predictions))

    metrics = {
        'rmse': round(rmse, 4),
        'mae': round(mae, 4),
        'nb_samples': len(actuals)
    }

    os.makedirs('data', exist_ok=True)
    with open('data/metrics.json', 'w') as f:
        json.dump(metrics, f, indent=2)

    print(f"RMSE : {rmse:.4f}")
    print(f"MAE  : {mae:.4f}")
    print(f"Samples : {len(actuals)}")
    print("Metriques sauvegardees dans data/metrics.json")

if __name__ == '__main__':
    evaluate() 
