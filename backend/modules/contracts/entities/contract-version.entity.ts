import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Contract } from './contract.entity';

@Entity('contract_versions')
export class ContractVersion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Contract)
  contract: Contract;

  @Column({ name: 'version_number' })
  versionNumber: number;

  @Column({ name: 'file_key' })
  fileKey: string;

  @Column({ name: 'file_hash', nullable: true })
  fileHash: string;

  @Column({ default: false, name: 'is_current' })
  isCurrent: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
