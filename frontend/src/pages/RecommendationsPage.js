import React, { useState } from 'react';
import { getRecommendations, trainModel } from '../services/recommendations.service';
import { getBookById } from '../services/books.service';
import { useApp } from '../context/AppContext';
import RecommendationCard from '../components/Recommendations/RecommendationCard';

const RecommendationsPage = () => {
  const [userId, setUserId] = useState('');
  const [books, setBooks] = useState([]);
  const [training, setTraining] = useState(false);
  const [metrics, setMetrics] = useState(null);
  const { notify } = useApp();

  const handleGetRecommendations = async (e) => {
    e.preventDefault();
    try {
      const res = await getRecommendations(userId);
      const bookDetails = await Promise.all(
        res.data.recommendations.map(id => getBookById(id).catch(() => null))
      );
      setBooks(bookDetails.filter(Boolean).map(r => r.data.data));
      notify('Recommandations chargees');
    } catch (err) {
      notify(err.response?.data?.detail || 'Erreur', 'error');
    }
  };

  const handleTrain = async () => {
    setTraining(true);
    try {
      const res = await trainModel();
      setMetrics(res.data);
      notify('Modele entraine avec succes');
    } catch (err) {
      notify('Erreur lors de l entrainement', 'error');
    } finally {
      setTraining(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1>Recommandations</h1>
      <div style={styles.section}>
        <h3>Entrainement du modele</h3>
        <button style={styles.btn} onClick={handleTrain} disabled={training}>
          {training ? 'Entrainement en cours...' : 'Entrainer le modele'}
        </button>
        {metrics && (
          <div style={styles.metrics}>
            <p>Modele entraine avec succes</p>
            <p>RMSE: {metrics.rmse?.toFixed(4)}</p>
            <p>MAE: {metrics.mae?.toFixed(4)}</p>
          </div>
        )}
      </div>
      <div style={styles.section}>
        <h3>Obtenir des recommandations</h3>
        <form onSubmit={handleGetRecommendations} style={styles.form}>
          <input
            style={styles.input}
            placeholder="ID Utilisateur"
            value={userId}
            onChange={e => setUserId(e.target.value)}
            required
          />
          <button type="submit" style={styles.btn}>Obtenir les recommandations</button>
        </form>
      </div>
      {books.length > 0 && (
        <div>
          <h3>Livres recommandes pour l utilisateur {userId}</h3>
          <div style={styles.grid}>
            {books.map(book => (
              <RecommendationCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: '2rem', maxWidth: '1200px', margin: '0 auto' },
  btn: { backgroundColor: '#e94560', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer' },
  section: { backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '2rem' },
  form: { display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '1rem' },
  input: { padding: '0.6rem', borderRadius: '6px', border: '1px solid #ddd', fontSize: '1rem', width: '200px' },
  metrics: { marginTop: '1rem', padding: '1rem', backgroundColor: '#f0f7f0', borderRadius: '6px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' },
};

export default RecommendationsPage;