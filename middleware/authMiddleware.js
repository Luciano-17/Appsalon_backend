import jwt from 'jsonwebtoken';
import Peluquero from '../models/Peluquero.js';

const checkAuth = async (req, res, next) => {
    let token;

    // Nos aseguramos de que exista el token y qye contenga "Bearer"
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.peluquero = await Peluquero.findById(decoded.id).select("-password -token -confirmado");

            return next();
        } catch (error) {
            const e = new Error('Token no válido');
            res.status(403).json({msg: e.message});
        }
    }

    if(!token) {
        const error = new Error('Token no válido o inexistente');
        return res.status(403).json({msg: error.message});
    }

    next();
};

export default checkAuth;