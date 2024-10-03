import { Serie } from './entities/serie.entity'
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SerieController } from './serie.controller';
import { SerieService } from './seire.service';

@Module({
  imports: [TypeOrmModule.forFeature([Serie])],
  exports: [TypeOrmModule, SerieService],
  controllers: [SerieController],
  providers: [SerieService],
})
export class SeriesModule {}
