import { Movie } from "../movie/movie.entity.js";
import { orm } from "../shared/db/orm.js"


//verifica que si el fomato y el lenguage de la funcion que se pide coinciden con los formatos y languages de la pelicula
//retorna true si existen ambas, y si no existe alguna devuelve false
export async function checkLanguageAndFormat(movie_id: string, language_id: string, format_id: string): Promise<Boolean> {
  const em = orm.em
  const movieId = Number(movie_id);
  const languageId = Number(language_id);
  const formatId = Number(format_id);

  try {
    const movie = await em.findOneOrFail(Movie, { id:movieId }, {populate: ['formats', 'languages']})
  
    const exits_format = movie.formats.toArray().some(format => format.id === formatId);
    const exist_language = movie.languages.toArray().some(language => language.id === languageId);

    if(exist_language && exits_format){
      return true
    }else{
      return false
    } 
  } catch (error) {
    console.error("Error checking if format and language exist in the movie", error);
    return false;
  }

}