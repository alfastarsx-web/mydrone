import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { DeliveryMethod, OrderStatus, PayMethod } from '../../../common/types';
import { bigintToNumber } from '../../../common/transformers';
import { OrderItem } from './order-item.entity';

@Entity('orders')
export class Order {
  /** Mijozga ko'rinadigan raqam: DM-24081 */
  @PrimaryColumn({ length: 24 })
  id: string;

  @Index()
  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  userId: string | null;

  @Index()
  @Column({ type: 'varchar', length: 16, default: 'new' })
  status: OrderStatus;

  @Column({ length: 120 })
  name: string;

  @Index()
  @Column({ length: 32 })
  phone: string;

  @Column({ length: 160, default: '' })
  email: string;

  @Column({ length: 80, default: '' })
  region: string;

  @Column({ length: 120, default: '' })
  city: string;

  @Column({ length: 250, default: '' })
  addr: string;

  @Column({ type: 'text', default: '' })
  note: string;

  @Column({ type: 'varchar', length: 16, default: 'cash' })
  pay: PayMethod;

  @Column({ type: 'varchar', length: 16, default: 'courier' })
  dlv: DeliveryMethod;

  @Column({ type: 'bigint', default: 0, transformer: bigintToNumber })
  goods: number;

  @Column({ type: 'bigint', default: 0, transformer: bigintToNumber })
  delivery: number;

  @Column({ type: 'bigint', default: 0, transformer: bigintToNumber })
  discount: number;

  @Column({ name: 'bonus_used', type: 'bigint', default: 0, transformer: bigintToNumber })
  bonusUsed: number;

  @Column({ type: 'bigint', default: 0, transformer: bigintToNumber })
  total: number;

  @Column({ name: 'promo_code', length: 32, default: '' })
  promoCode: string;

  @OneToMany(() => OrderItem, (i) => i.order, { cascade: true, eager: true })
  items: OrderItem[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
