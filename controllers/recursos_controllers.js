const connection = require('../config/db'); // Ajusta la ruta según tu estructura;

const createRecurso = (req, res) => {
    const recursoCreate = req.body;

    const query = "INSERT INTO recurso (tipo_recurso, nombre, funcionalidad, fk_proyecto) VALUES (?, ?, ?, ?)";
    const values = [recursoCreate.tipo_recurso, recursoCreate.nombre, recursoCreate.funcionalidad, recursoCreate.fk_proyecto];

    connection.query(query, values, (error, result) => {
        if (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
            return;
        }

        const recursoId = result.insertId;
        const createdRecurso = { id_recurso: recursoId, ...recursoCreate };

        res.json(createdRecurso);
    });
};

const getAllRecursos = (req, res) => {
    const query = "SELECT * FROM recurso";

    connection.query(query, (error, result) => {
        if (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
            return;
        }

        if (result.length > 0) {
            res.json(result);
        } else {
            res.status(404).json({ message: 'No recursos found' });
        }
    });
};

const getRecursoById = (req, res) => {
    const recursoId = req.params.recurso_id;
    const query = "SELECT * FROM recurso WHERE id_recurso = ?";

    connection.query(query, [recursoId], (error, result) => {
        if (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
            return;
        }

        if (result.length > 0) {
            res.json(result[0]);
        } else {
            res.status(404).json({ message: 'Recurso not found' });
        }
    });
};

const updateRecurso = (req, res) => {
    const recursoId = req.params.recurso_id;
    const recursoUpdate = req.body;

    const updateFields = Object.entries(recursoUpdate).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null) {
            acc[key] = value;
        }
        return acc;
    }, {});
    

    if (Object.keys(updateFields).length === 0) {
        res.status(400).json({ message: 'No fields to update' });
        return;
    }

    const setClause = Object.keys(updateFields).map(field => `${field} = ?`).join(', ');
    const query = `UPDATE recurso SET ${setClause} WHERE id_recurso = ?`;

    const values = [...Object.values(updateFields), recursoId];

    connection.query(query, values, (error, result) => {
        if (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
            return;
        }

        if (result.affectedRows > 0) {
            res.json({ message: 'Recurso updated successfully', ...recursoUpdate });
        } else {
            res.status(404).json({ message: 'Recurso not found' });
        }
    });
};

const deleteRecurso = (req, res) => {
    const recursoId = req.params.recurso_id;

    const query = "DELETE FROM recurso WHERE id_recurso = ?";
    connection.query(query, [recursoId], (error, result) => {
        if (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
            return;
        }

        if (result.affectedRows > 0) {
            res.json({ message: 'Recurso deleted successfully' });
        } else {
            res.status(404).json({ message: 'Recurso not found' });
        }
    });
};

const getContadorRecursos = (req, res) => {
    const proyecto_id = req.params.proyecto_id;

    try {
        const query = 'SELECT COUNT(*) AS contador_recursos FROM recurso WHERE fk_proyecto = ?';

        connection.query(query, [proyecto_id], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: err.message });
            }

            if (result.length === 0) {
                return res.status(404).json({ message: 'Proyecto not found' });
            }

            const contadorRecursos = result[0].contador_recursos;
            res.json({ contadorRecursos });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createRecurso,
    getAllRecursos,
    getRecursoById,
    updateRecurso,
    deleteRecurso,
    getContadorRecursos
};
