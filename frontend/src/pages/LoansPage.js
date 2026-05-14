import React, { useEffect, useState } from 'react';
import { getAllLoans, createLoan, returnLoan } from '../services/loans.service';
import { useApp } from '../context/AppContext';
import LoanRow from '../components/Loans/LoanRow';
import LoanForm from '../components/Loans/LoanForm';

const LoansPage = () => {
  const [loans, setLoans] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('ALL');
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

  const handleCreate = async (form) => {
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
      {showForm && <LoanForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />}
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
          <LoanRow key={loan.id} loan={loan} onReturn={handleReturn} />
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
  table: { backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'hidden' },
  tableHeader: { display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 1fr 1fr 1fr 1fr', padding: '1rem', backgroundColor: '#1a1a2e', color: '#fff', fontWeight: 'bold' },
};

export default LoansPage;