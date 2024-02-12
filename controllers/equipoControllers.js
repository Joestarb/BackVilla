const connection = require('../config/db'); // Ajusta la ruta según tu estructura;

const createEquipo = (req, res) => {
    const equipoCreate = req.body;

    const query = "INSERT INTO equipo (nombre, fk_proyecto) VALUES (?, ?)";
    const values = [equipoCreate.nombre, equipoCreate.fk_proyecto]; // Agregar fk_proyecto al array de valores

    connection.query(query, values, (error, result) => {
        if (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
            return;
        }

        const equipoId = result.insertId;
        const createdEquipo = { id_equipo: equipoId, ...equipoCreate };

        res.json(createdEquipo);
    });
};


const getAllEquipos = (req, res) => {
    const query = "SELECT * FROM equipo";

    connection.query(query, (error, result) => {
        if (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
            return;
        }

        if (result.length > 0) {
            res.json(result);
        } else {
            res.status(404).json({ message: 'No equipos found' });
        }
    });
};

const getEquipoById = (req, res) => {
    const equipoId = req.params.equipo_id;
    const query = "SELECT * FROM equipo WHERE id_equipo = ?";

    connection.query(query, [equipoId], (error, result) => {
        if (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
            return;
        }

        if (result.length > 0) {
            res.json(result[0]);
        } else {
            res.status(404).json({ message: 'Equipo not found' });
        }
    });
};

const updateEquipo = (req, res) => {
    const equipoId = parseInt(req.params.equipo_id);
    if (isNaN(equipoId)) {
        res.status(400).json({ message: 'Invalid equipo ID' });
        return;
    }

    const equipoUpdate = req.body;
    if (Object.keys(equipoUpdate).length === 0) {
        res.status(400).json({ message: 'No fields to update' });
        return;
    }

    const validFields = ['nombre', 'fk_proyecto'];
    for (const key in equipoUpdate) {
        if (!validFields.includes(key)) {
            res.status(400).json({ message: `Invalid field: ${key}` });
            return;
        }
    }

    const updateFields = {};
    validFields.forEach(field => {
        if (equipoUpdate[field] !== undefined) {
            updateFields[field] = equipoUpdate[field];
        }
    });

    const setClause = Object.keys(updateFields).map(field => `${field} = ?`).join(', ');
    const query = `UPDATE equipo SET ${setClause} WHERE id_equipo = ?`;
    const values = [...Object.values(updateFields), equipoId];

    connection.query(query, values, (error, result) => {
        if (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
            return;
        }

        if (result.affectedRows > 0) {
            res.json({ message: 'Equipo updated successfully', ...equipoUpdate });
        } else {
            res.status(404).json({ message: 'Equipo not found' });
        }
    });
};


const deleteEquipo = (req, res) => {
    const equipoId = req.params.equipo_id;

    // Desvincular miembros asociados al equipo
    const updateMiembrosQuery = "UPDATE usuario SET fk_equipo = NULL WHERE fk_equipo = ?";
    connection.query(updateMiembrosQuery, [equipoId], (error) => {
        if (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
            return;
        }

        // Eliminar el equipo
        const deleteEquipoQuery = "DELETE FROM equipo WHERE id_equipo = ?";
        connection.query(deleteEquipoQuery, [equipoId], (error, result) => {
            if (error) {
                console.error(error);
                res.status(500).json({ message: 'Internal Server Error' });
                return;
            }

            if (result.affectedRows > 0) {
                res.json({ message: 'Equipo disassociated from miembros and deleted successfully' });
            } else {
                res.status(404).json({ message: 'Equipo not found' });
            }
        });
    });
};



const getEquiposData = (req, res) => {
    connection.query('SELECT * FROM equipoData', (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: err.message });
        }

        if (result.length > 0) {
            res.status(200).json({result:result});
        } else {
            res.status(404).json({ message: 'No se encontraron datos de equipos' });
        }
    });
};

module.exports = {
    createEquipo,
    getEquiposData,
    getAllEquipos,
    getEquipoById,
    updateEquipo,
    deleteEquipo
};