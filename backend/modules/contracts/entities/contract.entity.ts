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

  @Column({ unique: true, name: 'contract_number' })
  contractNumber: string;

  @Column()
  title: string;

  @Column({ type: 'enum', enum: ContractType })
  type: ContractType;

  @Column({ type: 'enum', enum: ContractStatus, default: ContractStatus.DRAFT })
  status: ContractStatus;

  @Column({ type: 'date', nullable: true, name: 'effective_date' })
  effectiveDate: Date;

  @Column({ type: 'date', nullable: true, name: 'expiry_date' })
  expiryDate: Date;

  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
  value: number;

  @Column({ length: 3, default: 'IDR' })
  currency: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => User)
  createdBy: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
