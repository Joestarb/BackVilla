const connection = require('../config/db');

const createEstado = (req, res) => {
    const estadoCreate = req.body;

    try {
        const query = "INSERT INTO estado (nombre) VALUES (?)";
        const values = [estadoCreate.nombre];

        connection.execute(query, values, (error, result) => {
            if (error) {
                console.error(error);
                res.status(500).json({ message: 'Internal Server Error' });
                return;
            }

            const estadoId = result.insertId;
            res.json({ "id_estado": estadoId, ...estadoCreate });
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getAllEstados = (req, res) => {
    try {
        const query = "SELECT * FROM estado";

        connection.query(query, (error, result) => {
            if (error) {
                console.error(error);
                res.status(500).json({ message: 'Internal Server Error' });
                return;
            }

            if (result.length > 0) {
                res.json(result);
            } else {
                res.status(404).json({ message: 'No estados found' });
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getEstadoById = (req, res) => {
    const estadoId = req.params.estado_id;

    try {
        const query = "SELECT * FROM estado WHERE id_estado = ?";

        connection.query(query, [estadoId], (error, result) => {
            if (error) {
                console.error(error);
                res.status(500).json({ message: 'Internal Server Error' });
                return;
            }

            if (result.length > 0) {
                res.json(result[0]);
            } else {
                res.status(404).json({ message: 'Estado not found' });
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const updateEstado = (req, res) => {
    const estadoId = req.params.estado_id;
    const estadoUpdate = req.body;

    try {
        const query = "UPDATE estado SET nombre = ? WHERE id_estado = ?";
        const values = [estadoUpdate.nombre, estadoId];

        connection.execute(query, values, (error, result) => {
            if (error) {
                console.error(error);
                res.status(500).json({ message: 'Internal Server Error' });
                return;
            }

            if (result.affectedRows > 0) {
                res.json({ message: 'Estado updated successfully', ...estadoUpdate });
            } else {
                res.status(404).json({ message: 'Estado not found' });
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const deleteEstado = (req, res) => {
    const estadoId = req.params.estado_id;

    try {
        const query = "DELETE FROM estado WHERE id_estado = ?";
        connection.execute(query, [estadoId], (error, result) => {
            if (error) {
                console.error(error);
                res.status(500).json({ message: 'Internal Server Error' });
                return;
            }

            if (result.affectedRows > 0) {
                res.json({ message: 'Estado deleted successfully' });
            } else {
                res.status(404).json({ message: 'Estado not found' });
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    createEstado,
    getAllEstados,
    getEstadoById,
    updateEstado,
    deleteEstado
};
