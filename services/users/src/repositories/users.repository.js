const pool = require('../config/db');

const findAll = async () => {
  const result = await pool.query('SELECT * FROM users ORDER BY created_at DESC');
  return result.rows;
};

const findById = async (id) => {
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0];
};

const findByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

const findByStudentId = async (student_id) => {
  const result = await pool.query('SELECT * FROM users WHERE student_id = $1', [student_id]);
  return result.rows[0];
};

const findByType = async (user_type) => {
  const result = await pool.query(
    'SELECT * FROM users WHERE user_type = $1 ORDER BY last_name ASC', [user_type]
  );
  return result.rows;
};

const create = async ({ first_name, last_name, email, user_type, student_id, phone }) => {
  const result = await pool.query(
    `INSERT INTO users (first_name, last_name, email, user_type, student_id, phone)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [first_name, last_name, email, user_type || 'STUDENT', student_id || null, phone || null]
  );
  return result.rows[0];
};

const update = async (id, { first_name, last_name, email, user_type, student_id, phone, is_active }) => {
  const result = await pool.query(
    `UPDATE users SET first_name=$1, last_name=$2, email=$3, user_type=$4,
     student_id=$5, phone=$6, is_active=$7, updated_at=NOW()
     WHERE id=$8 RETURNING *`,
    [first_name, last_name, email, user_type, student_id, phone, is_active, id]
  );
  return result.rows[0];
};

const remove = async (id) => {
  const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};

const deactivate = async (id) => {
  const result = await pool.query(
    'UPDATE users SET is_active = false, updated_at = NOW() WHERE id = $1 RETURNING *', [id]
  );
  return result.rows[0];
};

module.exports = { findAll, findById, findByEmail, findByStudentId, findByType, create, update, remove, deactivate }; 
