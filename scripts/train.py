import pandas as pd
import numpy as np
import joblib
import os
from sklearn.neighbors import NearestNeighbors
from scipy.sparse import csr_matrix

def train():
    df = pd.read_csv('data/loans_clean.csv')
    print(f"Donnees chargees : {len(df)} lignes")

    # Matrice user-book
    user_book_matrix = df.pivot_table(
        index='user_id',
        columns='book_id',
        values='rating',
        fill_value=0
    )

    print(f"Matrice : {user_book_matrix.shape[0]} users x {user_book_matrix.shape[1]} books")

    matrix_sparse = csr_matrix(user_book_matrix.values)

    # Entrainement KNN
    model = NearestNeighbors(metric='cosine', algorithm='brute', n_neighbors=5)
    model.fit(matrix_sparse)

    model_data = {
        'model': model,
        'user_book_matrix': user_book_matrix,
        'user_ids': list(user_book_matrix.index),
        'book_ids': list(user_book_matrix.columns)
    }

    os.makedirs('services/recommendation/model', exist_ok=True)
    joblib.dump(model_data, 'services/recommendation/model/model.pkl')
    print("Modele sauvegarde dans services/recommendation/model/model.pkl")

if __name__ == '__main__':
    train()