import { Serie } from './entities/serie.entity'
import { Module } from '@nestjs/common';
import { SeriesService } from './series.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Serie])],
  exports: [TypeOrmModule],
  controllers: [],
  providers: [SeriesService],
})
export class SeriesModule {}
