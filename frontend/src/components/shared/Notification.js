import React from 'react';
import { useApp } from '../../context/AppContext';

const Notification = () => {
  const { notification } = useApp();
  if (!notification) return null;

  const bg = notification.type === 'success' ? '#4caf50' : '#f44336';

  return (
    <div style={{
      position: 'fixed', top: '70px', right: '20px',
      backgroundColor: bg, color: '#fff',
      padding: '1rem 1.5rem', borderRadius: '8px',
      zIndex: 999, boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    }}>
      {notification.message}
    </div>
  );
};

export default Notification;

