import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedliningSession } from './entities/redlining-session.entity';
import { RedliningChange } from './entities/redlining-change.entity';
import { RedliningService } from './redlining.service';
import { ContractsModule } from '../contracts/contracts.module';
import { DocumentsModule } from '../documents/documents.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RedliningSession, RedliningChange]),
    ContractsModule,
    DocumentsModule,
  ],
  providers: [RedliningService],
  exports: [RedliningService],
})
export class RedliningModule {}
