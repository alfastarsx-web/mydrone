import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderStatus } from '../../../common/types';
import { CatalogService } from '../../catalog/application/catalog.service';
import { Product } from '../../catalog/infrastructure/product.entity';
import { User } from '../../auth/infrastructure/user.entity';
import { Setting } from '../../content/infrastructure/setting.entity';
import { Order } from '../infrastructure/order.entity';
import { OrderItem } from '../infrastructure/order-item.entity';
import { Promo } from '../infrastructure/promo.entity';

interface CartLine { productId: string; qty: number }

export interface CreateOrderDto {
  name: string; phone: string; email?: string;
  region?: string; city?: string; addr?: string; note?: string;
  pay: 'cash' | 'click' | 'payme' | 'card';
  dlv: 'courier' | 'region' | 'pickup';
  items: CartLine[];
  promo?: string;
  useBonus?: boolean;
}

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly orders: Repository<Order>,
    @InjectRepository(OrderItem) private readonly items: Repository<OrderItem>,
    @InjectRepository(Promo) private readonly promos: Repository<Promo>,
    @InjectRepository(Product) private readonly products: Repository<Product>,
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Setting) private readonly settings: Repository<Setting>,
    private readonly catalog: CatalogService
  ) {}

  private async setting<T>(key: string, fallback: T): Promise<T> {
    const row = await this.settings.findOne({ where: { key } });
    return (row?.value as T) ?? fallback;
  }

  /** Promokodni tekshirish — savatda ham, buyurtmada ham shu ishlatiladi */
  async checkPromo(code: string) {
    const promo = await this.promos.findOne({ where: { code: String(code || '').toUpperCase().trim() } });
    if (!promo || !promo.active) throw new NotFoundException('Promokod topilmadi');
    if (promo.expiresAt && promo.expiresAt.getTime() < Date.now()) {
      throw new BadRequestException('Promokod muddati tugagan');
    }
    return promo;
  }

  /** Narxlarni serverda qayta hisoblaymiz — brauzerdan kelgan summaga ishonmaymiz */
  private async calcTotals(lines: CartLine[], dlv: string, promo: Promo | null, bonusAvailable: number, useBonus: boolean) {
    if (!lines?.length) throw new BadRequestException('Savat bo\'sh');

    const products = await this.products.findByIds(lines.map((l) => l.productId));
    const byId = new Map(products.map((p) => [p.id, p]));

    let goods = 0;
    const rows = lines.map((l) => {
      const p = byId.get(l.productId);
      if (!p) throw new BadRequestException('Mahsulot topilmadi: ' + l.productId);
      if (p.stock === 'out') throw new BadRequestException(`"${p.nameUz}" hozir mavjud emas`);
      const qty = Math.max(1, Math.min(99, Number(l.qty) || 1));
      goods += p.price * qty;
      return { product: p, qty };
    });

    const freeFrom = await this.setting<number>('freeFrom', 5000000);
    const tashkent = await this.setting<number>('deliveryTashkent', 30000);
    const region = await this.setting<number>('deliveryRegion', 55000);

    let delivery = 0;
    if (dlv === 'courier') delivery = goods >= freeFrom ? 0 : tashkent;
    if (dlv === 'region') delivery = goods >= freeFrom ? 0 : region;

    let discount = 0;
    if (promo) {
      discount = promo.type === 'percent'
        ? Math.round((goods * promo.value) / 100)
        : Math.min(promo.value, goods);
    }

    const bonusUsed = useBonus ? Math.min(bonusAvailable, Math.max(0, goods - discount)) : 0;
    const total = Math.max(0, goods - discount - bonusUsed) + delivery;
    return { rows, goods, delivery, discount, bonusUsed, total };
  }

  private async nextId() {
    const count = await this.orders.count();
    return 'DM-' + (24100 + count + 1);
  }

  async create(dto: CreateOrderDto, userId?: string) {
    if (!dto.name?.trim()) throw new BadRequestException('Ism kiritilmagan');
    if (String(dto.phone || '').replace(/\D/g, '').length < 12) throw new BadRequestException('Telefon raqami to\'liq emas');
    if (dto.dlv !== 'pickup' && !dto.addr?.trim()) throw new BadRequestException('Manzil kiritilmagan');

    const user = userId ? await this.users.findOne({ where: { id: userId } }) : null;
    const promo = dto.promo ? await this.checkPromo(dto.promo) : null;
    const t = await this.calcTotals(dto.items, dto.dlv, promo, user?.bonus || 0, !!dto.useBonus && !!user);

    const order = await this.orders.save(this.orders.create({
      id: await this.nextId(),
      userId: user?.id || null,
      status: 'new',
      name: dto.name.trim(), phone: dto.phone, email: dto.email || '',
      region: dto.region || '', city: dto.city || '', addr: dto.addr || '', note: dto.note || '',
      pay: dto.pay, dlv: dto.dlv,
      goods: t.goods, delivery: t.delivery, discount: t.discount,
      bonusUsed: t.bonusUsed, total: t.total,
      promoCode: promo?.code || ''
    }));

    await this.items.save(t.rows.map((r) => this.items.create({
      orderId: order.id,
      productId: r.product.id,
      nameSnapshot: r.product.nameUz,
      slugSnapshot: r.product.slug,
      imgSnapshot: r.product.imgs?.[0] || '',
      qty: r.qty,
      price: r.product.price
    })));

    for (const r of t.rows) await this.catalog.decreaseStock(r.product.id, r.qty);

    if (promo) {
      promo.usedCount += 1;
      await this.promos.save(promo);
    }
    if (user && t.bonusUsed) {
      user.bonus = Math.max(0, user.bonus - t.bonusUsed);
      await this.users.save(user);
    }

    return this.byId(order.id);
  }

  async byId(id: string) {
    const order = await this.orders.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Buyurtma topilmadi');
    return order;
  }

  myOrders(userId: string) {
    return this.orders.find({ where: { userId }, order: { createdAt: 'DESC' } });
  }

  list(status?: OrderStatus) {
    return this.orders.find({
      where: status ? { status } : {},
      order: { createdAt: 'DESC' },
      take: 300
    });
  }

  /** Holat o'zgarishi. "done" bo'lganda taklif qilgan mijozga referal bonus yoziladi. */
  async setStatus(id: string, status: OrderStatus) {
    const order = await this.byId(id);
    const was = order.status;
    order.status = status;
    await this.orders.save(order);

    if (status === 'done' && was !== 'done' && order.userId) {
      const buyer = await this.users.findOne({ where: { id: order.userId } });
      if (buyer?.refBy) {
        const inviter = await this.users.findOne({ where: { id: buyer.refBy } });
        if (inviter) {
          const percent = await this.setting<number>('refPercent', 3);
          const bonus = Math.round((order.total * percent) / 100);
          inviter.bonus += bonus;
          inviter.earned += bonus;
          await this.users.save(inviter);
        }
      }
    }
    return order;
  }

  async remove(id: string) {
    await this.orders.delete({ id });
    return { ok: true };
  }

  /* -------- Promokodlar (admin) -------- */

  listPromos() {
    return this.promos.find({ order: { createdAt: 'DESC' } });
  }

  savePromo(dto: Partial<Promo>) {
    if (!dto.code) throw new BadRequestException('Kod kerak');
    return this.promos.save(this.promos.create({
      code: dto.code.toUpperCase().trim(),
      type: dto.type || 'percent',
      value: Number(dto.value || 0),
      active: dto.active ?? true,
      noteUz: dto.noteUz || '', noteRu: dto.noteRu || dto.noteUz || '',
      expiresAt: dto.expiresAt || null
    }));
  }

  async deletePromo(code: string) {
    await this.promos.delete({ code });
    return { ok: true };
  }
}
