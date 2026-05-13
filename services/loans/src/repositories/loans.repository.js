const pool = require('../config/db');

const findAll = async () => {
  const result = await pool.query(`
    SELECT l.*, 
      u.first_name, u.last_name, u.email,
      b.title, b.author, b.isbn
    FROM loans l
    JOIN users u ON l.user_id = u.id
    JOIN books b ON l.book_id = b.id
    ORDER BY l.created_at DESC
  `);
  return result.rows;
};

const findById = async (id) => {
  const result = await pool.query(`
    SELECT l.*, 
      u.first_name, u.last_name, u.email,
      b.title, b.author, b.isbn
    FROM loans l
    JOIN users u ON l.user_id = u.id
    JOIN books b ON l.book_id = b.id
    WHERE l.id = $1
  `, [id]);
  return result.rows[0];
};

const findByUserId = async (user_id) => {
  const result = await pool.query(`
    SELECT l.*, b.title, b.author, b.isbn
    FROM loans l
    JOIN books b ON l.book_id = b.id
    WHERE l.user_id = $1
    ORDER BY l.created_at DESC
  `, [user_id]);
  return result.rows;
};

const findActiveByUserId = async (user_id) => {
  const result = await pool.query(`
    SELECT l.*, b.title, b.author, b.isbn
    FROM loans l
    JOIN books b ON l.book_id = b.id
    WHERE l.user_id = $1 AND l.status = 'ACTIVE'
  `, [user_id]);
  return result.rows;
};

const findOverdue = async () => {
  const result = await pool.query(`
    SELECT l.*, 
      u.first_name, u.last_name, u.email,
      b.title, b.author
    FROM loans l
    JOIN users u ON l.user_id = u.id
    JOIN books b ON l.book_id = b.id
    WHERE l.status = 'ACTIVE' AND l.due_date < NOW()
  `);
  return result.rows;
};

const create = async ({ user_id, book_id, due_date }) => {
  const result = await pool.query(`
    INSERT INTO loans (user_id, book_id, due_date)
    VALUES ($1, $2, $3)
    RETURNING *
  `, [user_id, book_id, due_date]);
  return result.rows[0];
};

const returnLoan = async (id, rating) => {
  const result = await pool.query(`
    UPDATE loans SET status='RETURNED', return_date=NOW(), rating=$1, updated_at=NOW()
    WHERE id=$2 RETURNING *
  `, [rating || null, id]);
  return result.rows[0];
};

const updateOverdue = async () => {
  const result = await pool.query(`
    UPDATE loans SET status='OVERDUE', updated_at=NOW()
    WHERE status='ACTIVE' AND due_date < NOW()
    RETURNING *
  `);
  return result.rows;
};

const exportForML = async () => {
  const result = await pool.query(`
    SELECT user_id, book_id, rating, loan_date, return_date
    FROM loans
    WHERE status = 'RETURNED' AND rating IS NOT NULL
    ORDER BY user_id, book_id
  `);
  return result.rows;
};

module.exports = { findAll, findById, findByUserId, findActiveByUserId, findOverdue, create, returnLoan, updateOverdue, exportForML }; 
