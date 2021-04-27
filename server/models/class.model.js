const {Schema, model} = require('mongoose');

const classSchema = new Schema({
    nombre_clase: { type: String, required: true, trim: true },
    id_profesor: { type: String, required: true, trim: true }
});


module.exports = model('class', classSchema);
