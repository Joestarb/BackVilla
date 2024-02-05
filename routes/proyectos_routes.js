const express = require('express');
const router = express.Router();
const proyectoControllers = require('../controllers/proyectos_controllers');

router.post('/', proyectoControllers.createProyecto);
router.get('/:proyecto_id', proyectoControllers.getProyectoById);
router.put('/:proyecto_id', proyectoControllers.updateProyecto);
router.get('/', proyectoControllers.getAllProyectos);
router.delete('/:proyecto_id', proyectoControllers.deleteProyecto);

module.exports = router;
