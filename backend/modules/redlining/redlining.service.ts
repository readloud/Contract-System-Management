import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RedliningSession } from './entities/redlining-session.entity';
import { RedliningChange } from './entities/redlining-change.entity';

@Injectable()
export class RedliningService {
  constructor(
    @InjectRepository(RedliningSession)
    private sessionRepo: Repository<RedliningSession>,
    @InjectRepository(RedliningChange)
    private changeRepo: Repository<RedliningChange>,
  ) {}

  async getSessionChanges(sessionId: string) {
    return this.changeRepo.find({
      where: { sessionId },
      order: { startPosition: 'ASC' },
    });
  }

  async acceptChange(changeId: string, reviewerId: string) {
    const change = await this.changeRepo.findOne({ where: { id: changeId } });
    if (!change) throw new NotFoundException('Change not found');

    change.status = 'accepted';
    change.resolvedAt = new Date();
    await this.changeRepo.save(change);
    return change;
  }

  async rejectChange(changeId: string, reviewerId: string) {
    const change = await this.changeRepo.findOne({ where: { id: changeId } });
    if (!change) throw new NotFoundException('Change not found');

    change.status = 'rejected';
    change.resolvedAt = new Date();
    await this.changeRepo.save(change);
    return change;
  }
}
