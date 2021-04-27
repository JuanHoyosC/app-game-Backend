const webpush = require('../webpush');
const Estudiante = require('../controllers/student.controller');

const enviarNotificacionTarea = async (id_curso) => {
    const estudiantes = await Estudiante.getStudentsByIdClass(id_curso);

    //Recorre todos los estudiantes que esten subscrito al curso y les envia la tarea
    estudiantes.forEach(estudiante => {
        if (estudiante.subscription === '') return;
        enviarNotificacion(estudiante.subscription, 'Nueva misión', 'Tu profesor ha creado una nueva misión');
    });
}

const enviarNotificacion = async (body, titulo, mensaje) => {
    const payload = JSON.stringify({
        title: titulo,
        message: mensaje
    })

    await webpush.sendNotification(body, payload);
}

module.exports = { enviarNotificacionTarea }