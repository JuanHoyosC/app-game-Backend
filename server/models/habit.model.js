const {Schema, model} = require('mongoose');
const moment = require('moment');  
moment.locale('es'); 

const habitSchema = new Schema({
    titulo: { type: String, required: true },
    descripcion: { type: String, required: true },
    dificultad: { type: String, required: true, trim: true },
    proxima_fecha: { type: Object, required: true, trim: true },
    proxima_notificacion: { type: Object, required: true, trim: true },
    aumento_notificacion: { type: Number, required: false, default: 0 },
    fecha: { type: Object, required: true, default: moment() },
    frecuencia: { type: String, required: true, trim: true },
    id_usuario: { type: String, required: true }
});


module.exports = model('habits', habitSchema);
