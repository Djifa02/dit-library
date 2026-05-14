import React from 'react';
import BookCard from './BookCard';

const BookList = ({ books, onDelete }) => {
  if (books.length === 0) {
    return <p style={{ color: '#666', textAlign: 'center' }}>Aucun livre trouvé</p>;
  }

  return (
    <div style={styles.grid}>
      {books.map(book => (
        <BookCard key={book.id} book={book} onDelete={onDelete} />
      ))}
    </div>
  );
};

const styles = {
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' },
};

export default BookList;