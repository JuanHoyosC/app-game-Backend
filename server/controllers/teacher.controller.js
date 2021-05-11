const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const controller = {};
const Profesor = require('../models/teacher.model');


controller.addTeacher = async (req, res) => {
    try {
        //Leer los datos enviados desde el frontend
        let { password, nombre, apellidos, correo, foto } = req.body;

        //Verifica que el correo no se encuentre ya tomado
        const correoFind = await Profesor.find({ correo });
        if (correoFind.length > 0) { res.status(200).json({ mensaje: 'El correo ya existe', continuar: false }); return; };

        //Encripta la contraseña para ser guardada en la base de datos
        password = await bcrypt.hash(password, 10);
        
        console.log(foto)

        //Crea el model estudiante
        const profesor = new Profesor({ password, nombre, apellidos, correo, foto });

        await profesor.save();

        res.status(200).json({ mensaje: 'Usuario guardado con exito', continuar: true });
    } catch (error) {
        console.log(error)
        res.json({ mensaje: 'Hubo un error', continuar: false });
    }
}

controller.updateSubscription = async (req, res) => {
    try {
        const {_id, subscription} = req.body;
        await Profesor.findByIdAndUpdate(_id, { subscription })
    } catch (error) {
        res.json({ mensaje: 'Hubo un error', continuar: false });
    }
}

controller.findTeacher = async (req, res) => {
    try {
        const { correo, password } = req.body;

        const profesor = await Profesor.findOne({ correo: correo });
        if (!profesor) { res.status(200).json({ mensaje: 'El correo no existe', continuar: false }); return; };
        const compare = await bcrypt.compare(password, profesor.password);
        if (!compare) { res.status(200).json({ mensaje: 'La contraseña no es correcta', continuar: false }); return; };

        const { _doc } = { ...profesor };
        delete _doc.password
        //Crea un token apartir del correo y el id, el token vence en 1h
        const token = jwt.sign({ token: _doc }, 'top_secret');
        res.status(200).json({ token, continuar: true });
    } catch (error) {
        res.json({ mensaje: 'Hubo un error', continuar: false });
    }
};

controller.findTeacherById = async (req, res) => {
    try {
        const profesor = await Profesor.findById(req.params.id);
        const { _doc } = { ...profesor };
        delete _doc.password
        res.status(200).json({ profesor: _doc, continuar: true });
    } catch (error) {
        res.status(200).json({ mensaje: 'Hubo un error', continuar: false });
    }

}
controller.updateTeacherClass = async (req, res) => {
    try {
        const { nombre_clase, id_profesor, _id  } = req.body;
        await Profesor.findByIdAndUpdate(id_profesor, { curso: nombre_clase, curso_id: _id });
        const profesor = await Profesor.findById(id_profesor);
        const { _doc } = { ...profesor };
        delete _doc.password
        res.status(200).json({ profesor: _doc, continuar: true });
    } catch (error) {
        res.status(200).json({ mensaje: 'Hubo un error', continuar: false });
    }

}

controller.updateNameClass = async (req, res) => {
    try {
        const { curso, _id  } = req.body;
        await Profesor.findByIdAndUpdate(_id, { curso });
        res.status(200).json({mensaje:'Nombre actualizado con exito', continuar: true});
    } catch (error) {
        res.status(200).json({mensaje:'Hubo un error', continuar: false});
    }
}

module.exports = controller;
