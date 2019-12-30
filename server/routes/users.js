const { Router } = require('express');
const router = Router();
const usersController = require('../Controllers/users.controller');

router.get('/', usersController.getAllUsers);
router.post('/login', usersController.login);
router.post('/', usersController.createNewUser);
router.get('/:id', usersController.getUserById);
router.put('/:id', usersController.updateUserById);
router.delete('/:id', usersController.deleteUserById);

module.exports = router;