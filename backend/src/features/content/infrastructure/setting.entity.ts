import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

/** Sayt sozlamalari — kalit/qiymat juftliklari (telefon, manzil, yetkazish narxi...) */
@Entity('settings')
export class Setting {
  @PrimaryColumn({ length: 64 })
  key: string;

  @Column({ type: 'jsonb' })
  value: unknown;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
