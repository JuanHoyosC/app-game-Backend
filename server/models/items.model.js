const {Schema, model} = require('mongoose');

const itemSchema = new Schema({
    item: { type: String, required: true },
    cantidad: { type: Number, required: true },
    costo: { type: Number, required: true, trim: true },
    imagen: { type: String, required: true, trim: true },
    diamantes: { type: Boolean, required: false },

});


module.exports = model('items', itemSchema);
