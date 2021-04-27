const express = require('express');
const router = express.Router();
const { rutasProtegidas } = require('./rutasProtegidas');
const controllerHabit = require('../controllers/habit.controller');

router.post('/addhabit', rutasProtegidas, controllerHabit.addHabit);
router.get('/gethabits/:usuario', rutasProtegidas, controllerHabit.getHabits);
router.get('/deletehabit/:id',rutasProtegidas, controllerHabit.deleteHabit);
router.get('/verifytime/:id',rutasProtegidas, controllerHabit.verifyTime);



module.exports = router;
