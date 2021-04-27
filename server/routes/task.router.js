const express = require('express');
const multer = require('multer');
const router = express.Router();
const { rutasProtegidas } = require('./rutasProtegidas');
const controller = require('../controllers/task.controller');

//Configura donde se guardaran los archivos y con que nombre
const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, './uploads') },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + file.originalname)
    }
})

// Se iniicializa multer
const upload = multer({ storage });


//Se encarga de subir los archivos en el servidor
router.post('/upload-task-file', upload.any(), async (req, res) => {
    try {
        //Envia al front la ruta y el nombre de los archivos subidos
        res.json({nombre_archivo: req.files[0].originalname, path_tarea: req.files[0].path});

    } catch (error) {
        console.log(error)
        res.status(404).json({ mensaje: 'Hubo un error', continuar: false });
    }
})

router.post('/add-task', rutasProtegidas, controller.addTask);
router.post('/add-student-task', rutasProtegidas, controller.updateStudentTask);
router.post('/upload-task-student', rutasProtegidas, controller.uploadTaskStudent);
router.post('/upload-task-student-finish', rutasProtegidas, controller.uploadTaskStudentFinish);
router.get('/get-tasks/:id', rutasProtegidas, controller.getTasks);
router.get('/delete-task/:id', rutasProtegidas, controller.deleteTask);
router.get('/get-task/:id', rutasProtegidas, controller.getTask);
router.post('/task-download', rutasProtegidas, controller.getPathDownload);


module.exports = router;
