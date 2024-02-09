const connection = require('../config/db'); // Ajusta la ruta según tu estructura;

const createEquipo = (req, res) => {
    const equipoCreate = req.body;

    const query = "INSERT INTO equipo (nombre) VALUES (?)";
    const values = [equipoCreate.nombre];

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
    const equipoId = req.params.equipo_id;
    const equipoUpdate = req.body;

    const updateFields = Object.entries(equipoUpdate).reduce((acc, [key, value]) => {
        if (value !== undefined) {
            acc[key] = value;
        }
        return acc;
    }, {});

    if (Object.keys(updateFields).length === 0) {
        res.status(400).json({ message: 'No fields to update' });
        return;
    }

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

        // Eliminar proyectos asociados al equipo
        const updateProyectosQuery = "UPDATE proyecto SET fk_equipo = NULL WHERE fk_equipo = ?";
        connection.query(updateProyectosQuery, [equipoId], (error) => {
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
                    res.json({ message: 'Equipo disassociated from miembros, proyectos, and deleted successfully' });
                } else {
                    res.status(404).json({ message: 'Equipo not found' });
                }
            });
        });
    });
};

module.exports = {
    createEquipo,
    getAllEquipos,
    getEquipoById,
    updateEquipo,
    deleteEquipo
};