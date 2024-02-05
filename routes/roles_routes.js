const express = require('express');
const router = express.Router();
const rolControllers = require('../controllers/roles_controllers');

// Crear un nuevo rol
router.post('/rol', rolControllers.createRol);

// Obtener todos los roles
router.get('/rol', rolControllers.getAllRoles);

// Obtener un rol por ID
router.get('/rol/:rol_id', rolControllers.getRolById);

// Actualizar un rol por ID
router.put('/rol/:rol_id', rolControllers.updateRol);

// Eliminar un rol por ID
router.delete('/rol/:rol_id', rolControllers.deleteRol);

module.exports = router;
