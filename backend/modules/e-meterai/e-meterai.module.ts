import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EMeteraiService } from './e-meterai.service';
import { EMeteraiController } from './e-meterai.controller';
import { MeteraiLog } from './entities/meterai-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MeteraiLog])],
  controllers: [EMeteraiController],
  providers: [EMeteraiService],
  exports: [EMeteraiService],
})
export class EMeteraiModule {}
