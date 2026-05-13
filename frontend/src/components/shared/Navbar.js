import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const links = [
    { path: '/', label: 'Accueil' },
    { path: '/books', label: 'Livres' },
    { path: '/users', label: 'Utilisateurs' },
    { path: '/loans', label: 'Emprunts' },
    { path: '/recommendations', label: 'Recommandations' },
  ];

  return (
    <nav style={styles.nav}>
      <div style={styles.brand}>DIT Library</div>
      <div style={styles.links}>
        {links.map(link => (
          <Link
            key={link.path}
            to={link.path}
            style={{
              ...styles.link,
              ...(location.pathname === link.path ? styles.activeLink : {})
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1a1a2e',
    padding: '0 2rem',
    height: '60px',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  brand: {
    color: '#e94560',
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  links: {
    display: 'flex',
    gap: '1.5rem',
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '0.95rem',
    padding: '0.3rem 0.6rem',
    borderRadius: '4px',
  },
  activeLink: {
    backgroundColor: '#e94560',
    color: '#fff',
  },
};

export default Navbar;