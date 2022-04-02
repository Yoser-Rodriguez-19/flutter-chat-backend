const bcrypt = require("bcryptjs");
const { response } = require("express");
const { validationResult } = require("express-validator");
const { generarJWT } = require("../helpers/jwt");
const Usuario = require("../models/usuario");



const crearUsuario = async (req, res = response) => {

    const { email, password } = req.body;

    try {
            
        // Revisar si el usuario existe
        let existeEmail = await Usuario.findOne({ email });

        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario ya existe'
            });
        }

        // Crear nuevo usuario
        const usuario = new Usuario(req.body);

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );

        // Guardar usuario
        await usuario.save();

        // Crear token (JWT)
        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            usuario,
            token
        });
    
    } catch {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

    
}

const login = async (req, res = response) => {
    
    const { email, password } = req.body;

    // Revisar si el usuario existe
    try {
        let usuarioDB = await Usuario.findOne({ email });

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no encontrado'
            });
        }

        // Revisar si la contraseña es correcta
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña incorrecta'
            });
        }

        // Crear token (JWT)
        const token = await generarJWT(usuarioDB.id);

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
    
}


const renewToken = async (req, res = response) => {
    
    const uid = req.uid;

    // Crear token (JWT)
    const token = await generarJWT(uid);

    // Obtener usuario
    const usuario = await Usuario.findById(uid);


    res.json({
        ok: true,
        usuario,
        token
    });
    
}



module.exports = {
    crearUsuario,
    login,
    renewToken
}