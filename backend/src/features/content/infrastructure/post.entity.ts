import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ length: 160 })
  slug: string;

  @Column({ length: 160, default: '' })
  img: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ name: 'cat_uz', length: 80, default: '' })
  catUz: string;

  @Column({ name: 'cat_ru', length: 80, default: '' })
  catRu: string;

  @Column({ name: 'title_uz', length: 250 })
  titleUz: string;

  @Column({ name: 'title_ru', length: 250, default: '' })
  titleRu: string;

  @Column({ name: 'lead_uz', type: 'text', default: '' })
  leadUz: string;

  @Column({ name: 'lead_ru', type: 'text', default: '' })
  leadRu: string;

  @Column({ name: 'body_uz', type: 'text', default: '' })
  bodyUz: string;

  @Column({ name: 'body_ru', type: 'text', default: '' })
  bodyRu: string;

  @Column({ default: true })
  published: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
