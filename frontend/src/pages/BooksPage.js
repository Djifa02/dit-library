import React, { useEffect, useState } from 'react';
import { getAllBooks, createBook, deleteBook, searchBooks } from '../services/books.service';
import { useApp } from '../context/AppContext';

const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', author: '', isbn: '', genre: '', published_year: '', total_copies: 1 });
  const { notify } = useApp();

  useEffect(() => { fetchBooks(); }, []);

  const fetchBooks = async () => {
    try {
      const res = await getAllBooks();
      setBooks(res.data.data);
    } catch (err) {
      notify('Erreur lors du chargement des livres', 'error');
    }
  };

  const handleSearch = async (e) => {
    setSearch(e.target.value);
    if (e.target.value.length > 2) {
      const res = await searchBooks(e.target.value);
      setBooks(res.data.data);
    } else if (e.target.value === '') {
      fetchBooks();
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createBook(form);
      notify('Livre cree avec succes');
      setShowForm(false);
      setForm({ title: '', author: '', isbn: '', genre: '', published_year: '', total_copies: 1 });
      fetchBooks();
    } catch (err) {
      notify(err.response?.data?.message || 'Erreur', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce livre ?')) return;
    try {
      await deleteBook(id);
      notify('Livre supprime');
      fetchBooks();
    } catch (err) {
      notify('Erreur lors de la suppression', 'error');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Catalogue des Livres</h1>
        <button style={styles.btn} onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Annuler' : 'Ajouter un livre'}
        </button>
      </div>

      <input
        style={styles.search}
        placeholder="Rechercher par titre, auteur ou ISBN..."
        value={search}
        onChange={handleSearch}
      />

      {showForm && (
        <form onSubmit={handleCreate} style={styles.form}>
          <h3>Nouveau Livre</h3>
          {['title', 'author', 'isbn', 'genre', 'published_year', 'total_copies'].map(field => (
            <input
              key={field}
              style={styles.input}
              placeholder={field}
              value={form[field]}
              onChange={e => setForm({ ...form, [field]: e.target.value })}
              required={['title', 'author', 'isbn'].includes(field)}
            />
          ))}
          <button type="submit" style={styles.btn}>Enregistrer</button>
        </form>
      )}

      <div style={styles.grid}>
        {books.map(book => (
          <div key={book.id} style={styles.card}>
            <h3 style={styles.cardTitle}>{book.title}</h3>
            <p style={styles.cardAuthor}>{book.author}</p>
            <p style={styles.cardInfo}>ISBN: {book.isbn}</p>
            <p style={styles.cardInfo}>Genre: {book.genre}</p>
            <p style={{
              ...styles.cardInfo,
              color: book.available_copies > 0 ? '#4caf50' : '#f44336'
            }}>
              Disponible: {book.available_copies}/{book.total_copies}
            </p>
            <button
              style={{ ...styles.btn, backgroundColor: '#f44336', marginTop: '0.5rem' }}
              onClick={() => handleDelete(book.id)}
            >
              Supprimer
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '2rem', maxWidth: '1200px', margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  btn: { backgroundColor: '#e94560', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer' },
  search: { width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #ddd', marginBottom: '1.5rem', fontSize: '1rem' },
  form: { backgroundColor: '#f9f9f9', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem' },
  input: { display: 'block', width: '100%', padding: '0.6rem', margin: '0.5rem 0', borderRadius: '6px', border: '1px solid #ddd' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' },
  card: { backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  cardTitle: { color: '#1a1a2e', marginBottom: '0.3rem' },
  cardAuthor: { color: '#e94560', marginBottom: '0.5rem' },
  cardInfo: { color: '#666', fontSize: '0.9rem', margin: '0.2rem 0' },
};

export default BooksPage;