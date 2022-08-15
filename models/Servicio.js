import mongoose from 'mongoose';

const servicioSchema = mongoose.Schema({
    nombre: {
        type: String,
        requerid: true,
        trim: true
    },
    precio: {
        type: String,
        requerid: true,
        trim: true
    }
});

const Servicio = mongoose.model('servicios', servicioSchema);
export default Servicio;