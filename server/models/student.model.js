const {Schema, model} = require('mongoose');

const studentSchema = new Schema({
    correo: { type: String, required: true },
    password: { type: String, required: true },
    username: { type: String, required: true, trim: true },
    nombre: { type: String, required: true, trim: true },
    foto: {type: String, required: true, trim: true},
    apellidos: { type: String, required: true, trim: true },
    nivel: { type: Number, required: true, default: 1 },
    saldo: { type: Number, required: true, default: 0 },
    diamantes: { type: Number, required: true, default: 0 },
    experiencia: { type: Number, required: true, default: 0 },
    vida: { type: Number, required: true, default: 50 },
    vida_actual: { type: Number, required: true, default: 50 },
    id_clase: { type: String, required: false },
    subscription: {type: Object, required: false, default: '' }
});


module.exports = model('students', studentSchema);
