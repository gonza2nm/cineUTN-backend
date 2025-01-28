import cron from 'node-cron';
import { orm } from '../shared/db/orm.js';
import { sendMail } from './emailSender.js';
import { Buy } from '../buy/buy.entity.js';
import { generateQRCode } from './qrCodeGenerator.js';

const em = orm.em

//obtenemos el rango de tiempo de mañana
const getTomorrowRange = () => {
  const today = new Date();

  const startOfTomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1); // usando los datos de hoy, obtengo mañana a las 00:00:00

  const endOfTomorrow = new Date(startOfTomorrow);
  endOfTomorrow.setHours(23, 59, 59, 999); // usando el inicio de mañana, calculo el ultimo instante de mañana

  return { startOfTomorrow, endOfTomorrow }; //las devolvemos en un obj
}

async function sendReminderEmails() {

  const { startOfTomorrow, endOfTomorrow } = getTomorrowRange();

  // Creamos un nuevo EntityManager aislado en su propio contexto, (da error si tratamos de hacerlo con el global)
  const emFork = orm.em.fork();

  try {
    const buys = await emFork.find(Buy, {
      tickets: { // viaja hasta show para filtrar por dayAndTime
        show: {
          dayAndTime: {
            $gte: startOfTomorrow,
            $lte: endOfTomorrow,
          }
        }
      }
    }, { populate: ['user', 'tickets', 'tickets.show', 'tickets.show.movie', 'tickets.show.theater'] }
    );
    // como nosotros al cancelar una compra borramos los tickets, entonces si mañana hay una cancelada no se muestra


    for (const buy of buys) {
      const user = buy.user;
      const show = buy.tickets[0].show
      let qrCodeUrl = ''

      if (buy.id) {
        qrCodeUrl = await generateQRCode(buy.id);
      }

      const to = user.email
      const subject = '¡Mañana es la funcion!'
      const text = `Hola ${user.name}, te recordamos que tu función de "${show.movie.name}" será mañana a las ${show.dayAndTime.toLocaleTimeString()} en la sala ${show.theater.id}. Muestrale el codigo QR de tu compra al encargado!`;
      const html =
        `<p>Hola <strong>${user.name}</strong>,</p>
       <p>Te recordamos que tu función de <strong>"${show.movie.name}"</strong> será mañana:</p>
       <ul>
         <li><strong>Hora:</strong> ${show.dayAndTime.toLocaleTimeString()}</li>
         <li><strong>Sala:</strong> ${show.theater.id}</li>
       </ul>
       <p><strong>Muestrale este código QR al encargado:</strong></p>
        <img src="${qrCodeUrl}" alt="Código QR" />`;

      await sendMail(to, subject, text, html);
      console.log(`Correo enviado a ${user.email} para la función "${show.movie.name}".`)
    }
  } catch (error) {
    console.error('Error sending reminder emails:', error);
  } finally {
    emFork.clear();  // Limpiamos el contexto del EntityManager "forkeado"
  }
}

export function startCronTimeJobs() {
  cron.schedule('0 9 * * *', sendReminderEmails); //ejecutamos esto todos los dias a las 9
  /*
  // para pruebas:
  cron.schedule('* * * * *', sendReminderEmails); // Ejecuta cada minuto
  */
}

/*
asi funciona cron:
*| * * * * * 
s| m h d M ds -> seg(opcional), min, hora, Mes, dia de la semana

*/