import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { bigintToNumber } from '../../../common/transformers';
import { Order } from './order.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'order_id', length: 24 })
  orderId: string;

  @Column({ name: 'product_id', type: 'uuid', nullable: true })
  productId: string | null;

  /** Mahsulot keyin o'chirilsa ham buyurtmada nomi qolishi uchun */
  @Column({ name: 'name_snapshot', length: 200, default: '' })
  nameSnapshot: string;

  @Column({ name: 'slug_snapshot', length: 160, default: '' })
  slugSnapshot: string;

  @Column({ name: 'img_snapshot', length: 160, default: '' })
  imgSnapshot: string;

  @Column({ type: 'int', default: 1 })
  qty: number;

  /** Buyurtma paytidagi narx — keyin narx o'zgarsa ham o'zgarmaydi */
  @Column({ type: 'bigint', transformer: bigintToNumber })
  price: number;

  @ManyToOne(() => Order, (o) => o.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;
}
