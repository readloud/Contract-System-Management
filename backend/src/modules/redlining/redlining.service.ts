import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RedliningSession } from './entities/redlining-session.entity';
import { RedliningChange } from './entities/redlining-change.entity';
import { ContractVersion } from '../contracts/entities/contract-version.entity';
import { DocumentsService } from '../documents/documents.service';

@Injectable()
export class RedliningService {
  constructor(
    @InjectRepository(RedliningSession)
    private sessionRepo: Repository<RedliningSession>,
    @InjectRepository(RedliningChange)
    private changeRepo: Repository<RedliningChange>,
    @InjectRepository(ContractVersion)
    private versionRepo: Repository<ContractVersion>,
    private documentsService: DocumentsService,
  ) {}

  async createSession(contractId: string, baseVersionId: string, proposedVersionId: string, userId: string) {
    const baseVersion = await this.versionRepo.findOne({ where: { id: baseVersionId } });
    const proposedVersion = await this.versionRepo.findOne({ where: { id: proposedVersionId } });

    if (!baseVersion || !proposedVersion) {
      throw new NotFoundException('Version not found');
    }

    // Download and extract text from both PDFs
    const baseText = await this.documentsService.extractTextFromPdf(baseVersion.fileKey);
    const proposedText = await this.documentsService.extractTextFromPdf(proposedVersion.fileKey);

    // Simple diff algorithm (word by word)
    const changes = this.computeDiff(baseText, proposedText);

    const session = this.sessionRepo.create({
      contractId,
      baseVersionId,
      targetVersionId: proposedVersionId,
      status: 'draft',
      initiatedBy: { id: userId } as any,
    });
    await this.sessionRepo.save(session);

    for (const change of changes) {
      const changeEntity = this.changeRepo.create({
        sessionId: session.id,
        changeType: change.type,
        originalText: change.original,
        proposedText: change.proposed,
        startPosition: change.start,
        endPosition: change.end,
        authorId: userId,
        status: 'pending',
      });
      await this.changeRepo.save(changeEntity);
    }

    return { session, changes: changes.length };
  }

  private computeDiff(base: string, proposed: string): any[] {
    const baseWords = base.split(/\s+/);
    const proposedWords = proposed.split(/\s+/);
    const changes = [];
    let position = 0;

    // Simple implementation - in production use a proper diff library
    for (let i = 0; i < Math.max(baseWords.length, proposedWords.length); i++) {
      if (baseWords[i] !== proposedWords[i]) {
        changes.push({
          type: 'replace',
          original: baseWords[i] || '',
          proposed: proposedWords[i] || '',
          start: position,
          end: position + (baseWords[i]?.length || 0),
        });
      }
      position += (baseWords[i]?.length || 0) + 1;
    }
    return changes;
  }

  async acceptChange(changeId: string, reviewerId: string) {
    const change = await this.changeRepo.findOne({ where: { id: changeId }, relations: ['session'] });
    if (!change) throw new NotFoundException('Change not found');

    change.status = 'accepted';
    change.resolvedAt = new Date();
    await this.changeRepo.save(change);
    return change;
  }

  async rejectChange(changeId: string, reviewerId: string) {
    const change = await this.changeRepo.findOne({ where: { id: changeId }, relations: ['session'] });
    if (!change) throw new NotFoundException('Change not found');

    change.status = 'rejected';
    change.resolvedAt = new Date();
    await this.changeRepo.save(change);
    return change;
  }

  async getSessionChanges(sessionId: string) {
    return this.changeRepo.find({
      where: { sessionId },
      order: { startPosition: 'ASC' },
    });
  }
}