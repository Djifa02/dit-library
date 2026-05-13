import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/shared/Navbar';
import Notification from './components/shared/Notification';
import HomePage from './pages/HomePage';
import BooksPage from './pages/BooksPage';
import UsersPage from './pages/UsersPage';
import LoansPage from './pages/LoansPage';
import RecommendationsPage from './pages/RecommendationsPage';

function App() {
  return (
    <AppProvider>
      <Router>
        <Navbar />
        <Notification />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/loans" element={<LoansPage />} />
          <Route path="/recommendations" element={<RecommendationsPage />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;