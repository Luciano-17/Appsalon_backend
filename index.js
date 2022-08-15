import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import conectarDB from './config/db.js';
import appsalonRoutes from './routes/appsalonRoutes.js';
import clienteRoutes from './routes/clienteRoutes.js';

const app = express();
app.use(express.json());
dotenv.config();

conectarDB();

const dominiosPermitidos = [process.env.FRONTEND_URL, process.env.FRONTEND_CLIENT_URL]
const corsOptions = {
    origin: function(origin, callback) {
        if(dominiosPermitidos.indexOf(origin) !== -1) {
            // El origen del request esta permitido
            callback(null, true)
        } else {
            callback(new Error('No permitido por CORS'))
        }
    }
}
app.use(cors(corsOptions))

// Router
app.use('/api/appsalon', appsalonRoutes);
app.use('/api/cliente', clienteRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Servidor funcionando ${PORT}`);
})