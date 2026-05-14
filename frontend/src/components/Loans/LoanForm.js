import React, { useState } from 'react';

const LoanForm = ({ onSubmit, onCancel }) => {
  const [form, setForm] = useState({ user_id: '', book_id: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h3>Nouvel Emprunt</h3>
      <input
        style={styles.input}
        placeholder="ID Utilisateur"
        value={form.user_id}
        onChange={e => setForm({ ...form, user_id: e.target.value })}
        required
      />
      <input
        style={styles.input}
        placeholder="ID Livre"
        value={form.book_id}
        onChange={e => setForm({ ...form, book_id: e.target.value })}
        required
      />
      <div style={styles.buttons}>
        <button type="submit" style={styles.btn}>Confirmer</button>
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

export default LoanForm;