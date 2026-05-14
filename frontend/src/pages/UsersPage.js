import React, { useEffect, useState } from 'react';
import { getAllUsers, createUser, deleteUser } from '../services/users.service';
import { useApp } from '../context/AppContext';
import UserList from '../components/Users/UserList';
import UserForm from '../components/Users/UserForm';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('ALL');
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

  const handleCreate = async (form) => {
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
      {showForm && <UserForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />}
      <UserList users={filtered} onDelete={handleDelete} />
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
};

export default UsersPage;