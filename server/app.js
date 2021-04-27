require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');

//Settings
app.set('port', 4000 || process.env.PORT);

//Middlewares
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));


//Routes
app.use(require('./routes/student.router'));
app.use(require('./routes/habit.router'));
app.use(require('./routes/teacher.router'));
app.use(require('./routes/class.router'));
app.use(require('./routes/notification.router'));
app.use(require('./routes/task.router'));

//Database
require('./database');

//Starting the server
app.listen(app.get('port'), () => {
  console.log(`app corriendo en el puerto ${app.get('port')}`);
})