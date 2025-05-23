import express from 'express';
import Mensaje from '../models/Mensaje.js';

const router = express.Router();

// GET /api/mensajes - Obtener todos los mensajes
router.get('/', async (req, res) => {
  try {
    const mensajes = await Mensaje.find().sort({ fecha: -1 });
    res.json(mensajes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los mensajes' });
  }
});

// POST /api/mensajes - Crear un nuevo mensaje
router.post('/', async (req, res) => {
  const { nombre, mensaje } = req.body;
  if (!nombre || !mensaje) {
    return res.status(400).json({ error: 'Nombre y mensaje son requeridos' });
  }
  try {
    const nuevoMensaje = new Mensaje({ nombre, mensaje });
    await nuevoMensaje.save();
    res.status(201).json(nuevoMensaje);
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar el mensaje' });
  }
});

// (Opcional) DELETE /api/mensajes/:id - Eliminar un mensaje por ID
router.delete('/:id', async (req, res) => {
  try {
    await Mensaje.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Mensaje eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el mensaje' });
  }
});

// PUT /api/mensajes/:id - Editar un mensaje por ID
router.put('/:id', async (req, res) => {
  try {
    const { mensaje } = req.body;
    const actualizado = await Mensaje.findByIdAndUpdate(
      req.params.id,
      { mensaje },
      { new: true }
    );
    res.json(actualizado);
  } catch (error) {
    res.status(500).json({ error: 'Error al editar el mensaje' });
  }
});

export default router;