import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Category } from './category.entity';

@Entity('subcategories')
export class Subcategory {
  @PrimaryColumn({ length: 64 })
  id: string;

  @Index()
  @Column({ name: 'category_id', length: 64 })
  categoryId: string;

  @Column({ name: 'name_uz', length: 120 })
  nameUz: string;

  @Column({ name: 'name_ru', length: 120 })
  nameRu: string;

  @Column({ type: 'int', default: 0 })
  sort: number;

  @ManyToOne(() => Category, (c) => c.subs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'category_id' })
  category: Category;
}
