const connection = require('../config/db'); // Ajusta la ruta según tu estructura;

const createRol = (req, res) => {
    const rolCreate = req.body;

    const query = "INSERT INTO rol (nombre) VALUES (?)";
    const values = [rolCreate.nombre];

    connection.execute(query, values, (error, result) => {
        if (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
            return;
        }

        const rolId = result.insertId;
        const createdRol = { id_rol: rolId, ...rolCreate };

        res.json(createdRol);
    });
};

const getAllRoles = (req, res) => {
    const query = "SELECT * FROM rol";

    connection.query(query, (error, result) => {
        if (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
            return;
        }

        if (result.length > 0) {
            res.json(result);
        } else {
            res.status(404).json({ message: 'No roles found' });
        }
    });
};

const getRolById = (req, res) => {
    const rolId = req.params.rol_id;
    const query = "SELECT * FROM rol WHERE id_rol = ?";

    connection.query(query, [rolId], (error, result) => {
        if (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
            return;
        }

        if (result.length > 0) {
            res.json(result[0]);
        } else {
            res.status(404).json({ message: 'Rol not found' });
        }
    });
};

const updateRol = (req, res) => {
    const rolId = req.params.rol_id;
    const rolUpdate = req.body;

    const updateFields = Object.entries(rolUpdate).reduce((acc, [key, value]) => {
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
    const query = `UPDATE rol SET ${setClause} WHERE id_rol = ?`;

    const values = [...Object.values(updateFields), rolId];

    connection.execute(query, values, (error, result) => {
        if (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
            return;
        }

        if (result.affectedRows > 0) {
            res.json({ message: 'Rol updated successfully', ...rolUpdate });
        } else {
            res.status(404).json({ message: 'Rol not found' });
        }
    });
};

const deleteRol = (req, res) => {
    const rolId = req.params.rol_id;

    const query = "DELETE FROM rol WHERE id_rol = ?";
    connection.execute(query, [rolId], (error, result) => {
        if (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
            return;
        }

        if (result.affectedRows > 0) {
            res.json({ message: 'Rol deleted successfully' });
        } else {
            res.status(404).json({ message: 'Rol not found' });
        }
    });
};

module.exports = {
    createRol,
    getAllRoles,
    getRolById,
    updateRol,
    deleteRol
};
