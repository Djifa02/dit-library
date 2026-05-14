import React from 'react';
import UserCard from './UserCard';

const UserList = ({ users, onDelete }) => {
  if (users.length === 0) {
    return <p style={{ color: '#666', textAlign: 'center' }}>Aucun utilisateur trouvé</p>;
  }

  return (
    <div style={styles.grid}>
      {users.map(user => (
        <UserCard key={user.id} user={user} onDelete={onDelete} />
      ))}
    </div>
  );
};

const styles = {
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' },
};

export default UserList;