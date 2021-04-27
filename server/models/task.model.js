const {Schema, model} = require('mongoose');
const moment = require('moment');  
moment.locale('es'); 

const taskSchema = new Schema({
    titulo: {type: String, required: true, trim: true},
    comentario: {type: String, required: true, trim: true},
    puntaje:  {type: String, required: true, trim: true},
    fecha_inicio: { type: Object, required: true, default: moment() },
    fecha_fin: {type: String, required: true, trim: true},
    id_curso: { type: String, required: true },
    path_tarea: { type: String, required: false },
    nombre_archivo: { type: String, required: false },
    estudiantes: { type: Array, required: false, default: [] }
});


module.exports = model('tasks', taskSchema);
