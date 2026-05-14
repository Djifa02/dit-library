import React, { useEffect, useState } from 'react';
import { getAllBooks, createBook, deleteBook, searchBooks } from '../services/books.service';
import { useApp } from '../context/AppContext';
import BookList from '../components/Books/BookList';
import BookForm from '../components/Books/BookForm';

const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
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

  const handleCreate = async (form) => {
    try {
      await createBook(form);
      notify('Livre cree avec succes');
      setShowForm(false);
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
      {showForm && <BookForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />}
      <BookList books={books} onDelete={handleDelete} />
    </div>
  );
};

const styles = {
  container: { padding: '2rem', maxWidth: '1200px', margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  btn: { backgroundColor: '#e94560', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer' },
  search: { width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #ddd', marginBottom: '1.5rem', fontSize: '1rem' },
};

export default BooksPage;