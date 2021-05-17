const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require("fs");
const cloudinary = require('cloudinary');
const controller = {};

cloudinary.config({
    cloud_name: 'taskventure',
    api_key: '161252159937296',
    api_secret: 'YDyKn5pcseaEUSu5gFnl_Z6Zteo'
})

const Estudiante = require('../models/student.model');
const clases = require('./class.controller');
const { getDificultad } = require('../services/getNum');
const { upAttribute, downAttribute } = require('../services/attribute');

controller.addStudent = async (req, res) => {
    try {
        //Leer los datos enviados desde el frontend
        let { username, password, nombre, apellidos, correo, foto } = req.body;

        //Verifica que el correo no se encuentre ya tomado
        const correoFind = await Estudiante.find({ correo });
        if (correoFind.length > 0) { res.status(200).json({ mensaje: 'El correo ya existe', continuar: false }); return; };

        //Verifica que el usuario no se encuentre ya tomado
        const usernameFind = await Estudiante.find({ correo });
        if (usernameFind.length > 0) { res.status(200).json({ mensaje: 'El usuario ya existe', continuar: false }); return; };

        //Encripta la contraseña para ser guardada en la base de datos
        password = await bcrypt.hash(password, 10);

        //Crea el model estudiante

        const { url } = await cloudinary.v2.uploader.upload(foto);
        foto = url;
        console.log(url)
 
        const estudiante = new Estudiante({ username, password, nombre, apellidos, correo, foto });

        await estudiante.save();

        res.status(200).json({ mensaje: 'Usuario guardado con exito', continuar: true });
    } catch (error) {
        console.log(error)
        res.json({ mensaje: 'Hubo un error', continuar: false });
    }
}

controller.studentNotification = async (_id) => {
    return await Estudiante.findById(_id);
}

controller.updateSubscription = async (req, res) => {
    try {
        const { _id, subscription } = req.body;
        await Estudiante.findByIdAndUpdate(_id, { subscription })
    } catch (error) {
        res.json({ mensaje: 'Hubo un error', continuar: false });
    }
}

controller.findStudent = async (req, res) => {
    try {
        const { correo, password } = req.body;

        const estudiante = await Estudiante.findOne({ correo: correo });
        if (!estudiante) { res.status(200).json({ mensaje: 'El correo no existe', continuar: false }); return; };
        const compare = await bcrypt.compare(password, estudiante.password);
        if (!compare) { res.status(200).json({ mensaje: 'La contraseña no es correcta', continuar: false }); return; };

        const { _doc } = { ...estudiante };
        delete _doc.password
        //Crea un token apartir del correo y el id, el token vence en 1h
        const token = jwt.sign({ token: _doc }, 'top_secret');
        res.status(200).json({ token, continuar: true });
    } catch (error) {
        res.json({ mensaje: 'Hubo un error', continuar: false });
    }
};

controller.upAttribute = async (req, res) => {
    try {
        const { _id, dificultad } = req.body;
        const estudiante = await Estudiante.findById(_id);

        //Se encarga de subir el nivel de estudiante y actualizarlo en la base de datos
        upAttribute(getDificultad(dificultad), estudiante);
        await Estudiante.findByIdAndUpdate(_id, estudiante);

        //Toma la información actualizada y la retorna al front
        await Estudiante.findById(_id);
        const estudianteUpdate = await Estudiante.findById(_id);

        //Esto se encarga de eliminar la contraseña del objeto
        const { _doc } = { ...estudianteUpdate };
        delete _doc.password

        //Envia los datos
        res.status(200).json({ estudiante: _doc, continuar: true });
    } catch (error) {
        console.log(error)
        res.status(200).json({ mensaje: 'Hubo un error', continuar: false });
    }
}

controller.downAttribute = async (req, res) => {
    try {
        const { _id, dificultad } = req.body;

        //Se encarga de disminui los atributos y actualizarlo en la base de datos
        const estudiante = await Estudiante.findById(_id);
        downAttribute(getDificultad(dificultad), estudiante);
        await Estudiante.findByIdAndUpdate({ _id }, estudiante);

        //Retoma los datos actualizados del estudiantes
        const estudianteUpdate = await Estudiante.findById(_id);

        //Elimina la contraseña del objeto
        const { _doc } = { ...estudianteUpdate };
        delete _doc.password

        //eviar los datos
        res.status(200).json({ estudiante: _doc, continuar: true });
    } catch (error) {
        res.status(200).json({ mensaje: 'Hubo un error', continuar: false });
    }
}

controller.findStudentById = async (req, res) => {
    try {
        const estudiante = await Estudiante.findById(req.params.id);
        const { _doc } = { ...estudiante };
        delete _doc.password
        res.status(200).json({ estudiante: _doc, continuar: true });
    } catch (error) {
        console.log(error)
        res.status(200).json({ mensaje: 'Hubo un error', continuar: false });
    }
}

controller.getPicture = async (req, res) => {
    try {
        const data = fs.readFileSync(req.body.path);
        res.send(data);
    } catch (error) {
        console.log('error', error)
        res.status(200).json({ mensaje: 'Hubo un error', continuar: false });
    }
}


controller.addClass = async (req, res) => {
    try {

        const { id_clase, _id } = req.body;

        //Verifica si existe una clase

        const clase = await clases.findClassById(id_clase);
   
        if (!clase._id) {
            res.status(200).json({ mensaje: 'No existe la sala', continuar: false });
            return;
        }
        console.log(clase)
        //Actualiza el curso si se encuentra una clase
        await Estudiante.findByIdAndUpdate(_id, { id_clase });
        const estudiante = await Estudiante.findById(_id);
        const { _doc } = { ...estudiante };
        delete _doc.password

        res.status(200).json({ estudiante: _doc, mensaje: 'Te uniste a una sala con exito', continuar: true });

    } catch (error) {
        console.log(error)
        res.status(200).json({ mensaje: 'Hubo un error', continuar: false });
    }
}

controller.getStudentsByClass = async (req, res) => {
    try {

        //Busca los estudiantes por clase
        const estudiantes = await Estudiante.find({id_clase: req.params.id});

        const estudiantesC =  estudiantes.map(estudiante => {
            const { _doc } = { ...estudiante };
            delete _doc.password
            return _doc
        })

        res.status(200).json({ estudiantes: estudiantesC.slice(0, 10), continuar: true });

    } catch (error) {
        console.log(error)
        res.status(200).json({ mensaje: 'Hubo un error', continuar: false });
    }
}

controller.getStudentsByIdClass = async (id_clase) => {
    try {

        //Busca los estudiantes por clase
        const estudiantes = await Estudiante.find({id_clase});

        const estudiantesC =  estudiantes.map(estudiante => {
            const { _doc } = { ...estudiante };
            delete _doc.password
            return _doc
        })

        return estudiantesC

    } catch (error) {
        return []
    }
}


module.exports = controller;
