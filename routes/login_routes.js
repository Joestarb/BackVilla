const express = require('express');
const router = express.Router();
const loginControllers = require('../controllers/usuario_controllers')

// Rutas para operaciones CRUD en miembros

// Obtener todos los miembros
router.get('/users', loginControllers.getUsers);

// Obtener un miembro por ID
router.get("/users/:id", loginControllers.getUser);

// Crear un nuevo miembro
router.post("/users", loginControllers.createUser);

// Actualizar un miembro por ID
router.put("/users/:id", loginControllers.updateUser);

// Eliminar un miembro por ID
router.delete("/users/:id", loginControllers.deleteUser);

// Rutas adicionales para autenticación

// Registro de un nuevo miembro
router.post('/signup', loginControllers.signup);

// Inicio de sesión
router.post('/login', loginControllers.login);

module.exports = router;

