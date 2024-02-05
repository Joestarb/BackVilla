const express = require('express');
const router = express.Router();
const loginControllers = require('../controllers/miembro_controllers')

// Rutas para operaciones CRUD en miembros

// Obtener todos los miembros
router.get('/members', loginControllers.getUsers);

// Obtener un miembro por ID
router.get("/members/:id", loginControllers.getUser);

// Crear un nuevo miembro
router.post("/members", loginControllers.createUser);

// Actualizar un miembro por ID
router.put("/members/:id", loginControllers.updateUser);

// Eliminar un miembro por ID
router.delete("/members/:id", loginControllers.deleteUser);

// Rutas adicionales para autenticación

// Registro de un nuevo miembro
router.post('/signup', loginControllers.signup);

// Inicio de sesión
router.post('/login', loginControllers.login);

module.exports = router;

