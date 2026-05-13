const express = require('express');
const router = express.Router();
const controller = require('../controllers/users.controller');

router.get('/', controller.getAllUsers);
router.get('/type/:type', controller.getUsersByType);
router.get('/:id', controller.getUserById);
router.post('/', controller.createUser);
router.put('/:id', controller.updateUser);
router.delete('/:id', controller.deleteUser);
router.patch('/:id/deactivate', controller.deactivateUser);

module.exports = router; 
