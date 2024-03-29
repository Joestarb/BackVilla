const db = require('../config/db'); 

const createTarea = async (req, res) => {
  const { nombre, descripcion, fecha_inicio, fecha_fin, fk_proyecto, fk_rol } = req.body;

  try {
    const result = await db.query(
      'INSERT INTO tarea (nombre, descripcion, fecha_inicio, fecha_fin, fk_proyecto, fk_rol) VALUES (?, ?, ?, ?, ?, ?)',
      [nombre, descripcion, fecha_inicio, fecha_fin, fk_proyecto, fk_rol]
    );

    const id_tarea = result.insertId;
    return res.status(201).json({ id_tarea, nombre, descripcion, fecha_inicio, fecha_fin, fk_proyecto, fk_rol });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al crear la tarea' });
  }
};

const getAllTareasFromUser = (req, res) => {
  const id = req.params.id
  const query = "SELECT * FROM tarea_view WHERE usuario_id = ?";

  db.query(query,id, (error, result) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    return res.status(200).json(result); // Return the result in the response
  });
};

const getAllTareas = (req, res) => {
  const query = "SELECT * FROM tarea";

  db.query(query, (error, result) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    return res.status(200).json(result); // Return the result in the response
  });
};


const getTarea = async (req, res) => {
  const { id } = req.params;

  try {
    const tarea = await db.query('SELECT * FROM tarea WHERE id_tarea = ?', [id]);

    if (tarea.length === 0) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    return res.status(200).json(tarea[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al obtener la tarea' });
  }
};


const updateTarea = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, fecha_inicio, fecha_fin, fk_proyecto, fk_rol } = req.body;

  try {
    const tarea = await db.query(
      'UPDATE tarea SET nombre = ?, descripcion = ?, fecha_inicio = ?, fecha_fin = ?, fk_proyecto = ?, fk_rol = ? WHERE id_tarea = ?',
      [nombre, descripcion, fecha_inicio, fecha_fin, fk_proyecto, fk_rol, id]
    );

    if (tarea.affectedRows === 0) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    return res.status(200).json({ id_tarea: parseInt(id), nombre, descripcion, fecha_inicio, fecha_fin, fk_proyecto, fk_rol });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al actualizar la tarea' });
  }
};



const deleteTarea = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query('DELETE FROM tarea WHERE id_tarea = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    return res.status(204).send(); // No Content
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al eliminar la tarea' });
  }
};

module.exports = { 
    createTarea, 
    getAllTareas,
    getAllTareasFromUser,
    getTarea,
    updateTarea,
    deleteTarea };

