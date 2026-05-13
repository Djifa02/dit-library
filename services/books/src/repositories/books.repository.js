const pool = require('../config/db');

const findAll = async () => {
  const result = await pool.query('SELECT * FROM books ORDER BY created_at DESC');
  return result.rows;
};

const findById = async (id) => {
  const result = await pool.query('SELECT * FROM books WHERE id = $1', [id]);
  return result.rows[0];
};

const findByIsbn = async (isbn) => {
  const result = await pool.query('SELECT * FROM books WHERE isbn = $1', [isbn]);
  return result.rows[0];
};

const search = async (query) => {
  const result = await pool.query(
    `SELECT * FROM books 
     WHERE title ILIKE $1 OR author ILIKE $1 OR isbn ILIKE $1
     ORDER BY title ASC`,
    [`%${query}%`]
  );
  return result.rows;
};

const create = async ({ title, author, isbn, genre, description, total_copies, published_year }) => {
  const result = await pool.query(
    `INSERT INTO books (title, author, isbn, genre, description, total_copies, available_copies, published_year)
     VALUES ($1, $2, $3, $4, $5, $6, $6, $7) RETURNING *`,
    [title, author, isbn, genre, description, total_copies || 1, published_year]
  );
  return result.rows[0];
};

const update = async (id, { title, author, isbn, genre, description, total_copies, published_year }) => {
  const result = await pool.query(
    `UPDATE books SET title=$1, author=$2, isbn=$3, genre=$4, description=$5,
     total_copies=$6, published_year=$7, updated_at=NOW()
     WHERE id=$8 RETURNING *`,
    [title, author, isbn, genre, description, total_copies, published_year, id]
  );
  return result.rows[0];
};

const remove = async (id) => {
  const result = await pool.query('DELETE FROM books WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};

const updateAvailableCopies = async (id, delta) => {
  const result = await pool.query(
    `UPDATE books SET available_copies = available_copies + $1, updated_at = NOW()
     WHERE id = $2 RETURNING *`,
    [delta, id]
  );
  return result.rows[0];
};

module.exports = { findAll, findById, findByIsbn, search, create, update, remove, updateAvailableCopies };
