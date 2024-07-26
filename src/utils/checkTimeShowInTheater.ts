import { orm } from "../shared/db/orm.js"
import { Show } from "../show/show.entity.js"


//true si se encuentra una funcion dentro del mismo horario
//false si no se encuentra una funcion entre eso horario
export async function  checkTimeShowInTheater(dayAndTime:string, finishTime:string, theaterId:string):Promise<Boolean>{
  const em = orm.em
  const newtheaterId = Number(theaterId);
  console.log(theaterId)
  console.log(newtheaterId)
  const startDate = new Date(`${dayAndTime}Z`);
  const endDate = new Date(`${finishTime}Z`);
  console.log(startDate)
  console.log(endDate)
  try{
    const overlappingShows = await em.find(Show, {
      theater: newtheaterId,
      $or: [
              { 
                dayAndTime: { $lt: endDate }, 
                finishTime: { $gt: startDate }
              },
              { 
                dayAndTime: { $lte: endDate }, 
                finishTime: { $gte: startDate }
              }
            ]
    });
    if (overlappingShows.length > 0) {
      console.log("Overlapping shows detected.");
      return true;
    } else {
      console.log("No overlapping shows detected.");
      return false;
    }
  }catch(error){
    console.error("Error checking for overlapping shows:", error);
    return true;
  }
  
}