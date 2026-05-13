const repo = require('../repositories/loans.repository');
const axios = require('axios');

const BOOKS_SERVICE_URL = process.env.BOOKS_SERVICE_URL || 'http://localhost:3001';
const USERS_SERVICE_URL = process.env.USERS_SERVICE_URL || 'http://localhost:3002';

const getAllLoans = async () => await repo.findAll();

const getLoanById = async (id) => {
  const loan = await repo.findById(id);
  if (!loan) throw { status: 404, message: `Emprunt avec l'id ${id} introuvable` };
  return loan;
};

const getLoansByUser = async (user_id) => await repo.findByUserId(user_id);

const getOverdueLoans = async () => {
  await repo.updateOverdue();
  return await repo.findOverdue();
};

const createLoan = async ({ user_id, book_id, due_date }) => {
  if (!user_id || !book_id) throw { status: 400, message: 'user_id et book_id sont obligatoires' };

  // Verifier que l'utilisateur existe
  try {
    await axios.get(`${USERS_SERVICE_URL}/api/users/${user_id}`);
  } catch (err) {
    throw { status: 404, message: `Utilisateur ${user_id} introuvable` };
  }

  // Verifier que le livre est disponible
  let book;
  try {
    const res = await axios.get(`${BOOKS_SERVICE_URL}/api/books/${book_id}`);
    book = res.data.data;
  } catch (err) {
    throw { status: 404, message: `Livre ${book_id} introuvable` };
  }

  if (book.available_copies <= 0) {
    throw { status: 400, message: 'Aucune copie disponible pour ce livre' };
  }

  // Verifier que l'utilisateur n'a pas deja ce livre
  const activeLoans = await repo.findActiveByUserId(user_id);
  const alreadyBorrowed = activeLoans.find(l => l.book_id === parseInt(book_id));
  if (alreadyBorrowed) throw { status: 400, message: 'Vous avez deja emprunte ce livre' };

  const loanDate = new Date();
  const dueDate = due_date || new Date(loanDate.getTime() + 14 * 24 * 60 * 60 * 1000);

  const loan = await repo.create({ user_id, book_id, due_date: dueDate });

  // Mettre a jour les copies disponibles
  await axios.patch(`${BOOKS_SERVICE_URL}/api/books/${book_id}/availability`, { delta: -1 });

  return loan;
};

const returnLoan = async (id, rating) => {
  const loan = await repo.findById(id);
  if (!loan) throw { status: 404, message: `Emprunt avec l'id ${id} introuvable` };
  if (loan.status === 'RETURNED') throw { status: 400, message: 'Ce livre a deja ete retourne' };

  const returned = await repo.returnLoan(id, rating);

  // Remettre la copie disponible
  await axios.patch(`${BOOKS_SERVICE_URL}/api/books/${loan.book_id}/availability`, { delta: 1 });

  return returned;
};

const exportForML = async () => await repo.exportForML();

module.exports = { getAllLoans, getLoanById, getLoansByUser, getOverdueLoans, createLoan, returnLoan, exportForML }; 
