
const db = require("../config/db");
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');


const getUsers = (req, res) => {
    db.query(`SELECT * FROM miembro`, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send(err);
        } else {
            if (result.length > 0) {
                res.status(200).json(result);
            } else {
                res.status(400).send('Datos no existentes');
            }
        }
    });
};

const getUser = (req, res) => {
    db.query('SELECT * FROM miembro WHERE id_miembro = ?', [req.params.id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send(err);
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'Usuario no existente en la base de datos' });
        }

        res.json(result[0]);
    });
};

const createUser = (req, res) => {
    const { nombre, correo_electronico, contrasena, fk_rol, fk_equipo } = req.body;

    // Encriptar la contraseña antes de almacenarla en la base de datos
    bcrypt.hash(contrasena, 10, (err, hash) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error al encriptar la contraseña' });
        }

        db.query('INSERT INTO miembro(nombre, correo_electronico, contrasena, fk_rol, fk_equipo) VALUES (?,?,?,?,?)', [nombre, correo_electronico, hash, fk_rol, fk_equipo], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: err.message });
            }

            res.json({
                id: result.insertId,
                nombre,
                correo_electronico,
                fk_rol,
                fk_equipo
            });
        });
    });
};



const updateUser = (req, res) => {
    const { nombre, correo_electronico, contrasena, fk_rol, fk_equipo } = req.body;

    // Solo encriptar la contraseña si se proporciona en la solicitud
    if (contrasena) {
        bcrypt.hash(contrasena, 10, (err, hash) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Error al encriptar la contraseña' });
            }

            // Actualizar la base de datos con la contraseña encriptada
            db.query('UPDATE miembro SET nombre=?, correo_electronico=?, contrasena=?, fk_rol=?, fk_equipo=? WHERE id_miembro=?',
                [nombre, correo_electronico, hash, fk_rol, fk_equipo, req.params.id],
                (err, result) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ message: err.message });
                    }
                    res.json(result);
                }
            );
        });
    } else {
        // Si no se proporciona una nueva contraseña, actualizar la base de datos sin modificar la contraseña
        db.query('UPDATE miembro SET nombre=?, correo_electronico=?, fk_rol=?, fk_equipo=? WHERE id_miembro=?',
            [nombre, correo_electronico, fk_rol, fk_equipo, req.params.id],
            (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: err.message });
                }
                res.json(result);
            }
        );
    }
};


const deleteUser = (req, res) => {
    db.query('DELETE FROM miembro WHERE id_miembro = ?', [req.params.id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no existente en la base de datos' });
        }

        res.sendStatus(204);
    });
};


const signup = (req, res) => {
    const { nombre, correo_electronico, contrasena, fk_rol, fk_equipo } = req.body;

    db.query('SELECT * FROM miembro WHERE correo_electronico = ?', [correo_electronico], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: err.message });
        }

        if (result.length > 0) {
            return res.status(409).json({ message: "El correo_electronico ya existe en la base de datos" });
        }

        bcrypt.hash(contrasena, 10, (err, hash) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Error al encriptar la contraseña' });
            }

            db.query('INSERT INTO miembro(nombre=?, correo_electronico=?, contrasena=?, fk_rol=?, fk_equipo=?) VALUES (?,?,?,?,?)',
                [nombre, correo_electronico, hash, fk_rol, fk_equipo],
                (err, result) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ message: err.message });
                    }

                    const token = jwt.sign({ id: result.insertId, correo_electronico, nombre, fk_rol, fk_equipo }, 'secreto', { expiresIn: '1h' });

                    res.json({
                        id: result.insertId,
                        nombre,
                        correo_electronico,
                        fk_rol,
                        fk_equipo,
                        token,
                    });
                }
            );
        });
    });
};

const login = (req, res) => {
    const { correo_electronico, contrasena } = req.body;

    db.query('SELECT * FROM miembro WHERE correo_electronico = ?', [correo_electronico], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: err.message });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: "El correo_electronico no existe en la base de datos" });
        }

        bcrypt.compare(contrasena, result[0].contrasena, (errorComparar, comparar) => {
            if (errorComparar) {
                console.error(errorComparar);
                return res.status(500).json({ message: 'Error al comparar contraseñas' });
            }

            if (!comparar) {
                return res.status(401).json({ message: "Credenciales incorrectas" });
            }

            const token = jwt.sign({ id: result[0].id_miembro, correo_electronico, nombre: result[0].nombre, fk_rol: result[0].fk_rol, fk_equipo: result[0].fk_equipo }, 'secreto', { expiresIn: '1h' });

            res.json({
                id: result[0].id_miembro,
                nombre: result[0].nombre,
                correo_electronico,
                fk_rol: result[0].fk_rol,
                fk_equipo: result[0].fk_equipo,
                token,
            });
        });
    });
};

module.exports = {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    signup,
    login
};