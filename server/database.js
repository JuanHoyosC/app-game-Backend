const moongoose = require('mongoose');

moongoose.connect('mongodb+srv://appGame:j3106060631@cluster0.05tac.mongodb.net/appGame?retryWrites=true&w=majority', {
    useNewUrlParser:true,
    useUnifiedTopology: true,
    useFindAndModify: false 
})
    .then(db => console.log('Base de datos conectada'))
    .catch(err => console.log(err))