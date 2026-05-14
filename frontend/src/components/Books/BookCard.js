import React from 'react';

const BookCard = ({ book, onDelete }) => {
  return (
    <div style={styles.card}>
      <h3 style={styles.title}>{book.title}</h3>
      <p style={styles.author}>{book.author}</p>
      <p style={styles.info}>ISBN: {book.isbn}</p>
      <p style={styles.info}>Genre: {book.genre}</p>
      <p style={{ ...styles.info, color: book.available_copies > 0 ? '#4caf50' : '#f44336' }}>
        Disponible: {book.available_copies}/{book.total_copies}
      </p>
      <button style={styles.btn} onClick={() => onDelete(book.id)}>
        Supprimer
      </button>
    </div>
  );
};

const styles = {
  card: { backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  title: { color: '#1a1a2e', marginBottom: '0.3rem' },
  author: { color: '#e94560', marginBottom: '0.5rem' },
  info: { color: '#666', fontSize: '0.9rem', margin: '0.2rem 0' },
  btn: { backgroundColor: '#f44336', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', marginTop: '0.5rem' },
};

export default BookCard;