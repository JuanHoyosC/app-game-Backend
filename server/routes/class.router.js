const express = require('express');
const router = express.Router();
const { rutasProtegidas } = require('./rutasProtegidas');
const controllerUser = require('../controllers/class.controller');

router.post('/addclass',  rutasProtegidas, controllerUser.addClass);
router.get('/getclass/:id', rutasProtegidas, controllerUser.findClass);


module.exports = router;
