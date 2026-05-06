import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('redlining_changes')
export class RedliningChange {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'session_id' })
  sessionId: string;

  @Column({ name: 'change_type' })
  changeType: string;

  @Column({ name: 'original_text', type: 'text', nullable: true })
  originalText: string;

  @Column({ name: 'proposed_text', type: 'text', nullable: true })
  proposedText: string;

  @Column({ name: 'start_position', nullable: true })
  startPosition: number;

  @Column({ name: 'end_position', nullable: true })
  endPosition: number;

  @Column({ name: 'author_id', nullable: true })
  authorId: string;

  @Column({ default: 'pending' })
  status: string;

  @Column({ name: 'resolved_at', nullable: true })
  resolvedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
