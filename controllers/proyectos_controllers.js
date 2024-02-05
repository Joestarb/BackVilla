const connection = require('../config/db');

const createProyecto = (req, res) => {
    const proyecto_create = req.body;

    try {
        const query = `
            INSERT INTO proyecto (nombre, descripcion, fecha_inicio, fk_equipo, fk_estado, fk_recurso)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const values = [
            proyecto_create.nombre,
            proyecto_create.descripcion,
            proyecto_create.fecha_inicio,
            proyecto_create.fk_equipo,
            proyecto_create.fk_estado,
            proyecto_create.fk_recurso,
        ];

        connection.query(query, values, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: err.message });
            }

            const proyecto_id = result.insertId;
            res.json({ id_proyecto: proyecto_id, ...proyecto_create });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const getProyectoById = (req, res) => {
    const proyecto_id = req.params.proyecto_id;

    try {
        const query = 'SELECT * FROM proyecto WHERE id_proyecto = ?';
        connection.query(query, [proyecto_id], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: err.message });
            }

            if (result.length === 0) {
                return res.status(404).json({ message: 'Proyecto not found' });
            }

            res.json(result[0]);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const updateProyecto = (req, res) => {
    const proyecto_id = req.params.proyecto_id;
    const proyecto_update = req.body;

    try {
        const query = `
            UPDATE proyecto
            SET nombre = ?, descripcion = ?, fecha_inicio = ?, fk_equipo = ?, fk_estado = ?, fk_recurso = ?
            WHERE id_proyecto = ?
        `;
        const values = [
            proyecto_update.nombre,
            proyecto_update.descripcion,
            proyecto_update.fecha_inicio,
            proyecto_update.fk_equipo,
            proyecto_update.fk_estado,
            proyecto_update.fk_recurso,
            proyecto_id,
        ];

        connection.query(query, values, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: err.message });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Proyecto not found' });
            }

            res.json({ message: 'Proyecto updated successfully', ...proyecto_update });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const getAllProyectos = (req, res) => {
    try {
        const query = 'SELECT * FROM proyecto';
        connection.query(query, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: err.message });
            }

            res.json(result);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const deleteProyecto = (req, res) => {
    const proyecto_id = req.params.proyecto_id;

    try {
        const query = 'DELETE FROM proyecto WHERE id_proyecto = ?';
        connection.query(query, [proyecto_id], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: err.message });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Proyecto not found' });
            }

            res.json({ message: 'Proyecto deleted successfully' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createProyecto,
    getProyectoById,
    updateProyecto,
    getAllProyectos,
    deleteProyecto,
};
