import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FilmModule } from './film/film.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    FilmModule,
  ],
})
export class AppModule {}
