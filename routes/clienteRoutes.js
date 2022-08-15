import express from 'express';
import {obtenerServicios, guardarCita} from '../controllers/clienteController.js'

const router = express.Router();

router.post('/servicios', obtenerServicios)
router.post('/guardar-cita', guardarCita)

// Rutas del backend

export default router;