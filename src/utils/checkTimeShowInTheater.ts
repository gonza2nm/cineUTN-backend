import { orm } from "../shared/db/orm.js"
import { Show } from "../show/show.entity.js"


//true si se encuentra una funcion dentro del mismo horario
//false si no se encuentra una funcion entre eso horario
export async function checkTimeShowInTheater(dayAndTime: string, finishTime: string, theaterId: string, showtimeId: number | null): Promise<Boolean> {
  const em = orm.em
  const newtheaterId = Number(theaterId);
  const newShowStartDate = new Date(`${dayAndTime}Z`);
  const newShowEndDate = new Date(`${finishTime}Z`);
  try {
    const overlappingShows = await em.find(Show, {
      theater: newtheaterId,
      dayAndTime: { $lt: newShowEndDate },
      finishTime: { $gt: newShowStartDate }
    });


    if (overlappingShows.length > 0) {    
      if(overlappingShows.length == 1 && showtimeId != null){
        if(overlappingShows.some(s => s.id == showtimeId)){
        return false
      }
      return true
    }
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error checking for overlapping shows:", error);
    return true;
  }

}