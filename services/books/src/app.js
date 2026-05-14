const express = require('express');
const cors = require('cors');
const booksRouter = require('./routes/books.routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'books', timestamp: new Date().toISOString() });
});

app.use('/api/books', booksRouter);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route introuvable' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
});

module.exports = app;

