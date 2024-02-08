const express = require('express');
const router = express.Router();
const tareasControllers = require('../controllers/tareas_controllers');

// Crear un nuevo rol
router.post('/tarea', tareasControllers.createTarea);

// Obtener todos los roles
router.get('/tarea', tareasControllers.getAllTareas);

// Obtener un rol por ID
router.get('/tarea/:id_tarea', tareasControllers.getTarea);

// Actualizar un rol por ID
router.put('/tarea/:id_tarea', tareasControllers.updateTarea);

// Eliminar un rol por ID
router.delete('/tarea/:id_tarea', tareasControllers.deleteTarea);

module.exports = router;
