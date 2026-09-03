import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../auth/infrastructure/user.entity';
import { Product } from '../../catalog/infrastructure/product.entity';
import { Lead } from '../../content/infrastructure/lead.entity';
import { Order } from '../../orders/infrastructure/order.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Order) private readonly orders: Repository<Order>,
    @InjectRepository(Product) private readonly products: Repository<Product>,
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Lead) private readonly leads: Repository<Lead>
  ) {}

  async summary() {
    const all = await this.orders.find({ order: { createdAt: 'DESC' } });
    const paid = all.filter((o) => o.status !== 'cancel');
    const revenue = paid.reduce((s, o) => s + o.total, 0);

    /* oxirgi 7 kun bo'yicha buyurtmalar soni */
    const days: { day: string; count: number; sum: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const rows = all.filter((o) => o.createdAt.toISOString().slice(0, 10) === key);
      days.push({ day: key, count: rows.length, sum: rows.reduce((s, o) => s + o.total, 0) });
    }

    const top = await this.products.find({ order: { sold: 'DESC' }, take: 6 });
    const low = await this.products
      .createQueryBuilder('p')
      .where("p.stock = 'in' AND p.qty <= 5")
      .orderBy('p.qty', 'ASC')
      .take(6)
      .getMany();

    return {
      orders: all.length,
      newOrders: all.filter((o) => o.status === 'new').length,
      revenue,
      avgCheck: paid.length ? Math.round(revenue / paid.length) : 0,
      customers: await this.users.count({ where: { role: 'customer' } }),
      leads: await this.leads.count({ where: { handled: false } }),
      products: await this.products.count(),
      days,
      top: top.map((p) => ({ id: p.id, name: p.nameUz, sold: p.sold, slug: p.slug })),
      lowStock: low.map((p) => ({ id: p.id, name: p.nameUz, qty: p.qty })),
      recent: all.slice(0, 6).map((o) => ({
        id: o.id, name: o.name, total: o.total, status: o.status, createdAt: o.createdAt
      }))
    };
  }
}
