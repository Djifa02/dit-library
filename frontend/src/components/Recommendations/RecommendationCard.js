import React from 'react';

const RecommendationCard = ({ book }) => {
  return (
    <div style={styles.card}>
      <h4 style={styles.title}>{book.title}</h4>
      <p style={styles.author}>{book.author}</p>
      <p style={styles.info}>{book.genre}</p>
      <p style={{ ...styles.info, color: book.available_copies > 0 ? '#4caf50' : '#f44336' }}>
        {book.available_copies > 0 ? 'Disponible' : 'Indisponible'}
      </p>
    </div>
  );
};

const styles = {
  card: { backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  title: { color: '#1a1a2e', marginBottom: '0.3rem' },
  author: { color: '#e94560', marginBottom: '0.5rem' },
  info: { color: '#666', fontSize: '0.9rem' },
};

export default RecommendationCard;