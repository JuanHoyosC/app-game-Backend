const express = require('express');
const router = express.Router();
const webpush = require('../webpush');
const moment = require('moment');
moment.locale('es');
const controllerHabit = require('../controllers/habit.controller');
const controllerUser = require('../controllers/student.controller');

let counter = 1000;

const notificationes = async () => {
    const data = await controllerHabit.getHabitsAll();
    const date = moment();
    //Recorre cada habito
    data.forEach(habito => {
        //Verifica si la fecha de la notificacion es antes de la fecha actual
        if (date.isAfter(habito.proxima_notificacion)) {
            //Encuentra el estudiante con la notificación
            controllerUser.studentNotification(habito.id_usuario).then(estudiante => {
                //Verifica si el estudiante tiene un dispositio donde enviarle el mensaje
                if (estudiante.subscription === '') return;
                //Aumenta el tiempo de la notificación
                const aumento = changeHours(habito.aumento_notificacion);
                const proxima_notificacion = moment().add(aumento, 'hours');
                //Envia la notificación
                controllerHabit.updateDateNotification(habito._id, proxima_notificacion, aumento).then()
                enviarHabitoNotificacion(estudiante.subscription, 'Tienes un habito activo', `El habito ${habito.titulo} está disponible`).then();
            })
        }
    })

    clearInterval(interval);
    interval = setInterval(notificationes, counter);
}

let interval = setInterval(notificationes, counter);


const enviarHabitoNotificacion = async (body, titulo, mensaje) => {
    const payload = JSON.stringify({
        title: titulo,
        message: mensaje
    })

    await webpush.sendNotification(body, payload);
}


const changeHours = (aumento) => {

    if (aumento === 0) return 1;

    if (aumento === 1) return 8;

    if (aumento === 8) return 12;

    if (aumento === 12) return 24;

    if (aumento === 24) return 1;

}

module.exports = router