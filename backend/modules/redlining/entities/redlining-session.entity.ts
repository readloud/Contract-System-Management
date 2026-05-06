import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';

export enum RedliningStatus {
  DRAFT = 'draft',
  IN_REVIEW = 'in_review',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  PARTIALLY_ACCEPTED = 'partially_accepted',
}

@Entity('redlining_sessions')
export class RedliningSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'contract_id' })
  contractId: string;

  @Column({ name: 'base_version_id' })
  baseVersionId: string;

  @Column({ name: 'target_version_id', nullable: true })
  targetVersionId: string;

  @Column({ type: 'varchar', default: 'draft' })
  status: string;

  @Column({ name: 'initiated_by', nullable: true })
  initiatedBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
