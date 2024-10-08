const Ruta = require('../models/route');
const Log = require('../models/log');

// Agregar ruta
exports.agregarRuta = async (req, res) => {
    try {
        const { destino, precio } = req.body;
        const rutaExistente = await Ruta.findOne({ where: { destino } });

        if (rutaExistente) {
            await Log.create({
                accion: 'Agregar Ruta',
                detalle: `Intento fallido de agregar la ruta con destino a ${destino}. La ruta ya existe.`,
                fecha: new Date()
            });
            return res.status(400).json({ error: 'Ya existe una ruta con ese destino' });
        }

        const nuevaRuta = await Ruta.create({ destino, precio });
        await Log.create({
            accion: 'Agregar Ruta',
            detalle: `Se agregó una ruta con destino a ${destino} y precio ${precio}.`,
            fecha: new Date()
        });
        res.status(201).json(nuevaRuta);
    } catch (error) {
        await Log.create({
            accion: 'Agregar Ruta',
            detalle: `Error al agregar ruta: ${error.message}`,
            fecha: new Date()
        });
        res.status(500).json({ error: error.message });
    }
};

// Obtener rutas
exports.obtenerRutas = async (req, res) => {
    try {
        const rutas = await Ruta.findAll();
        res.json(rutas);
    } catch (error) {
        await Log.create({ accion: 'Obtener Rutas', detalle: error.message, fecha: new Date(), usuario: 'usuarioEjemplo' });
        res.status(500).json({ error: error.message });
    }
};

// Actualizar ruta por ID
exports.actualizarRuta = async (req, res) => {
    try {
        const { id } = req.params;
        const { precio } = req.body;
        const ruta = await Ruta.findByPk(id);

        if (!ruta) {
            await Log.create({
                accion: 'Actualizar Ruta',
                detalle: `Ruta con ID ${id} no encontrada`,
                fecha: new Date()
            });
            return res.status(404).json({ error: 'Ruta no encontrada' });
        }
        const destino = ruta.destino;

        ruta.precio = precio || ruta.precio;
        await ruta.save();

        await Log.create({
            accion: 'Actualizar Ruta',
            detalle: `Se actualizó la ruta con destino a ${destino}. Nuevo precio: ${ruta.precio}.`,
            fecha: new Date()
        });

        res.status(200).json(ruta);
    } catch (error) {
        await Log.create({
            accion: 'Actualizar Ruta',
            detalle: `Error al actualizar ruta con ID ${id}: ${error.message}`,
            fecha: new Date()
        });
        res.status(500).json({ error: error.message });
    }
};

// Eliminar ruta
exports.eliminarRuta = async (req, res) => {
    try {
        const { id } = req.params;
        await Ruta.destroy({ where: { id } });
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
