import { Repository } from '../shared/repository.js'
import { Genre } from './genre.entity.js'

const genres = [
  new Genre(
    'Comedia',
    'a02b91bc-3769-4221-beb1-d7a3aeba7dad'
  ),
]

export class GenreRepository implements Repository<Genre> {
  public findAll(): Genre[] | undefined {
    return genres
  }

  public findOne(item: { id: string }): Genre | undefined {
    return genres.find((genre) => genre.id === item.id)
  }

  public add(item: Genre): Genre | undefined {
    genres.push(item)
    return item
  }

  public update(item: Genre): Genre | undefined {
    const genreIdx = genres.findIndex(
      (genre) => genre.id === item.id
    )

    if (genreIdx !== -1) {
      genres[genreIdx] = { ...genres[genreIdx], ...item }
    }
    return genres[genreIdx]
  }

  public delete(item: { id: string }): Genre | undefined {
    const genreIdx = genres.findIndex(
      (genre) => genre.id === item.id
    )

    if (genreIdx !== -1) {
      const deletedGenres = genres[genreIdx]
      genres.splice(genreIdx, 1)
      return deletedGenres
    }
  }
}
