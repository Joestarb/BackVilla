const express = require('express');
const router = express.Router();
const equipoControllers = require('../controllers/equipoControllers');

// Crear un nuevo equipo
router.post('/equipo', equipoControllers.createEquipo);

// Obtener todos los equipos
router.get('/equipo', equipoControllers.getAllEquipos);

// Obtener un equipo por ID
router.get('/equipo/:equipo_id', equipoControllers.getEquipoById);

// Actualizar un equipo por ID
router.put('/equipo/:equipo_id', equipoControllers.updateEquipo);

// Eliminar un equipo por ID
router.delete('/equipo/:equipo_id', equipoControllers.deleteEquipo);

router.get('/equiposData', equipoControllers.getEquiposData);

module.exports = router;
