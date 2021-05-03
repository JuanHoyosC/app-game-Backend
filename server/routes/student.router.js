const express = require('express');
const multer = require('multer');
const router = express.Router();
const { rutasProtegidas } = require('./rutasProtegidas');
const controllerUser = require('../controllers/student.controller');



//Configura donde se guardaran los archivos y con que nombre
const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, './uploads/perfiles') },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + file.originalname)
    }
})

// Se iniicializa multer
const upload = multer({ storage });


//Se encarga de subir los archivos en el servidor
router.post('/upload-picture', upload.any(), async (req, res) => {
    try {
        //Envia al front la ruta y el nombre de los archivos subidos
        res.json({path_foto: req.files[0].path});

    } catch (error) {
        console.log(error)
        res.status(404).json({ mensaje: 'Hubo un error', continuar: false });
    }
})


router.post('/register', controllerUser.addStudent);
router.post('/login', controllerUser.findStudent);
router.post('/upattribute', rutasProtegidas, controllerUser.upAttribute);
router.post('/downattribute', rutasProtegidas, controllerUser.downAttribute);
router.post('/loginsubscription', controllerUser.updateSubscription);
router.post('/add-class-student', controllerUser.addClass);
router.get('/getuser/:id', rutasProtegidas, controllerUser.findStudentById);
router.post('/getPicture', rutasProtegidas, controllerUser.getPicture);
router.get('/get-students-class/:id', rutasProtegidas, controllerUser.getStudentsByClass);


module.exports = router;
