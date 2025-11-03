import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchoolYear } from './entities/school-year.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SchoolYear])],
})
export class SchoolYearsModule {}
