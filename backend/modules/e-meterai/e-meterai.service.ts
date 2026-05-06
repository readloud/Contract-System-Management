import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MeteraiLog, MeteraiProvider, MeteraiStatus } from './entities/meterai-log.entity';

@Injectable()
export class EMeteraiService {
  constructor(
    @InjectRepository(MeteraiLog)
    private meteraiLogRepo: Repository<MeteraiLog>,
  ) {}

  async applyMeterai(contractId: string, documentUrl: string, provider: MeteraiProvider = MeteraiProvider.PERURI) {
    const meteraiLog = this.meteraiLogRepo.create({
      contractId,
      provider,
      status: MeteraiStatus.PENDING,
    });
    await this.meteraiLogRepo.save(meteraiLog);

    // Simulasi berhasil
    meteraiLog.status = MeteraiStatus.APPLIED;
    meteraiLog.meteraiNumber = `MET-${Date.now()}`;
    await this.meteraiLogRepo.save(meteraiLog);

    return meteraiLog;
  }

  async verifyMeterai(meteraiNumber: string): Promise<boolean> {
    const meteraiLog = await this.meteraiLogRepo.findOne({
      where: { meteraiNumber },
    });
    return !!meteraiLog;
  }

  async getContractMeteraiLogs(contractId: string): Promise<MeteraiLog[]> {
    return this.meteraiLogRepo.find({
      where: { contractId },
      order: { createdAt: 'DESC' },
    });
  }
}
