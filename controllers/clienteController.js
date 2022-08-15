import Servicio from "../models/Servicio.js";
import Cita from "../models/Cita.js";

const obtenerServicios = async (req, res) => {
    const servicios = await Servicio.find()
    res.json(servicios)
};

const guardarCita = async (req, res) => {
    try {
        const citaNueva = new Cita(req.body)
        const citaGuardada = await citaNueva.save()

        res.json(citaGuardada)    
    } catch (error) {
        console.log(error)
    }
};

export {obtenerServicios, guardarCita}