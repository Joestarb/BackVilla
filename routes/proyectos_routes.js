const express = require('express');
const router = express.Router();
const proyectoControllers = require('../controllers/proyectos_controllers');

// Rutas para operaciones relacionadas con proyectos
router.post('/proyecto', proyectoControllers.createProyecto);
router.get('/proyecto/:proyecto_id', proyectoControllers.getProyectoById);
router.put('/proyecto/:proyecto_id', proyectoControllers.updateProyecto);
router.get('/proyecto', proyectoControllers.getAllProyectos);
router.delete('/proyecto/:proyecto_id', proyectoControllers.deleteProyecto);
router.get('/proyecto/:proyecto_id/equipos', proyectoControllers.getEquiposPorProyecto);
router.get('/proyecto/:proyecto_id/recurso',proyectoControllers.getRecusosPorProyecto )

module.exports = router;
