import mongoose from 'mongoose';

const citaSchema = mongoose.Schema({
    nombre: {
        type: String,
        requerid: true,
        trim: true
    },
    fecha: {
        type: Date,
        requerid: true,
        default: Date.now()
    },
    hora: {
        type: String,
        requerid: true
    },
    servicios: {
        type: Array,
        required: true
    }
});

const Cita = mongoose.model('Citas', citaSchema);
export default Cita;