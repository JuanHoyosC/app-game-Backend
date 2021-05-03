const controller = {};
const Curso = require('../models/class.model');


controller.addClass = async (req, res) => {
    try {
        //Leer los datos enviados desde el frontend
        let { curso, id } = req.body;

        if(curso.trim().length < 3){
            res.status(200).json({ mensaje: 'Nombre del curso muy corto', continuar: false }); return;
        }
        //Verifica que el correo no se encuentre ya tomado
        const cursoFind = await Curso.find({ nombre_clase: curso });
        if (cursoFind.length > 0) { res.status(200).json({ mensaje: 'El curso ya existe', continuar: false }); return; };

        const cursoNew = new Curso({ nombre_clase: curso, id_profesor: id });

        await cursoNew.save();

        res.status(200).json({ curso: cursoNew, continuar: true });
    } catch (error) {
        console.log(error)
        res.json({ mensaje: 'Hubo un error', continuar: false });
    }
}


controller.findClass = async (req, res) => {
    try {
        const curso = await Curso.findById(req.params.id);

        res.status(200).json({ curso, continuar: true });
    } catch (error) {
        res.json({ mensaje: 'Hubo un error', continuar: false });
    }
};

controller.findClassById = async (id) => {
    try {
        const curso = await Curso.findById(id);
        return curso;
    } catch (error) {
        return { mensaje: 'Hubo un error', continuar: false };
    }
}

controller.getClasses = async (req, res) => {
    try {
        const cursos = await Curso.find();
        res.status(200).json({ cursos, continuar: true });
    } catch (error) {
        res.json({ mensaje: 'Hubo un error', continuar: false });
    }
}


module.exports = controller;
