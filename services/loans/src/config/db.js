const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'dituser',
  password: process.env.DB_PASSWORD || 'ditpass',
  database: process.env.DB_NAME || 'ditlibrary',
});

pool.on('connect', () => {
  console.log('Connected to PostgreSQL');
});

pool.on('error', (err) => {
  console.error('PostgreSQL error:', err);
  process.exit(-1);
});

module.exports = pool; 