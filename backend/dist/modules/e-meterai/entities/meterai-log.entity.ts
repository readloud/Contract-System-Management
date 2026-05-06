import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Contract } from '../../contracts/entities/contract.entity';

export enum MeteraiProvider {
  PERURI = 'peruri',
  MITRAKAS = 'mitrakas',
  VIDA = 'vida',
  PRIVY = 'privy',
}

export enum MeteraiStatus {
  PENDING = 'pending',
  APPLIED = 'applied',
  FAILED = 'failed',
  VERIFIED = 'verified',
}

@Entity('e_meterai_logs')
export class MeteraiLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Contract)
  contract: Contract;

  @Column({ nullable: true })
  contractId: string;

  @Column({ type: 'enum', enum: MeteraiProvider })
  provider: MeteraiProvider;

  @Column({ unique: true, nullable: true })
  meteraiNumber: string;

  @Column({ nullable: true })
  meteraiCode: string;

  @Column({ nullable: true })
  qrCode: string;

  @Column({ type: 'timestamp', nullable: true })
  appliedAt: Date;

  @Column({ nullable: true })
  appliedBy: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 10000 })
  amount: number;

  @Column({ type: 'enum', enum: MeteraiStatus, default: MeteraiStatus.PENDING })
  status: MeteraiStatus;

  @Column({ nullable: true })
  verificationUrl: string;

  @Column({ type: 'jsonb', nullable: true })
  apiRequest: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  apiResponse: Record<string, any>;

  @Column({ nullable: true })
  errorMessage: string;

  @CreateDateColumn()
  createdAt: Date;
}