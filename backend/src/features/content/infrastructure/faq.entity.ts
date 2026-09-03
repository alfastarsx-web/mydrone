import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('faq')
export class Faq {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'q_uz', type: 'text' })
  qUz: string;

  @Column({ name: 'q_ru', type: 'text', default: '' })
  qRu: string;

  @Column({ name: 'a_uz', type: 'text' })
  aUz: string;

  @Column({ name: 'a_ru', type: 'text', default: '' })
  aRu: string;

  @Column({ type: 'int', default: 0 })
  sort: number;
}
