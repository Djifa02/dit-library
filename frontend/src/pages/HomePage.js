import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const cards = [
    { path: '/books', title: 'Livres', description: 'Consulter et gerer le catalogue', color: '#e94560' },
    { path: '/users', title: 'Utilisateurs', description: 'Gerer les utilisateurs', color: '#0f3460' },
    { path: '/loans', title: 'Emprunts', description: 'Suivre les emprunts', color: '#533483' },
    { path: '/recommendations', title: 'Recommandations', description: 'Voir les recommandations IA', color: '#e94560' },
  ];

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Bienvenue a la DIT Library</h1>
      <p style={styles.subtitle}>Plateforme de gestion de bibliotheque academique</p>
      <div style={styles.grid}>
        {cards.map(card => (
          <Link to={card.path} key={card.path} style={{ textDecoration: 'none' }}>
            <div style={{ ...styles.card, borderTop: `4px solid ${card.color}` }}>
              <h2 style={{ color: card.color }}>{card.title}</h2>
              <p style={styles.cardDesc}>{card.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '3rem 2rem', maxWidth: '1200px', margin: '0 auto' },
  title: { fontSize: '2.5rem', color: '#1a1a2e', marginBottom: '0.5rem' },
  subtitle: { color: '#666', marginBottom: '3rem', fontSize: '1.1rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' },
  card: {
    backgroundColor: '#fff', padding: '2rem', borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)', cursor: 'pointer',
    transition: 'transform 0.2s',
  },
  cardDesc: { color: '#666', marginTop: '0.5rem' },
};

export default HomePage;