const express = require('express');
const router = express.Router();
const adminControllers = require('../controllers/admin_controllers'); // Cambié AdminConntrollers a adminControllers

// Rutas para operaciones CRUD en miembros

// Obtener todos los miembros
router.get('/admins', (req, res) => {
    console.log('Llamada a /admins');
    adminControllers.getAlladmin(req, res);
  });
// Obtener un miembro por ID
router.get("/admins/:id", adminControllers.getAdmin);
// Crear un nuevo miembro
router.post("/admins", adminControllers.createAdmin);
// Actualizar un miembro por ID
router.put("/admins/:id", adminControllers.updateAdmin);
// Eliminar un miembro por ID
router.delete("/admins/:id", adminControllers.deleteAdmin);
// Registro de un nuevo miembro
router.post('/signup/admin', adminControllers.signup);
// Inicio de sesión
router.post('/login/admin', adminControllers.login);

module.exports = router;
