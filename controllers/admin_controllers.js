
const db = require("../config/db");
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');


const getAlladmin = (req, res) => {
    console.log('Entrando en getAlladmin');
    db.query('SELECT * FROM admin', (err, result) => {
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

const getAdmin = (req, res) => {
    db.query('SELECT * FROM admin WHERE id_admin = ?', [req.params.id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send(err);
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'el Admin no existente en la base de datos' });
        }

        res.json(result[0]);
    });
};

const createAdmin = (req, res) => {
    const { nombre, correo, contrasena, numero_telefonico, pregunta_seguridad } = req.body;

    // Encriptar la contraseña antes de almacenarla en la base de datos
    bcrypt.hash(contrasena, 10, (err, hash) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error al encriptar la contraseña' });
        }

        db.query('INSERT INTO admin(nombre, correo, contrasena, numero_telefonico, pregunta_seguridad) VALUES (?,?,?,?,?)', [nombre, correo, hash, numero_telefonico, pregunta_seguridad], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: err.message });
            }

            res.json({
                id: result.insertId,
                nombre,
                correo,
                numero_telefonico,
                pregunta_seguridad
            });
        });
    });
};



const updateAdmin = (req, res) => {
    const { nombre, correo, contrasena, numero_telefonico, pregunta_seguridad } = req.body;

    // Solo encriptar la contraseña si se proporciona en la solicitud
    if (contrasena) {
        bcrypt.hash(contrasena, 10, (err, hash) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Error al encriptar la contraseña' });
            }

            // Actualizar la base de datos con la contraseña encriptada
            db.query('UPDATE admin SET nombre=?, correo=?, contrasena=?, numero_telefonico=?, pregunta_seguridad=? WHERE id_admin=?',
                [nombre, correo, hash, numero_telefonico, pregunta_seguridad, req.params.id],
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
        db.query('UPDATE admin SET nombre=?, correo=?, numero_telefonico=?, pregunta_seguridad=? WHERE id_admin=?',
            [nombre, correo, numero_telefonico, pregunta_seguridad, req.params.id],
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


const deleteAdmin = (req, res) => {
    db.query('DELETE FROM admin WHERE id_admin = ?', [req.params.id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'el Admin no existente en la base de datos' });
        }

        res.sendStatus(204);
    });
};


const signup = (req, res) => {
    const { nombre, correo, contrasena, numero_telefonico, pregunta_seguridad } = req.body;

    db.query('SELECT * FROM admin WHERE correo = ?', [correo], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: err.message });
        }

        if (result.length > 0) {
            return res.status(409).json({ message: "El correo ya existe en la base de datos" });
        }

        // Encriptar la contraseña
        bcrypt.hash(contrasena, 10, (err, hash) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Error al encriptar la contraseña' });
            }

            // Utilizar el valor de pregunta_seguridad obtenido de la solicitud
            db.query('INSERT INTO admin(nombre=?, correo=?, contrasena=?, numero_telefonico=?, pregunta_seguridad=?) VALUES (?,?,?,?,?)',
                [nombre, correo, hash, numero_telefonico, pregunta_seguridad],
                (err, result) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ message: err.message });
                    }

                    // Crear y firmar el token JWT
                    const token = jwt.sign({ id: result.insertId, correo, nombre }, 'secreto', { expiresIn: '1h' });

                    res.json({
                        id: result.insertId,
                        nombre,
                        correo,
                        numero_telefonico,
                        pregunta_seguridad,
                        token,
                    });
                }
            );
        });
    });
}

const login = (req, res) => {
    const { correo, contrasena } = req.body;

    db.query('SELECT * FROM admin WHERE correo = ?', [correo], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: err.message });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: "El correo no existe en la base de datos" });
        }

        // Comparar contraseñas encriptadas
        bcrypt.compare(contrasena, result[0].contrasena, (errorComparar, comparar) => {
            if (errorComparar) {
                console.error(errorComparar);
                return res.status(500).json({ message: 'Error al comparar contraseñas' });
            }

            if (!comparar) {
                return res.status(401).json({ message: "Credenciales incorrectas" });
            }

            // Contraseña válida, crear y firmar el token JWT
            const token = jwt.sign({ id: result[0].id_admin, correo, nombre: result[0].nombre }, 'secreto', { expiresIn: '1h' });

            res.json({
                id: result[0].id_admin,
                nombre: result[0].nombre,
                correo,
                numero_telefonico: result[0].numero_telefonico,
                pregunta_seguridad: result[0].pregunta_seguridad,
                token,
            });
        });
    });
};

module.exports = {
    getAlladmin,
    getAdmin,
    createAdmin,
    updateAdmin,
    deleteAdmin,
    signup,
    login
}