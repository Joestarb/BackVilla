const express = require('express');
const router = express.Router();
const recursoControllers = require('../controllers/recursos_controllers');

// Crear un nuevo recurso
router.post('/recurso', recursoControllers.createRecurso);

// Obtener todos los recursos
router.get('/recurso', recursoControllers.getAllRecursos);

// Obtener un recurso por ID
router.get('/recurso/:recurso_id', recursoControllers.getRecursoById);

// Actualizar un recurso por ID
router.put('/recurso/:recurso_id', recursoControllers.updateRecurso);

// Eliminar un recurso por ID
router.delete('/recurso/:recurso_id', recursoControllers.deleteRecurso);

module.exports = router;
