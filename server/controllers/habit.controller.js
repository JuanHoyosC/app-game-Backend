const Habit = require('../models/habit.model');
const moment = require('moment');
const controller = {};
const { getFrecuency } = require('../services/getNum');

controller.addHabit = async (req, res) => {
    try {
        const { frecuencia } = req.body;
        const proxima_fecha = moment().add('days', getFrecuency(frecuencia));
        delete req.body.frecuencia;
        const habito = new Habit({ ...req.body, proxima_fecha, frecuencia, proxima_notificacion: proxima_fecha });
        const newHabito = await habito.save();
        res.status(200).json({ mensaje: 'Habito creado', continuar: true, habito: newHabito });
    } catch (error) {
        console.log(error)
        res.status(200).json({ mensaje: 'Hubo un error', continuar: false });
    }
}

controller.editHabit = async (req, res) => {
    try {
        const { frecuencia, _id } = req.body;
        const proxima_fecha = moment().add('days', getFrecuency(frecuencia));
        delete req.body.frecuencia;
        
        await Habit.findByIdAndUpdate(_id, { ...req.body, proxima_fecha, frecuencia, proxima_notificacion: proxima_fecha });
        const newHabito = await Habit.findById(_id);

        res.status(200).json({ mensaje: 'Habito actualizado', continuar: true, habito: newHabito });
    } catch (error) {
        console.log(error)
        res.status(200).json({ mensaje: 'Hubo un error', continuar: false });
    }
}

controller.getHabitsAll = async () => {
    try {
        return await Habit.find();
    } catch (error) {
        return [];
    }
}

controller.deleteHabit = async (req, res) => {
    try {
        await Habit.findByIdAndRemove(req.params.id)
        res.status(200).json({ mensaje: 'Se borro el habito', continuar: true });
    } catch (error) {
        res.status(200).json({ mensaje: 'Hubo un error', continuar: false });
    }
}

controller.getHabits = async (req, res) => {
    try {
        const habitos = await Habit.find({ id_usuario: req.params.usuario });
        res.status(200).json({ habitos, continuar: true });

    } catch (error) {
        res.status(200).json({ mensaje: 'Hubo un error', continuar: false });
    }
}

controller.verifyTime = async (req, res) => {
    try {
        const habito = await Habit.findById(req.params.id);
        const fecha = moment();
        if (fecha.isAfter( habito.proxima_fecha )) {
            const proxima_fecha = moment().add(getFrecuency(habito.frecuencia), 'days');
            await controller.updateDateHabit( habito._id, proxima_fecha )
            res.status(200).json({ continuar: true });
        } else {
            res.status(200).json({
                mensaje: `Debes cumplir el habito despues de: ${moment(habito.proxima_fecha).format('MMMM Do YYYY, h:mm:ss a')}`,
                continuar: false
            });
        }
    } catch (e) {
        res.status(200).json({ mensaje: 'Hubo un error', continuar: false });
    }
}

controller.updateDateHabit = async (_id, proxima_fecha) => {
    try {
        await Habit.findByIdAndUpdate(_id, { proxima_fecha, proxima_notificacion: proxima_fecha, aumento_notificacion: 0 });
    } catch (error) {
        console.log(error)
    }
}

controller.updateDateNotification = async (_id, proxima_notificacion, aumento_notificacion) => {
    try {
        await Habit.findByIdAndUpdate(_id, { proxima_notificacion, aumento_notificacion });
    } catch (error) {
        console.log(error)
    }
}


module.exports = controller