import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Subcategory } from './subcategory.entity';

@Entity('categories')
export class Category {
  /** Slug birdaniga birlamchi kalit — manzillarda ham shu ishlatiladi */
  @PrimaryColumn({ length: 64 })
  id: string;

  @Column({ name: 'name_uz', length: 120 })
  nameUz: string;

  @Column({ name: 'name_ru', length: 120 })
  nameRu: string;

  @Column({ length: 160, default: '' })
  img: string;

  @Column({ length: 32, default: 'box' })
  icon: string;

  @Column({ type: 'int', default: 0 })
  sort: number;

  @OneToMany(() => Subcategory, (s) => s.category, { cascade: true, eager: true })
  subs: Subcategory[];
}
