const debug = require('debug')('app:inicio');
//const dbDebug = require('debug')('app:db');
const express = require('express');
const config = require('config');
//const logger = require('./logger')
const morgan = require('morgan');
const Joi = require('joi');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extends: true }));
app.use(express.static('public'));

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

const usuarios = [
    { id: 1, nombre: 'Fabio' },
    { id: 2, nombre: 'Juan' },
    { id: 3, nombre: 'Ana' }
];

app.get('/', (req, res) => {
    res.send('Hola Mundo desde Express');
});

app.get('/api/usuarios', (req, res) => {
    res.send(usuarios);
});

app.get('/api/usuarios/:id', (req, res) => {
    let usuario = existeUsuario(req.params.id);
    if (!usuario) res.status(404).send('El usuario no fue encontrado');
    res.send(usuario);
});


app.post('/api/usuarios', (req, res) => {

    /* let body = req.body;
    console.log(body.nombre);
    res.json({
        body
    }) */
    const schema = Joi.object({
        nombre: Joi.string().min(3).required()
    });
    const { error, value } = validarUsuario(req.body.nombre);

    if (!error) {
        const usuario = {
            id: usuarios.length + 1,
            nombre: value.nombre
        };
        usuarios.push(usuario);
        res.send(usuario);
    } else {
        const mensaje = error.details[0].message;
        res.status(400).send(mensaje);
    }
});

app.put('/api/usuarios/:id', (req, res) => {
    //Encontrar si existe el objeto usuario
    let usuario = existeUsuario(req.params.id);
    if (!usuario) {
        res.status(400).send('El usuario no fue encontrado');
        return;
    }

    const { error, value } = validarUsuario(req.body.nombre);

    if (error) {
        const mensaje = error.details[0].message;
        res.status(400).send(mensaje);
        return;
    }

    usuario.nombre = value.nombre;
    res.send(usuario);
});

app.delete('/api/usuarios/:id', (req, res) => {
    let usuario = existeUsuario(req.params.id);
    if (!usuario) {
        res.status(400).send('El usuario no fue encontrado');
        return;
    }

    const index = usuarios.indexOf(usuario);
    usuarios.splice(index, 1);

    res.send(usuario);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor en el puerto ${port}`);
});


//Metodos de validacion
/**
 * If the user exists, return the user, otherwise return false.
 * @param id - The id of the user to be deleted
 * @returns the user object that matches the id.
 */
function existeUsuario(id) {
    return (usuarios.find(u => u.id === parseInt(id)));
}

/**
 * It validates the name of the user, which must be a string of at least 3 characters.
 * @param nom - the name of the user to validate
 * @returns The return is a promise.
 */
function validarUsuario(nom) {
    const schema = Joi.object({
        nombre: Joi.string().min(3).required()
    });
    return (schema.validate({ nombre: nom }))
}