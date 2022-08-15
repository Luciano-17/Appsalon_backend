import Peluquero from '../models/Peluquero.js';
import Servicio from '../models/Servicio.js';
import Cita from '../models/Cita.js';
import generarJWT from '../helpers/generarJWT.js';
import emailRegistro from '../helpers/emailRegistro.js';
import emailOlvidePassword from '../helpers/emailOlvidePassword.js';
import generarId from '../helpers/generarId.js';

const autenticar = async (req, res) => {
    const {email, password} = req.body;

    const usuario = await Peluquero.findOne({email});
    if(!usuario) {
        const error = new Error('El usuario no existe');
        return res.status(404).json({msg: error.message});
    }
    if(!usuario.confirmado) {
        const error = new Error('La cuenta no fue confirmada');
        return res.status(403).json({msg: error.message});
    }

    // Revisar password
    if(await usuario.comprobarPassword(password)) {
        // Autenticar
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            email: usuario.email,
            telefono: usuario.telefono,
            token: generarJWT(usuario._id)
        });
    } else {
        const error = new Error('Contraseña incorrecta');
        return res.status(403).json({msg: error.message});
    }
};

const registrar = async (req, res) => {
    const {email, nombre, apellido} = req.body;

    const existeUsuario = await Peluquero.findOne({email});
    if(existeUsuario) {
        const error = new Error('Usuario ya registrado');
        return res.status(400).json({msg: error.message});
    }

    try {
        const peluquero = new Peluquero(req.body);
        const peluqueroGuardado = await peluquero.save();

        // Enviar mail
        emailRegistro({
            email,
            nombre, 
            apellido,
            token: peluqueroGuardado.token
        });

        res.json(peluqueroGuardado);
    } catch (error) {
        console.log(error);
    }
};

const confirmar = async (req, res) => {
    const {token} = req.params;
    
    const usuarioConfirmar = await Peluquero.findOne({token});
    if(!usuarioConfirmar) {
        const error = new Error('Token no válido');
        return res.status(404).json({msg: error.message});
    }

    try {
        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = true;
        await usuarioConfirmar.save();

        res.json({msg: 'Usuario confirmado correctamente'});
    } catch (error) {
        console.log(error);
    }
};

const olvidePassword = async (req, res) => {
    const {email} = req.body;

    const existePeluquero = await Peluquero.findOne({email});
    if(!existePeluquero) {
        const error = new Error('El usuario no existe');
        return res.status(400).json({msg: error.message});
    }

    try {
        existePeluquero.token = generarId();
        await existePeluquero.save();

        // Enviar mail
        emailOlvidePassword({
            email,
            nombre: existePeluquero.nombre,
            apellido: existePeluquero.apellido,
            token: existePeluquero.token
        });

        res.json({msg: 'Hemos enviado un e-mail con las instrucciones'});
    } catch (error) {
        console.log(error);
    }
};

const comprobarToken = async (req, res) => {
    const {token} = req.params;

    const tokenValido = await Peluquero.findOne({token});
    if(!tokenValido) {
        const error = new Error('Token no válido');
        return res.status(400).json({msg: error.message});
    }

    res.json({msg: 'Usuario y token válidos'});
};

const nuevoPassword = async (req, res) => {
    const {token} = req.params;
    const {password} = req.body;

    const peluquero = await Peluquero.findOne({token});
    if(!peluquero) {
        const error = new Error('Hubo un error');
        return res.status(400).json({msg: error.message});
    }

    try {
        peluquero.token = null;
        peluquero.password = password;
        await peluquero.save();

        res.json({msg: 'Contraseña modificada correctamente'});
    } catch (error) {
        console.log(error);
    }
};

const eliminarCita = async (req, res) => {
    const {id} = req.params;

    const cita = await Cita.findById(id)

    try {
        await cita.deleteOne();
        res.json({msg: 'Cita eliminada'})
    } catch (error) {
        console.log(error);
    }
};

const appsalonAdmin = async (req, res) => {
    const {peluquero} = req;
    res.json(peluquero);
};

const obtenerCitas = async (req, res) => {
    const citas = await Cita.find();
    res.json(citas);
};

const obtenerServicios = async (req, res) => {
    const servicios = await Servicio.find();
    res.json(servicios);
};

const actualizarServicio = async (req, res) => {
    const {id} = req.params;
    
    const servicio = await Servicio.findById(id);
    if(!servicio) {
        const error = new Error('Servicio no encontrado');
        return res.status(404).json({msg: error.message});
    }

    servicio.nombre = req.body.nombre;
    servicio.precio = req.body.precio;

    try {
        const servicioActualizado = await servicio.save();
        res.json(servicioActualizado);
    } catch (error) {
        console.log(error)
    }
};

const agregarPaciente = async (req, res) => {
    const servicio = new Servicio(req.body);

    try {
        const servicioAlmacenado = await servicio.save();
        res.json(servicioAlmacenado);
    } catch (error) {
        console.log(error);
    }
};

const eliminarPaciente = async (req, res) => {
    const {id} = req.params;

    const servicio = await Servicio.findById(id);
    if(!servicio) {
        const error = new Error('Servicio no encontrado');
        return res.status(404).json({msg: error.message});
    }

    try {
        await servicio.deleteOne();
        res.json({msg: 'Servicio eliminado'})
    } catch (error) {
        console.log(error);
    }
};

const actualizarPerfil = async (req, res) => {
    const peluquero = await Peluquero.findById(req.params.id);
    if(!peluquero) {
        const error = new Error('Hubo un error');
        return res.status(400).json({msg: error.message});
    }

    const {email} = req.body
    if(peluquero.email !== email) {
        const existeEmail = await peluquero.findOne({email});
        if(existeEmail) {
            const error = new Error('El e-mail ya está en uso');
            return res.status(400).json({msg: error.message});
        }
    }

    try {
        peluquero.nombre = req.body.nombre
        peluquero.apellido = req.body.apellido
        peluquero.email = req.body.email
        peluquero.telefono = req.body.telefono

        const peluqueroActualizado = await peluquero.save()
        res.json(peluqueroActualizado)
    } catch (error) {
        console.log(error);
    }
};

const actualizarPassword = async (req, res) => {
    const {_id} = req.peluquero;
    const {passActual, passNuevo} = req.body;

    const peluquero = await Peluquero.findById(_id);
    if(!peluquero) {
        const error = new Error('Hubo un error');
        return res.status(400).json({msg: error.message});
    }

    if(await peluquero.comprobarPassword(passActual)) {
        peluquero.password = passNuevo;
        await peluquero.save();
        res.json({msg: 'Almacenado correctamente'});
    } else {
        const error = new Error('La contraseña actual es incorrecta');
        return res.status(400).json({msg: error.message});
    }
};  

export {
    autenticar,
    registrar,
    confirmar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    appsalonAdmin,
    obtenerCitas,
    eliminarCita,
    obtenerServicios,
    actualizarServicio,
    agregarPaciente,
    eliminarPaciente,
    actualizarPerfil,
    actualizarPassword
}