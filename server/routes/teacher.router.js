const express = require('express');
const router = express.Router();
const { rutasProtegidas } = require('./rutasProtegidas');
const controllerUser = require('../controllers/teacher.controller');

router.post('/register-teacher', controllerUser.addTeacher);
router.post('/login-teacher', controllerUser.findTeacher);
router.post('/loginsubscription-teacher', controllerUser.updateSubscription);
router.get('/getprofesor/:id', rutasProtegidas, controllerUser.findTeacherById);
router.post('/update-teacher-class', rutasProtegidas, controllerUser.updateTeacherClass);
router.post('/update-name-class', rutasProtegidas, controllerUser.updateNameClass);


module.exports = router;
