import { Controller, Get, Param } from '@nestjs/common';
import { FilmService } from './film.service';

@Controller('film')
export class FilmController {
  constructor(private readonly filmService: FilmService) {}

  @Get(':title')
  async getFilm(@Param('title') title: string) {
    const film = await this.filmService.getFilmByTitle(title);
    if (film) {
      return film;
    }
    return { message: 'Film not found' };
  }
}
