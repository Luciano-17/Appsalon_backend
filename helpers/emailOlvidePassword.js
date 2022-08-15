import nodemailer from 'nodemailer'

const emailOlvidePassword = async datos => {
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
        from: "AppSalón | Cambiar tu contraseña",
        to: email,
        subject: 'Cambiar tu contraseña en AppSalón',
        text: 'Cambiar tu contraseña en AppSalón',
        html: `<p>Hola, ${nombre} ${apellido}. Cambia la contraseña en AppSalón.</p>
            
            <p>
                Sólo debes ingresar al siguiente enlace:
                <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer cuenta</a>
            </p>

            <p>
                Si tu no creaste esta cuenta, puedes ignorar este mensaje.
            </p>
        `
    });

    console.log("mensaje enviado: %s", info.messageId);
};

export default emailOlvidePassword;