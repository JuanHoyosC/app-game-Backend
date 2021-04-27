const express = require('express');
const jwt = require('jsonwebtoken');
//Protección de rutas
const rutasProtegidas = express.Router();

rutasProtegidas.use((req, res, next) => {
    const token = req.headers['access-token'];
    if (token) {
        jwt.verify(token, 'top_secret', (err, decoded) => {
            if (err) {
                return res.status(200).json({ mensaje: 'Token inválido', continuar: false });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        res.status(200).json({ mensaje: 'Token no enviado', continuar: false });
    }
});


module.exports =  { rutasProtegidas }