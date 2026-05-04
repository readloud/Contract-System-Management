import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ContractVersion } from './contract-version.entity';

export enum ContractStatus {
  DRAFT = 'draft',
  REVIEW = 'review',
  SIGNATURE_PENDING = 'signature_pending',
  ACTIVE = 'active',
  EXPIRED = 'expired',
  TERMINATED = 'terminated',
}

export enum ContractType {
  EMPLOYMENT = 'employment',
  PROCUREMENT = 'procurement',
  SALES = 'sales',
  NDA = 'nda',
  PARTNERSHIP = 'partnership',
}

@Entity('contracts')
export class Contract {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  contractNumber: string;

  @Column()
  title: string;

  @Column({ type: 'enum', enum: ContractType })
  type: ContractType;

  @Column({ type: 'enum', enum: ContractStatus, default: ContractStatus.DRAFT })
  status: ContractStatus;

  @Column({ type: 'date', nullable: true })
  effectiveDate: Date;

  @Column({ type: 'date', nullable: true })
  expiryDate: Date;

  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
  value: number;

  @Column({ length: 3, default: 'IDR' })
  currency: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => User)
  createdBy: User;

  @OneToMany(() => ContractVersion, (version) => version.contract)
  versions: ContractVersion[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}