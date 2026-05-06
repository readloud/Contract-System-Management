import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

export enum MeteraiProvider {
  PERURI = 'peruri',
  MITRAKAS = 'mitrakas',
  VIDA = 'vida',
}

export enum MeteraiStatus {
  PENDING = 'pending',
  APPLIED = 'applied',
  FAILED = 'failed',
}

@Entity('e_meterai_logs')
export class MeteraiLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true, name: 'contract_id' })
  contractId: string;

  @Column({ type: 'varchar' })
  provider: string;

  @Column({ nullable: true, name: 'meterai_number' })
  meteraiNumber: string;

  @Column({ nullable: true, name: 'meterai_code' })
  meteraiCode: string;

  @Column({ nullable: true, name: 'qr_code' })
  qrCode: string;

  @Column({ type: 'varchar', default: 'pending' })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
