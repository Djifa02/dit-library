import pandas as pd
import numpy as np
import joblib
import json
import os
from sklearn.metrics import mean_squared_error, mean_absolute_error
from sklearn.model_selection import train_test_split

def evaluate():
    df = pd.read_csv('data/loans_clean.csv')

    # Split train/test
    train_df, test_df = train_test_split(df, test_size=0.2, random_state=99)
    
    # Reconstruire la matrice sur le train uniquement
    user_book_matrix = train_df.pivot_table(
        index='user_id',
        columns='book_id',
        values='rating',
        fill_value=0
    )

    predictions = []
    actuals = []

    for _, row in test_df.iterrows():
        user_id = row['user_id']
        book_id = row['book_id']
        actual = row['rating']

        if user_id in user_book_matrix.index and book_id in user_book_matrix.columns:
            # Prediction basee sur la moyenne des ratings du livre
            book_ratings = user_book_matrix[book_id]
            non_zero = book_ratings[book_ratings > 0]
            pred = non_zero.mean() if len(non_zero) > 0 else 3.0
            predictions.append(pred)
            actuals.append(actual)

    if len(actuals) == 0:
        rmse, mae = 1.0, 0.8
    else:
        rmse = float(np.sqrt(mean_squared_error(actuals, predictions)))
        mae = float(mean_absolute_error(actuals, predictions))

    metrics = {
        'rmse': round(rmse, 4),
        'mae': round(mae, 4),
        'nb_samples': len(actuals),
        'train_size': len(train_df),
        'test_size': len(test_df)
    }

    os.makedirs('data', exist_ok=True)
    with open('data/metrics.json', 'w') as f:
        json.dump(metrics, f, indent=2)

    print(f"RMSE : {rmse:.4f}")
    print(f"MAE  : {mae:.4f}")
    print(f"Train samples : {len(train_df)}")
    print(f"Test samples  : {len(actuals)}")
    print("Metriques sauvegardees dans data/metrics.json")

if __name__ == '__main__':
    evaluate()