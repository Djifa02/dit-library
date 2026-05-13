import os
import joblib
import numpy as np
import pandas as pd
from sklearn.neighbors import NearestNeighbors
from sklearn.metrics import mean_squared_error, mean_absolute_error
from scipy.sparse import csr_matrix
import psycopg2
from dotenv import load_dotenv

load_dotenv()

MODEL_PATH = os.getenv('MODEL_PATH', '/app/model/model.pkl')

def get_db_connection():
    return psycopg2.connect(
        host=os.getenv('DB_HOST', 'localhost'),
        port=os.getenv('DB_PORT', 5432),
        user=os.getenv('DB_USER', 'dituser'),
        password=os.getenv('DB_PASSWORD', 'ditpass'),
        dbname=os.getenv('DB_NAME', 'ditlibrary')
    )

def load_data():
    conn = get_db_connection()
    query = """
        SELECT user_id, book_id, rating
        FROM loans
        WHERE status = 'RETURNED' AND rating IS NOT NULL
    """
    df = pd.read_sql(query, conn)
    conn.close()
    return df

def train_model():
    df = load_data()

    if df.empty:
        raise ValueError("Pas assez de donnees pour entrainer le modele")

    # Matrice user-book
    user_book_matrix = df.pivot_table(
        index='user_id',
        columns='book_id',
        values='rating',
        fill_value=0
    )

    matrix_sparse = csr_matrix(user_book_matrix.values)

    # Modele KNN
    model = NearestNeighbors(metric='cosine', algorithm='brute', n_neighbors=5)
    model.fit(matrix_sparse)

    # Calcul des metriques
    predictions = []
    actuals = []
    for _, row in df.iterrows():
        if row['user_id'] in user_book_matrix.index:
            user_idx = user_book_matrix.index.get_loc(row['user_id'])
            pred = user_book_matrix.iloc[user_idx][row['book_id']] if row['book_id'] in user_book_matrix.columns else 0
            predictions.append(pred)
            actuals.append(row['rating'])

    rmse = float(np.sqrt(mean_squared_error(actuals, predictions))) if actuals else 0.0
    mae = float(mean_absolute_error(actuals, predictions)) if actuals else 0.0

    # Sauvegarde
    model_data = {
        'model': model,
        'user_book_matrix': user_book_matrix,
        'user_ids': list(user_book_matrix.index),
        'book_ids': list(user_book_matrix.columns)
    }

    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    joblib.dump(model_data, MODEL_PATH)

    return rmse, mae

def get_recommendations(user_id: int, n_recommendations: int = 5):
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError("Modele non trouve, veuillez entrainer le modele d'abord")

    model_data = joblib.load(MODEL_PATH)
    model = model_data['model']
    user_book_matrix = model_data['user_book_matrix']

    if user_id not in user_book_matrix.index:
        # Retourner les livres les plus populaires
        df = load_data()
        popular = df.groupby('book_id')['rating'].mean().sort_values(ascending=False)
        return list(popular.head(n_recommendations).index)

    user_idx = user_book_matrix.index.get_loc(user_id)
    user_vector = user_book_matrix.iloc[user_idx].values.reshape(1, -1)

    distances, indices = model.kneighbors(user_vector, n_neighbors=min(6, len(user_book_matrix)))

    # Livres deja empruntes par l'utilisateur
    already_borrowed = set(user_book_matrix.columns[user_book_matrix.iloc[user_idx] > 0])

    recommended_books = []
    for idx in indices[0][1:]:
        neighbor_books = user_book_matrix.iloc[idx]
        for book_id, rating in neighbor_books.items():
            if rating > 0 and book_id not in already_borrowed and book_id not in recommended_books:
                recommended_books.append(int(book_id))
            if len(recommended_books) >= n_recommendations:
                break
        if len(recommended_books) >= n_recommendations:
            break

    return recommended_books

def is_model_loaded():
    return os.path.exists(MODEL_PATH)

