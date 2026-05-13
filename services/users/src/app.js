const express = require('express');
const cors = require('cors');
const usersRouter = require('./routes/users.routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'users', timestamp: new Date().toISOString() });
});

app.use('/api/users', usersRouter);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route introuvable' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
});

module.exports = app;
