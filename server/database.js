const moongoose = require('mongoose');

moongoose.connect('mongodb://localhost/appGame', {
    useNewUrlParser:true,
    useUnifiedTopology: true,
    useFindAndModify: false 
})
    .then(db => console.log('Base de datos conectada'))
    .catch(err => console.log(err))