import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

/** Qo'ng'iroqqa buyurtma va aloqa formasi murojaatlari */
@Entity('leads')
export class Lead {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 16, default: 'callback' })
  type: 'callback' | 'contact';

  @Column({ length: 120 })
  name: string;

  @Column({ length: 32 })
  phone: string;

  @Column({ type: 'text', default: '' })
  msg: string;

  @Index()
  @Column({ default: false })
  handled: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
