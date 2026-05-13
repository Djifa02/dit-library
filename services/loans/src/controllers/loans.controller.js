const service = require('../services/loans.service');

const getAllLoans = async (req, res) => {
  try {
    const loans = await service.getAllLoans();
    res.json({ success: true, data: loans, count: loans.length });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

const getLoanById = async (req, res) => {
  try {
    const loan = await service.getLoanById(req.params.id);
    res.json({ success: true, data: loan });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

const getLoansByUser = async (req, res) => {
  try {
    const loans = await service.getLoansByUser(req.params.user_id);
    res.json({ success: true, data: loans, count: loans.length });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

const getOverdueLoans = async (req, res) => {
  try {
    const loans = await service.getOverdueLoans();
    res.json({ success: true, data: loans, count: loans.length });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

const createLoan = async (req, res) => {
  try {
    const loan = await service.createLoan(req.body);
    res.status(201).json({ success: true, data: loan, message: 'Emprunt cree avec succes' });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

const returnLoan = async (req, res) => {
  try {
    const loan = await service.returnLoan(req.params.id, req.body.rating);
    res.json({ success: true, data: loan, message: 'Livre retourne avec succes' });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

const exportForML = async (req, res) => {
  try {
    const data = await service.exportForML();
    res.json({ success: true, data, count: data.length });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

module.exports = { getAllLoans, getLoanById, getLoansByUser, getOverdueLoans, createLoan, returnLoan, exportForML }; 
