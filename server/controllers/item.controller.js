const Item = require('../models/items.model');
const Estudiante = require('../models/student.model');

const controller = {};


controller.getItems = async (req, res) => {
    try {
        const items = await Item.find();
        res.status(200).json({ items, continuar: true });
    } catch (error) {
        res.status(200).json({ mensaje: 'Hubo un error', continuar: false });
    }
}

controller.comprarItem = async (req, res) => {
    try {
        const { _id, item, costo, cantidad, diamantes } = req.body;
        const estudiante = await Estudiante.findById(_id);

        if (!comprobarSaldo(estudiante, costo, diamantes)) {
            res.status(200).json({ mensaje: 'No tienes suficiente saldo', continuar: false, saldo: true });
            return;
        }

        if (item === "vida") {
            estudiante.vida += cantidad;
            if (estudiante.vida > (estudiante.nivel * 50)) {
                estudiante.vida_actual = estudiante.nivel * 50;
                estudiante.vida = estudiante.vida_actual;
            }
        } else {
            estudiante.experiencia += cantidad;
            while (estudiante.experiencia > (estudiante.nivel * 100)) {
                estudiante.experiencia = estudiante.experiencia - (estudiante.nivel * 100);
                estudiante.nivel += 1;
            }
        }

        if (diamantes) {
            estudiante.diamantes -= costo;
        } else {
            estudiante.saldo -= costo;
        }

        await Estudiante.findByIdAndUpdate(_id, { ...estudiante });


        //Retoma los datos actualizados del estudiantes
        const estudianteUpdate = await Estudiante.findById(_id);

        //Elimina la contraseña del objeto
        const { _doc } = { ...estudianteUpdate };
        delete _doc.password

        //eviar los datos
        res.status(200).json({ estudiante: _doc, continuar: true, mensaje: 'Se compro el item exitosamente' });

    } catch (error) {
        res.status(200).json({ mensaje: 'Hubo un error', continuar: false, saldo: false });
    }
}


const comprobarSaldo = (estudiante, costo, diamantes) => {

    if (diamantes) {
        if (estudiante.diamantes < costo) return false
    } else {
        if (estudiante.saldo < costo) return false;
    }

    return true;
}


module.exports = controller