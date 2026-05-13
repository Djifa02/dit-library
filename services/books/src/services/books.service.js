const repo = require('../repositories/books.repository');

const getAllBooks = async () => await repo.findAll();

const getBookById = async (id) => {
  const book = await repo.findById(id);
  if (!book) throw { status: 404, message: `Livre avec l'id ${id} introuvable` };
  return book;
};

const searchBooks = async (query) => {
  if (!query || query.trim() === '') throw { status: 400, message: 'Parametre de recherche requis' };
  return await repo.search(query.trim());
};

const createBook = async (data) => {
  const { title, author, isbn } = data;
  if (!title || !author || !isbn) {
    throw { status: 400, message: 'Titre, auteur et ISBN sont obligatoires' };
  }
  const existing = await repo.findByIsbn(isbn);
  if (existing) throw { status: 409, message: `Un livre avec l'ISBN ${isbn} existe deja` };
  return await repo.create(data);
};

const updateBook = async (id, data) => {
  const existing = await repo.findById(id);
  if (!existing) throw { status: 404, message: `Livre avec l'id ${id} introuvable` };
  return await repo.update(id, { ...existing, ...data });
};

const deleteBook = async (id) => {
  const existing = await repo.findById(id);
  if (!existing) throw { status: 404, message: `Livre avec l'id ${id} introuvable` };
  return await repo.remove(id);
};

const updateAvailability = async (id, delta) => {
  const book = await repo.findById(id);
  if (!book) throw { status: 404, message: `Livre avec l'id ${id} introuvable` };
  if (delta < 0 && book.available_copies <= 0) {
    throw { status: 400, message: 'Aucune copie disponible pour cet emprunt' };
  }
  return await repo.updateAvailableCopies(id, delta);
};

module.exports = { getAllBooks, getBookById, searchBooks, createBook, updateBook, deleteBook, updateAvailability };

