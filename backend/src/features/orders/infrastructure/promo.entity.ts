import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';
import { bigintToNumber } from '../../../common/transformers';

@Entity('promos')
export class Promo {
  @PrimaryColumn({ length: 32 })
  code: string;

  /** percent = foiz, fixed = qat'iy summa (so'm) */
  @Column({ type: 'varchar', length: 8, default: 'percent' })
  type: 'percent' | 'fixed';

  @Column({ type: 'bigint', default: 0, transformer: bigintToNumber })
  value: number;

  @Column({ default: true })
  active: boolean;

  @Column({ name: 'note_uz', length: 200, default: '' })
  noteUz: string;

  @Column({ name: 'note_ru', length: 200, default: '' })
  noteRu: string;

  @Column({ name: 'used_count', type: 'int', default: 0 })
  usedCount: number;

  @Column({ name: 'expires_at', type: 'timestamptz', nullable: true })
  expiresAt: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
