const {Schema, model} = require('mongoose');

const teacherSchema = new Schema({
    correo: { type: String, required: true },
    password: { type: String, required: true },
    nombre: { type: String, required: true, trim: true },
    apellidos: { type: String, required: true, trim: true },
    curso: { type: String, required: false, dafault: '' },
    curso_id: { type: String, required: false, default: '' },
    subscription: {type: Object, required: false, default: '' }
});


module.exports = model('teachers', teacherSchema);