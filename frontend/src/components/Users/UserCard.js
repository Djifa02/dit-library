import React from 'react';

const typeColor = { STUDENT: '#0f3460', PROFESSOR: '#533483', STAFF: '#e94560' };

const UserCard = ({ user, onDelete }) => {
  return (
    <div style={styles.card}>
      <div style={{ ...styles.badge, backgroundColor: typeColor[user.user_type] }}>
        {user.user_type}
      </div>
      <h3 style={styles.title}>{user.first_name} {user.last_name}</h3>
      <p style={styles.info}>{user.email}</p>
      {user.student_id && <p style={styles.info}>ID: {user.student_id}</p>}
      <p style={{ ...styles.info, color: user.is_active ? '#4caf50' : '#f44336' }}>
        {user.is_active ? 'Actif' : 'Inactif'}
      </p>
      <button style={styles.btn} onClick={() => onDelete(user.id)}>
        Supprimer
      </button>
    </div>
  );
};

const styles = {
  card: { backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  badge: { display: 'inline-block', color: '#fff', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', marginBottom: '0.5rem' },
  title: { color: '#1a1a2e', marginBottom: '0.3rem' },
  info: { color: '#666', fontSize: '0.9rem', margin: '0.2rem 0' },
  btn: { backgroundColor: '#f44336', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', marginTop: '0.5rem' },
};

export default UserCard;