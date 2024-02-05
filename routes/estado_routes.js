const express = require('express');
const router = express.Router();
const estadoController = require('../controllers/estado_controllers');

// Endpoint para crear un nuevo estado
router.post("/estado", estadoController.createEstado);

// Endpoint para obtener todos los estados
router.get("/estado", estadoController.getAllEstados);

// Endpoint para obtener un estado por ID
router.get("/estado/:estado_id", estadoController.getEstadoById);

// Endpoint para actualizar un estado por ID
router.put("/estado/:estado_id", estadoController.updateEstado);

// Endpoint para eliminar un estado por ID
router.delete("/estado/:estado_id", estadoController.deleteEstado);

module.exports = router;
