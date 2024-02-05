const express = require('express');
const router = express.Router();
const loginControllers = require('../controllers/admin_controllers')

// Rutas para operaciones CRUD en miembros

// Obtener todos los miembros
router.get('/admins', loginControllers.getAdmins);

// Obtener un miembro por ID
router.get("/admins/:id", loginControllers.getAdmin);

// Crear un nuevo miembro
router.post("/admins", loginControllers.createAdmin);

// Actualizar un miembro por ID
router.put("/admins/:id", loginControllers.updateAdmin);

// Eliminar un miembro por ID
router.delete("/admins/:id", loginControllers.deleteAdmin);

// Rutas adicionales para autenticación

// Registro de un nuevo miembro
router.post('/signup/admin', loginControllers.signup);

// Inicio de sesión
router.post('/login/admin', loginControllers.login);

module.exports = router;

