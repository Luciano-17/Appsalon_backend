import nodemailer from 'nodemailer'

const emailRegistro = async datos => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const {email, nombre, apellido, token} = datos;

    // Enviar el email
    const info = await transporter.sendMail({
        from: "AppSalón | Comprobar cuenta",
        to: email,
        subject: 'Comprueba tu cuenta en AppSalón',
        text: 'Comprueba tu cuenta en AppSalón',
        html: `<p>Hola, ${nombre} ${apellido}. Comprueba tu cuenta en AppSalón.</p>
            
            <p>
                Tu cuenta esta lista, sólo debes comprobarla ingresando en el siguiente enlace:
                <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar cuenta</a>
            </p>

            <p>
                Si tu no creaste esta cuenta, puedes ignorar este mensaje.
            </p>
        `
    });

    console.log("mensaje enviado: %s", info.messageId);
};

export default emailRegistro;