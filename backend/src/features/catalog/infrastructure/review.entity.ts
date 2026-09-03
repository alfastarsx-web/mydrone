import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'product_id', type: 'uuid' })
  productId: string;

  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  userId: string | null;

  @Column({ length: 120 })
  name: string;

  @Column({ type: 'int', default: 5 })
  rate: number;

  @Column({ type: 'text', default: '' })
  text: string;

  /** Moderatsiya: admin tasdiqlamaguncha saytda ko'rinmaydi */
  @Column({ default: false })
  approved: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
