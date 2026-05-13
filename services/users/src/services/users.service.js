const repo = require('../repositories/users.repository');

const getAllUsers = async () => await repo.findAll();

const getUserById = async (id) => {
  const user = await repo.findById(id);
  if (!user) throw { status: 404, message: `Utilisateur avec l'id ${id} introuvable` };
  return user;
};

const getUsersByType = async (type) => {
  const types = ['STUDENT', 'PROFESSOR', 'STAFF'];
  if (!types.includes(type)) throw { status: 400, message: 'Type invalide. Valeurs: STUDENT, PROFESSOR, STAFF' };
  return await repo.findByType(type);
};

const createUser = async (data) => {
  const { first_name, last_name, email, user_type } = data;
  if (!first_name || !last_name || !email) {
    throw { status: 400, message: 'Prénom, nom et email sont obligatoires' };
  }
  const existing = await repo.findByEmail(email);
  if (existing) throw { status: 409, message: `Un utilisateur avec l'email ${email} existe déjà` };
  return await repo.create(data);
};

const updateUser = async (id, data) => {
  const existing = await repo.findById(id);
  if (!existing) throw { status: 404, message: `Utilisateur avec l'id ${id} introuvable` };
  return await repo.update(id, { ...existing, ...data });
};

const deleteUser = async (id) => {
  const existing = await repo.findById(id);
  if (!existing) throw { status: 404, message: `Utilisateur avec l'id ${id} introuvable` };
  return await repo.remove(id);
};

const deactivateUser = async (id) => {
  const existing = await repo.findById(id);
  if (!existing) throw { status: 404, message: `Utilisateur avec l'id ${id} introuvable` };
  return await repo.deactivate(id);
};

module.exports = { getAllUsers, getUserById, getUsersByType, createUser, updateUser, deleteUser, deactivateUser }; 
