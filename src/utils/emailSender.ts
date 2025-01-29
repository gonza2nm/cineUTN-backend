import nodemailer from 'nodemailer';

// Crear y configurar el transportador de nodemailer (transportador es un objeto que puede mandar un mail)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST_SERVER, // Host SMTP (smtp.gmail.com)
  port: Number(process.env.EMAIL_PORT_SERVER), // Puerto SMTP (587 para TLS)
  secure: false, // true para puerto 465, false para otros puertos (TLS)
  auth: {
    user: process.env.EMAIL_SENDER, // correo electrónico del enviador
    pass: process.env.EMAIL_APP_PASSWORD, // clave de aplicación
  },
});

/* // Para pruebas:

async function createTestAccount() {
  const testAccount = await nodemailer.createTestAccount();
  console.log('Test Account:', testAccount);
}

createTestAccount();

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email', // Servidor de pruebas de Nodemailer
  port: 587, // Puerto TLS
  secure: false, // Debe ser false para TLS
  auth: {
    user: 'kul2mqhcvyjq64gh@ethereal.email', // Reemplaza con el user generado
    pass: '2bxJb2s2jkMY4J73NG', // Reemplaza con el pass generado
  },
});
// */

// Función para enviar correos
export async function sendMail(to: string, subject: string, text: string, html?: string) {
  try {
    const mailOptions = { //aca se arma el mail para mandar
      from: process.env.EMAIL_FROM || 'noreply@cineutn.com', // Dirección del remitente que vera el usuario(o sea una falsa para que no sepan la real)
      to, // Dirección del destinatario
      subject, // Asunto
      text, // Texto plano del correo
      html, // (Opcional) Versión HTML del correo
    };

    const info = await transporter.sendMail(mailOptions); // Envia el correo
    console.log(`Email sent: ${info.messageId}`);
    // para pruebas:
    //console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error; // Lanza el error para que pueda ser manejado por quien llame a esta función
  }
}
