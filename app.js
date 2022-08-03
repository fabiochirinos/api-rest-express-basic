const debug = require('debug')('app:inicio');
//const dbDebug = require('debug')('app:db');
const express = require('express');
const usuarios = require('./routes/usuarios')
const config = require('config');
//const logger = require('./logger')
const morgan = require('morgan');
const app = express();

//MIDDLEWARES
app.use(express.json()); //body
app.use(express.urlencoded({ extends: true }));
app.use(express.static('public'));
app.use('/api/usuarios', usuarios);

//Configuración de entornos
console.log('Aplicación: ' + config.get('nombre'));
console.log('BD server:' + config.get('configDB.host'));


//USO DE UN MIDDLEWARE DE TERCEROS - MORGAN
if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
    //(console.log('Morgan habilitado');
    debug('Morgan está habilitado');
}

//Trabajos con la base de datos
debug('Conectando con la BD...');

//app.use(logger);

/* app.use(function (req, res, next) {
    console.log('Autenticando...');
    next();
}) */



app.get('/', (req, res) => {
    res.send('Hola Mundo desde Express');
});



const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor en el puerto ${port}`);
});


