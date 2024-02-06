
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

const createAdmin = async (req, res) => {
    try {
        const { nombre, correo_electronico, contrasena, numero_telefonico, pregunta_seguridad } = req.body;
        console.log('Valores recibidos:', nombre, correo_electronico, contrasena, numero_telefonico, pregunta_seguridad);

        // Encriptar la contraseña antes de almacenarla en la base de datos
        const hashedPassword = await bcrypt.hash(contrasena, 10);

        db.query(
            'INSERT INTO admin(nombre, correo_electronico, contrasena, numero_telefonico, pregunta_seguridad) VALUES (?,?,?,?,?)',
            [nombre, correo_electronico, hashedPassword, numero_telefonico, pregunta_seguridad],
            (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: err.message });
                }

                res.json({
                    id: result.insertId,
                    nombre,
                    correo_electronico,
                    numero_telefonico,
                    pregunta_seguridad
                });
            }
        );
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al encriptar la contraseña' });
    }
};




const updateAdmin = async (req, res) => {
    try {
        const { nombre, correo_electronico, contrasena, numero_telefonico, pregunta_seguridad } = req.body;

        // Verificar si se proporciona una nueva contraseña
        if (contrasena) {
            // Encriptar la nueva contraseña
            const hashedPassword = await bcrypt.hash(contrasena, 10);

            // Actualizar la base de datos con la nueva contraseña encriptada
            db.query(
                'UPDATE admin SET nombre=?, correo_electronico=?, contrasena=?, numero_telefonico=?, pregunta_seguridad=? WHERE id_admin=?',
                [nombre, correo_electronico, hashedPassword, numero_telefonico, pregunta_seguridad, req.params.id],
                (err, result) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ message: 'Error al actualizar el administrador' });
                    }
                    // Devolver una respuesta informativa
                    res.json({ message: 'Administrador actualizado exitosamente' });
                }
            );
        } else {
            // Si no se proporciona una nueva contraseña, actualizar la base de datos sin modificar la contraseña
            db.query(
                'UPDATE admin SET nombre=?, correo_electronico=?, numero_telefonico=?, pregunta_seguridad=? WHERE id_admin=?',
                [nombre, correo_electronico, numero_telefonico, pregunta_seguridad, req.params.id],
                (err, result) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ message: 'Error al actualizar el administrador' });
                    }
                    // Devolver una respuesta informativa
                    res.json({ message: 'Administrador actualizado exitosamente' });
                }
            );
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al encriptar la contraseña' });
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
    const { nombre, correo_electronico, contrasena, numero_telefonico, pregunta_seguridad } = req.body;

    db.query('SELECT * FROM admin WHERE correo_electronico = ?', [correo_electronico], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: err.message });
        }

        if (result.length > 0) {
            return res.status(409).json({ message: "El correo_electronico ya existe en la base de datos" });
        }

        // Encriptar la contraseña
        bcrypt.hash(contrasena, 10, (err, hash) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Error al encriptar la contraseña' });
            }

            // Utilizar el valor de pregunta_seguridad obtenido de la solicitud
            db.query('INSERT INTO admin(nombre=?, correo_electronico=?, contrasena=?, numero_telefonico=?, pregunta_seguridad=?) VALUES (?,?,?,?,?)',
                [nombre, correo_electronico, hash, numero_telefonico, pregunta_seguridad],
                (err, result) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ message: err.message });
                    }

                    // Crear y firmar el token JWT
                    const token = jwt.sign({ id: result.insertId, correo_electronico, nombre }, 'secreto', { expiresIn: '1h' });

                    res.json({
                        id: result.insertId,
                        nombre,
                        correo_electronico,
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
    const { correo_electronico, contrasena } = req.body;

    db.query('SELECT * FROM admin WHERE correo_electronico = ?', [correo_electronico], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: err.message });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: "El correo_electronico no existe en la base de datos" });
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
            const token = jwt.sign({ id: result[0].id_admin, correo_electronico, nombre: result[0].nombre }, 'secreto', { expiresIn: '1h' });

            res.json({
                id: result[0].id_admin,
                nombre: result[0].nombre,
                correo_electronico,
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