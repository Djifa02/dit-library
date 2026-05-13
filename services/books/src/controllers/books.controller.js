const service = require('../services/books.service');

const getAllBooks = async (req, res) => {
  try {
    const books = await service.getAllBooks();
    res.json({ success: true, data: books, count: books.length });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

const getBookById = async (req, res) => {
  try {
    const book = await service.getBookById(req.params.id);
    res.json({ success: true, data: book });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

const searchBooks = async (req, res) => {
  try {
    const books = await service.searchBooks(req.query.q);
    res.json({ success: true, data: books, count: books.length });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

const createBook = async (req, res) => {
  try {
    const book = await service.createBook(req.body);
    res.status(201).json({ success: true, data: book, message: 'Livre cree avec succes' });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

const updateBook = async (req, res) => {
  try {
    const book = await service.updateBook(req.params.id, req.body);
    res.json({ success: true, data: book, message: 'Livre mis a jour avec succes' });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

const deleteBook = async (req, res) => {
  try {
    await service.deleteBook(req.params.id);
    res.json({ success: true, message: 'Livre supprime avec succes' });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

const updateAvailability = async (req, res) => {
  try {
    const { delta } = req.body;
    const book = await service.updateAvailability(req.params.id, delta);
    res.json({ success: true, data: book, message: 'Disponibilite mise a jour' });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

module.exports = { getAllBooks, getBookById, searchBooks, createBook, updateBook, deleteBook, updateAvailability };
