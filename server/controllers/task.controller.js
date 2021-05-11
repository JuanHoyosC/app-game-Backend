const moment = require('moment');
const fs = require("fs");

const Tarea = require('../models/task.model');
const { enviarNotificacionTarea } = require('../services/notification');
moment.locale('es');
const controller = {};

controller.addTask = async (req, res) => {
    try {

        //Verifica si la fecha final fue asignada despues o igual de la actual
        if (!moment().isBefore(req.body.fecha) && !(moment().diff(req.body.fecha, 'days') === 0)) {
            res.json({ mensaje: 'La fecha es antes de la actual', continuar: false });
            return;
        }

        //Crea una nueva tarea y la guarda en la base de datos
        const tarea = new Tarea({ ...req.body, fecha_fin: moment(req.body.fecha) });
        await tarea.save();

        //Envia la noticación a los estudiantes de que una nueva tarea ha sido asignada
        await enviarNotificacionTarea(req.body.id_curso);

        res.status(200).json({ mensaje: 'tarea agregada', continuar: true })

    } catch (error) {
        res.status(200).json({ mensaje: 'Hubo un error', continuar: false });
    }
}


controller.getTasks = async (req, res) => {
    try {

        //Obtiene todas las tareas que tenga el id del curso y las retorna al frontend
        const tareas = await Tarea.find({ id_curso: req.params.id });
        res.status(200).json({ tareas, continuar: true });
    } catch (error) {
        console.log(error);
        res.status(200).json({ mensaje: 'Hubo un error', continuar: false });
    }
}

controller.getTask = async (req, res) => {
    try {
        const tarea = await Tarea.findById(req.params.id);
        res.status(200).json({ tarea, continuar: true });
    } catch (error) {
        res.status(200).json({ mensaje: 'Hubo un error', continuar: false });
    }
}

controller.deleteTask = async (req, res) => {
    try {
        await Tarea.findByIdAndDelete({ _id: req.params.id });
        res.status(200).json({ mensaje: 'Tarea eliminada', continuar: false });
    } catch (error) {
        res.status(200).json({ mensaje: 'Hubo un error', continuar: false });
    }

}


controller.updateStudentTask = async (req, res) => {
    try {
        const tarea = await Tarea.findById({ _id: req.body.id_tarea });

        if (moment().isAfter(tarea.fecha_fin) && !moment(new Date()).isSame(tarea.fecha_fin, 'day', 'month')) {
            res.status(200).json({ mensaje: 'La misión ya finalizo', continuar: false });
            return;
        }

        tarea.estudiantes.push(req.body.estudiante)

        await Tarea.findByIdAndUpdate({ _id: req.body.id_tarea }, { ...tarea });

        res.status(200).json({ mensaje: 'Actualizado con exito', continuar: true });
    } catch (error) {
        res.status(200).json({ mensaje: 'Hubo un error', continuar: false });
    }

}


controller.getPathDownload = async (req, res) => {
    try {

        //Busca la tarea en la base de datos
        const tarea = await Tarea.findById({_id: req.body.id_tarea});

        //Obtiene el path del archivo
        const path = tarea.path_tarea;
   
        const data = fs.readFileSync(path);
        res.send(data);
    } catch (error) {
        res.status(200).json({ mensaje: 'Hubo un error', continuar: false });
    }
}

controller.getPathDownload2 = async (req, res) => {
    try {   
        const data = fs.readFileSync(req.body.path);
        res.send(data);
    } catch (error) {
        res.status(200).json({ mensaje: 'Hubo un error', continuar: false });
    }
}


controller.uploadTaskStudent = async (req, res) => {
    try {
        const { id_tarea, estudiante } = req.body;
        const tarea = await Tarea.findById({ _id: id_tarea });

        if (moment().isAfter(tarea.fecha_fin) && !moment(new Date()).isSame(tarea.fecha_fin, 'day', 'month')) {
            res.status(200).json({ mensaje: 'La misión ya finalizo', continuar: false });
            return;
        }

        const nuevosEstudiantes = tarea.estudiantes.map(e => e._id === estudiante._id ? estudiante : e);

        await Tarea.findByIdAndUpdate({ _id: id_tarea }, { estudiantes: nuevosEstudiantes })
        res.status(200).json({ mensaje: 'Estudiante actualizado', continuar: true });

    } catch (error) {
        res.status(200).json({ mensaje: 'Hubo un error', continuar: false });
    }
}


controller.uploadTaskStudentFinish = async (req, res) => {
    try {
        const { id_tarea, estudiante } = req.body;
        const tarea = await Tarea.findById({ _id: id_tarea });

        const find = tarea.estudiantes.find(e => e._id === estudiante._id);

        if(!find){
            tarea.estudiantes.push(req.body.estudiante);
            await Tarea.findByIdAndUpdate({ _id: req.body.id_tarea }, { ...tarea });
        }else{
            const nuevosEstudiantes = tarea.estudiantes.map(e => e._id === estudiante._id ? estudiante : e);
            await Tarea.findByIdAndUpdate({ _id: id_tarea }, { estudiantes: nuevosEstudiantes })
        }        

        
        res.status(200).json({ mensaje: 'Estudiante actualizado', continuar: true });

    } catch (error) {
        res.status(200).json({ mensaje: 'Hubo un error', continuar: false });
    }
}

module.exports = controller;
