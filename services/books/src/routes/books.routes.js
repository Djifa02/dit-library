const express = require('express');
const router = express.Router();
const controller = require('../controllers/books.controller');

router.get('/', controller.getAllBooks);
router.get('/search', controller.searchBooks);
router.get('/:id', controller.getBookById);
router.post('/', controller.createBook);
router.put('/:id', controller.updateBook);
router.delete('/:id', controller.deleteBook);
router.patch('/:id/availability', controller.updateAvailability);

module.exports = router;
