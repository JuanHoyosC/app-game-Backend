const express = require('express');
const router = express.Router();

const controller = require('../controllers/item.controller');
const { rutasProtegidas } = require('./rutasProtegidas');

router.get('/items',rutasProtegidas, controller.getItems);

router.post('/comprar-item',rutasProtegidas, controller.comprarItem);


module.exports = router