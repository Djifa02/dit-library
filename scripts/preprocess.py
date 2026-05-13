import pandas as pd
import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def export_and_clean():
    conn = psycopg2.connect(
        host=os.getenv('DB_HOST', 'localhost'),
        port=os.getenv('DB_PORT', 5432),
        user=os.getenv('DB_USER', 'dituser'),
        password=os.getenv('DB_PASSWORD', 'ditpass'),
        dbname=os.getenv('DB_NAME', 'ditlibrary')
    )

    query = """
        SELECT user_id, book_id, rating, loan_date, return_date
        FROM loans
        WHERE status = 'RETURNED' AND rating IS NOT NULL
        ORDER BY user_id, book_id
    """

    df = pd.read_sql(query, conn)
    conn.close()

    print(f"Donnees brutes : {len(df)} lignes")

    # Nettoyage
    df = df.dropna(subset=['user_id', 'book_id', 'rating'])
    df = df[df['rating'].between(1, 5)]
    df['user_id'] = df['user_id'].astype(int)
    df['book_id'] = df['book_id'].astype(int)
    df['rating'] = df['rating'].astype(int)
    df = df.drop_duplicates(subset=['user_id', 'book_id'], keep='last')

    print(f"Donnees nettoyees : {len(df)} lignes")

    os.makedirs('data', exist_ok=True)
    df.to_csv('data/loans_clean.csv', index=False)
    print("Fichier data/loans_clean.csv cree avec succes")

if __name__ == '__main__':
    export_and_clean() 
