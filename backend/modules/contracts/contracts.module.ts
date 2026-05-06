import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contract } from './entities/contract.entity';
import { ContractVersion } from './entities/contract-version.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Contract, ContractVersion])],
  exports: [TypeOrmModule],
})
export class ContractsModule {}
