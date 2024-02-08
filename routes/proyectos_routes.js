const express = require('express');
const router = express.Router();
const proyectoControllers = require('../controllers/proyectos_controllers');

router.post('/proyecto', proyectoControllers.createProyecto);
router.get('/proyecto/:proyecto_id', proyectoControllers.getProyectoById);
router.put('/proyecto/:proyecto_id', proyectoControllers.updateProyecto);
router.get('/proyecto', proyectoControllers.getAllProyectos);
router.delete('/proyecto/:proyecto_id', proyectoControllers.deleteProyecto);

module.exports = router;
