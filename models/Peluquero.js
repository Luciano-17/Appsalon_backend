import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import generarId from '../helpers/generarId.js';

const peluqueroSchema = mongoose.Schema({
    nombre: {
        type: String,
        requerid: true,
        trim: true
    },
    apellido: {
        type: String,
        requerid: true,
        trim: true
    },
    password: {
        type: String,
        requerid: true
    },
    email: {
        type: String,
        requerid: true,
        unique: true,
        trim: true
    },
    telefono: {
        type: String,
        default: null,
        trim: true
    },
    token: {
        type: String,
        default: generarId()
    },
    confirmado: {
        type: Boolean,
        default: false
    }
});

peluqueroSchema.pre('save', async function(next) {
    if(!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

peluqueroSchema.methods.comprobarPassword = async function(passForm) {
    return await bcrypt.compare(passForm, this.password);
};

const Peluquero = mongoose.model('Peluqueros', peluqueroSchema);
export default Peluquero;