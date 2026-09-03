import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { StockStatus } from '../../../common/types';
import { bigintToNumber, numericToNumber } from '../../../common/transformers';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ length: 160 })
  slug: string;

  @Index()
  @Column({ name: 'category_id', length: 64 })
  categoryId: string;

  @Index()
  @Column({ name: 'sub_id', type: 'varchar', length: 64, nullable: true })
  subId: string | null;

  @Index()
  @Column({ length: 80, default: '' })
  brand: string;

  @Column({ name: 'name_uz', length: 200 })
  nameUz: string;

  @Column({ name: 'name_ru', length: 200 })
  nameRu: string;

  /** Narxlar so'mda, butun son */
  @Column({ type: 'bigint', transformer: bigintToNumber })
  price: number;

  @Column({ name: 'old_price', type: 'bigint', default: 0, transformer: bigintToNumber })
  oldPrice: number;

  /** in = omborda, pre = buyurtma asosida, out = tugagan */
  @Column({ type: 'varchar', length: 8, default: 'in' })
  stock: StockStatus;

  @Column({ type: 'int', default: 0 })
  qty: number;

  /** Buyurtma asosida keladigan tovar necha kunda yetadi */
  @Column({ type: 'int', default: 0 })
  lead: number;

  @Column({ type: 'numeric', precision: 3, scale: 2, default: 5, transformer: numericToNumber })
  rating: number;

  @Column({ name: 'reviews_count', type: 'int', default: 0 })
  reviewsCount: number;

  @Column({ type: 'int', default: 0 })
  sold: number;

  @Column({ name: 'is_new', default: false })
  isNew: boolean;

  @Column({ name: 'is_hit', default: false })
  isHit: boolean;

  @Column({ type: 'text', array: true, default: () => "'{}'" })
  imgs: string[];

  @Column({ name: 'short_uz', type: 'text', default: '' })
  shortUz: string;

  @Column({ name: 'short_ru', type: 'text', default: '' })
  shortRu: string;

  /** Erkin texnik xususiyatlar: [[uz nomi, ru nomi, qiymat], ...]
   *  Har xil turkum o'z atributlariga ega bo'lishi uchun (TZ 8-bo'lim) */
  @Column({ type: 'jsonb', default: () => "'[]'" })
  specs: [string, string, string][];

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
