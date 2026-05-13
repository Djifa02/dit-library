import React, { useEffect, useState } from 'react';
import { getAllUsers, createUser, deleteUser } from '../services/users.service';
import { useApp } from '../context/AppContext';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('ALL');
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', user_type: 'STUDENT', student_id: '', phone: '' });
  const { notify } = useApp();

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res.data.data);
    } catch (err) {
      notify('Erreur lors du chargement', 'error');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createUser(form);
      notify('Utilisateur cree avec succes');
      setShowForm(false);
      fetchUsers();
    } catch (err) {
      notify(err.response?.data?.message || 'Erreur', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cet utilisateur ?')) return;
    try {
      await deleteUser(id);
      notify('Utilisateur supprime');
      fetchUsers();
    } catch (err) {
      notify('Erreur lors de la suppression', 'error');
    }
  };

  const filtered = filter === 'ALL' ? users : users.filter(u => u.user_type === filter);

  const typeColor = { STUDENT: '#0f3460', PROFESSOR: '#533483', STAFF: '#e94560' };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Utilisateurs</h1>
        <button style={styles.btn} onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Annuler' : 'Ajouter un utilisateur'}
        </button>
      </div>

      <div style={styles.filters}>
        {['ALL', 'STUDENT', 'PROFESSOR', 'STAFF'].map(type => (
          <button
            key={type}
            style={{ ...styles.filterBtn, ...(filter === type ? styles.filterActive : {}) }}
            onClick={() => setFilter(type)}
          >
            {type}
          </button>
        ))}
      </div>

      {showForm && (
        <form onSubmit={handleCreate} style={styles.form}>
          <h3>Nouvel Utilisateur</h3>
          {['first_name', 'last_name', 'email', 'student_id', 'phone'].map(field => (
            <input
              key={field}
              style={styles.input}
              placeholder={field}
              value={form[field]}
              onChange={e => setForm({ ...form, [field]: e.target.value })}
              required={['first_name', 'last_name', 'email'].includes(field)}
            />
          ))}
          <select style={styles.input} value={form.user_type} onChange={e => setForm({ ...form, user_type: e.target.value })}>
            <option value="STUDENT">Etudiant</option>
            <option value="PROFESSOR">Professeur</option>
            <option value="STAFF">Personnel</option>
          </select>
          <button type="submit" style={styles.btn}>Enregistrer</button>
        </form>
      )}

      <div style={styles.grid}>
        {filtered.map(user => (
          <div key={user.id} style={styles.card}>
            <div style={{ ...styles.badge, backgroundColor: typeColor[user.user_type] }}>
              {user.user_type}
            </div>
            <h3 style={styles.cardTitle}>{user.first_name} {user.last_name}</h3>
            <p style={styles.cardInfo}>{user.email}</p>
            {user.student_id && <p style={styles.cardInfo}>ID: {user.student_id}</p>}
            <p style={{ ...styles.cardInfo, color: user.is_active ? '#4caf50' : '#f44336' }}>
              {user.is_active ? 'Actif' : 'Inactif'}
            </p>
            <button
              style={{ ...styles.btn, backgroundColor: '#f44336', marginTop: '0.5rem' }}
              onClick={() => handleDelete(user.id)}
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
  filters: { display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' },
  filterBtn: { padding: '0.4rem 1rem', border: '1px solid #ddd', borderRadius: '20px', cursor: 'pointer', backgroundColor: '#fff' },
  filterActive: { backgroundColor: '#1a1a2e', color: '#fff', border: '1px solid #1a1a2e' },
  form: { backgroundColor: '#f9f9f9', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem' },
  input: { display: 'block', width: '100%', padding: '0.6rem', margin: '0.5rem 0', borderRadius: '6px', border: '1px solid #ddd' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' },
  card: { backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  badge: { display: 'inline-block', color: '#fff', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', marginBottom: '0.5rem' },
  cardTitle: { color: '#1a1a2e', marginBottom: '0.3rem' },
  cardInfo: { color: '#666', fontSize: '0.9rem', margin: '0.2rem 0' },
};

export default UsersPage;