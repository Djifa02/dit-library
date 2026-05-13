const service = require('../services/users.service');

const getAllUsers = async (req, res) => {
  try {
    const users = await service.getAllUsers();
    res.json({ success: true, data: users, count: users.length });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await service.getUserById(req.params.id);
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

const getUsersByType = async (req, res) => {
  try {
    const users = await service.getUsersByType(req.params.type.toUpperCase());
    res.json({ success: true, data: users, count: users.length });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

const createUser = async (req, res) => {
  try {
    const user = await service.createUser(req.body);
    res.status(201).json({ success: true, data: user, message: 'Utilisateur créé avec succès' });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await service.updateUser(req.params.id, req.body);
    res.json({ success: true, data: user, message: 'Utilisateur mis à jour avec succès' });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    await service.deleteUser(req.params.id);
    res.json({ success: true, message: 'Utilisateur supprimé avec succès' });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

const deactivateUser = async (req, res) => {
  try {
    const user = await service.deactivateUser(req.params.id);
    res.json({ success: true, data: user, message: 'Utilisateur désactivé avec succès' });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

module.exports = { getAllUsers, getUserById, getUsersByType, createUser, updateUser, deleteUser, deactivateUser };
