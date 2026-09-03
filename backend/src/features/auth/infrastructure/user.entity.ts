import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from '../../../common/types';
import { bigintToNumber } from '../../../common/transformers';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 120 })
  name: string;

  @Index({ unique: true })
  @Column({ length: 160 })
  email: string;

  @Column({ name: 'password_hash', length: 200 })
  passwordHash: string;

  @Column({ length: 32, default: '' })
  phone: string;

  @Column({ type: 'varchar', length: 16, default: 'customer' })
  role: UserRole;

  /** Referal kodi — do'stni taklif qilish uchun */
  @Index({ unique: true })
  @Column({ name: 'ref_code', length: 16 })
  refCode: string;

  /** Kim taklif qilgan */
  @Column({ name: 'ref_by', type: 'uuid', nullable: true })
  refBy: string | null;

  /** Bonus balans (so'm) */
  @Column({ type: 'bigint', default: 0, transformer: bigintToNumber })
  bonus: number;

  @Column({ name: 'invited_count', type: 'int', default: 0 })
  invitedCount: number;

  /** Referal orqali jami ishlangan bonus */
  @Column({ type: 'bigint', default: 0, transformer: bigintToNumber })
  earned: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
