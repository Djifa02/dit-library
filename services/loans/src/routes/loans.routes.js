const express = require('express');
const router = express.Router();
const controller = require('../controllers/loans.controller');

router.get('/', controller.getAllLoans);
router.get('/overdue', controller.getOverdueLoans);
router.get('/export/ml', controller.exportForML);
router.get('/user/:user_id', controller.getLoansByUser);
router.get('/:id', controller.getLoanById);
router.post('/', controller.createLoan);
router.patch('/:id/return', controller.returnLoan);

module.exports = router; 
