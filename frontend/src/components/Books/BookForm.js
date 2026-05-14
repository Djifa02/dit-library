import React, { useState } from 'react';

const BookForm = ({ onSubmit, onCancel }) => {
  const [form, setForm] = useState({
    title: '', author: '', isbn: '', genre: '', published_year: '', total_copies: 1
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
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
      <div style={styles.buttons}>
        <button type="submit" style={styles.btn}>Enregistrer</button>
        <button type="button" style={{ ...styles.btn, backgroundColor: '#666' }} onClick={onCancel}>Annuler</button>
      </div>
    </form>
  );
};

const styles = {
  form: { backgroundColor: '#f9f9f9', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem' },
  input: { display: 'block', width: '100%', padding: '0.6rem', margin: '0.5rem 0', borderRadius: '6px', border: '1px solid #ddd' },
  buttons: { display: 'flex', gap: '1rem', marginTop: '1rem' },
  btn: { backgroundColor: '#e94560', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer' },
};

export default BookForm;