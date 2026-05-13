import React, { useEffect, useState } from 'react';
import { getAllLoans, createLoan, returnLoan, getOverdueLoans } from '../services/loans.service';
import { useApp } from '../context/AppContext';

const LoansPage = () => {
  const [loans, setLoans] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('ALL');
  const [form, setForm] = useState({ user_id: '', book_id: '' });
  const { notify } = useApp();

  useEffect(() => { fetchLoans(); }, []);

  const fetchLoans = async () => {
    try {
      const res = await getAllLoans();
      setLoans(res.data.data);
    } catch (err) {
      notify('Erreur lors du chargement', 'error');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createLoan(form);
      notify('Emprunt cree avec succes');
      setShowForm(false);
      fetchLoans();
    } catch (err) {
      notify(err.response?.data?.message || 'Erreur', 'error');
    }
  };

  const handleReturn = async (id) => {
    const rating = window.prompt('Note pour ce livre (1-5) :');
    try {
      await returnLoan(id, rating ? parseInt(rating) : null);
      notify('Livre retourne avec succes');
      fetchLoans();
    } catch (err) {
      notify('Erreur lors du retour', 'error');
    }
  };

  const filtered = filter === 'ALL' ? loans : loans.filter(l => l.status === filter);

  const statusColor = { ACTIVE: '#0f3460', RETURNED: '#4caf50', OVERDUE: '#f44336' };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Emprunts</h1>
        <button style={styles.btn} onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Annuler' : 'Nouvel emprunt'}
        </button>
      </div>

      <div style={styles.filters}>
        {['ALL', 'ACTIVE', 'RETURNED', 'OVERDUE'].map(s => (
          <button
            key={s}
            style={{ ...styles.filterBtn, ...(filter === s ? styles.filterActive : {}) }}
            onClick={() => setFilter(s)}
          >
            {s}
          </button>
        ))}
      </div>

      {showForm && (
        <form onSubmit={handleCreate} style={styles.form}>
          <h3>Nouvel Emprunt</h3>
          <input style={styles.input} placeholder="ID Utilisateur" value={form.user_id}
            onChange={e => setForm({ ...form, user_id: e.target.value })} required />
          <input style={styles.input} placeholder="ID Livre" value={form.book_id}
            onChange={e => setForm({ ...form, book_id: e.target.value })} required />
          <button type="submit" style={styles.btn}>Confirmer</button>
        </form>
      )}

      <div style={styles.table}>
        <div style={styles.tableHeader}>
          <span>Utilisateur</span>
          <span>Livre</span>
          <span>Date emprunt</span>
          <span>Date retour prevue</span>
          <span>Statut</span>
          <span>Action</span>
        </div>
        {filtered.map(loan => (
          <div key={loan.id} style={styles.tableRow}>
            <span>{loan.first_name} {loan.last_name}</span>
            <span>{loan.title}</span>
            <span>{new Date(loan.loan_date).toLocaleDateString()}</span>
            <span>{new Date(loan.due_date).toLocaleDateString()}</span>
            <span style={{ color: statusColor[loan.status], fontWeight: 'bold' }}>{loan.status}</span>
            <span>
              {loan.status === 'ACTIVE' || loan.status === 'OVERDUE' ? (
                <button style={{ ...styles.btn, padding: '0.3rem 0.8rem', fontSize: '0.85rem' }}
                  onClick={() => handleReturn(loan.id)}>
                  Retourner
                </button>
              ) : '-'}
            </span>
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
  filters: { display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' },
  filterBtn: { padding: '0.4rem 1rem', border: '1px solid #ddd', borderRadius: '20px', cursor: 'pointer', backgroundColor: '#fff' },
  filterActive: { backgroundColor: '#1a1a2e', color: '#fff', border: '1px solid #1a1a2e' },
  form: { backgroundColor: '#f9f9f9', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem' },
  input: { display: 'block', width: '100%', padding: '0.6rem', margin: '0.5rem 0', borderRadius: '6px', border: '1px solid #ddd' },
  table: { backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'hidden' },
  tableHeader: { display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 1fr 1fr 1fr 1fr', padding: '1rem', backgroundColor: '#1a1a2e', color: '#fff', fontWeight: 'bold' },
  tableRow: { display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 1fr 1fr 1fr 1fr', padding: '1rem', borderBottom: '1px solid #eee', alignItems: 'center' },
};

export default LoansPage;