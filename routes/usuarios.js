const express = require('express');
const Joi = require('joi');
const ruta = express.Router();

const usuarios = [
    { id: 1, nombre: 'Fabio' },
    { id: 2, nombre: 'Juan' },
    { id: 3, nombre: 'Ana' }
];

ruta.get('/', (req, res) => {
    res.send(usuarios);
});

ruta.get('/:id', (req, res) => {
    let usuario = existeUsuario(req.params.id);
    if (!usuario) res.status(404).send('El usuario no fue encontrado');
    res.send(usuario);
});


ruta.post('/', (req, res) => {

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

ruta.put('/:id', (req, res) => {
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

ruta.delete('/:id', (req, res) => {
    let usuario = existeUsuario(req.params.id);
    if (!usuario) {
        res.status(400).send('El usuario no fue encontrado');
        return;
    }

    const index = usuarios.indexOf(usuario);
    usuarios.splice(index, 1);

    res.send(usuario);
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

module.exports = ruta;