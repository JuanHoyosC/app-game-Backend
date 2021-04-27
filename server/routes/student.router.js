const express = require('express');
const router = express.Router();
const { rutasProtegidas } = require('./rutasProtegidas');
const controllerUser = require('../controllers/student.controller');

router.post('/register', controllerUser.addStudent);
router.post('/login', controllerUser.findStudent);
router.post('/upattribute', rutasProtegidas, controllerUser.upAttribute);
router.post('/downattribute', rutasProtegidas, controllerUser.downAttribute);
router.post('/loginsubscription', controllerUser.updateSubscription);
router.post('/add-class-student', controllerUser.addClass);
router.get('/getuser/:id', rutasProtegidas, controllerUser.findStudentById);
router.get('/get-students-class/:id', rutasProtegidas, controllerUser.getStudentsByClass);


module.exports = router;
