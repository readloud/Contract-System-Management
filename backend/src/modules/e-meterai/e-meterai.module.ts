import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { EMeteraiService } from './e-meterai.service';
import { EMeteraiController } from './e-meterai.controller';
import { MeteraiLog } from './entities/meterai-log.entity';
import { ContractsModule } from '../contracts/contracts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MeteraiLog]),
    HttpModule.register({
      timeout: 30000,
      maxRedirects: 5,
    }),
    ContractsModule,
  ],
  controllers: [EMeteraiController],
  providers: [EMeteraiService],
  exports: [EMeteraiService],
})
export class EMeteraiModule {}