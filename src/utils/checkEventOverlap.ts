import { Cinema } from '../cinema/cinema.entity.js';
import { Event } from '../event/event.entity.js';
import { orm } from '../shared/db/orm.js';


// Retorna un array con los cines donde hay superposición de eventos
export async function checkOverlappingEventsWithCinemas(
  startDate: string, //startDate del nuevo cine propuesto
  finishDate: string,
  cinemas: Cinema[],
  currentEventId?: number //parametro opcional con Id del evento actual para que no haga un falso overlap cuando hacemos el update
): Promise<Cinema[]> {
  const em = orm.em;
  const newStartDate = new Date(startDate); //convertimos la startDate en fecha
  const newFinishDate = new Date(finishDate);
  const overlappingCinemas: Cinema[] = []; //contedor de los cinemas superpuestos

  try {
    // Recorre cada cine para buscar eventos superpuestos
    for (const cinema of cinemas) {
      let overlappingEvents = await em.find(Event, {
        cinemas: cinema.id, // Busca eventos que tengan asociado un cine con el id del cine actual, busca eventos del cine actual 
        startDate: { $lt: newFinishDate }, // Busca eventos que terminen después de la fecha de inicio propuesta
        finishDate: { $gt: newStartDate },  // Busca eventos que empiecen antes de la fecha de fin propuesta
      });

      //exluir el evento actual si es un update (para que haga overlap el mismo evento que quiero hacerle update)
      if (currentEventId) {
        overlappingEvents = overlappingEvents.filter(
          (event) => event.id !== currentEventId
        );
      }

      // Si hay eventos superpuestos en este cine, lo agregamos al array de cines superpuestos
      if (overlappingEvents.length > 0) {
        overlappingCinemas.push(cinema);
      }
    }

    return overlappingCinemas; // Devuelve los cines con superposición

  } catch (error) {
    console.error('Error checking overlapping events:', error);
    throw new Error('Error checking overlapping events');
  }
}