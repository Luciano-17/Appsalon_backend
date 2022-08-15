import express from 'express';
import checkAuth from '../middleware/authMiddleware.js';
import {
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
} from '../controllers/appsalonController.js';

const router = express.Router();

// Appsalon
// Login
router.post('/login', autenticar);
router.post('/registrar', registrar);
router.get('/confirmar/:token', confirmar);
router.post('/olvide-password', olvidePassword);
router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword);
// Admin
router.get('/admin', appsalonAdmin);
router.post('/citas', obtenerCitas);
router.delete('/eliminar-cita/:id', eliminarCita);

router.post('/servicios', obtenerServicios);
router.put('/servicio/:id', actualizarServicio);
router.post('/servicio/guardar', agregarPaciente);
router.delete('/servicio/:id', eliminarPaciente);


router.put('/perfil/:id', checkAuth, actualizarPerfil);
router.put('/cambiar-password', checkAuth, actualizarPassword);

export default router;