import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { runInNewContext } from 'node:vm';
import * as bcrypt from 'bcryptjs';
import { User } from '../features/auth/infrastructure/user.entity';
import { Category } from '../features/catalog/infrastructure/category.entity';
import { Product } from '../features/catalog/infrastructure/product.entity';
import { Subcategory } from '../features/catalog/infrastructure/subcategory.entity';
import { Faq } from '../features/content/infrastructure/faq.entity';
import { Post } from '../features/content/infrastructure/post.entity';
import { Setting } from '../features/content/infrastructure/setting.entity';
import { Promo } from '../features/orders/infrastructure/promo.entity';

/**
 * Demo katalogni bazaga yozadi.
 *
 * Ma'lumot manbai — frontend'dagi `assets/js/data.js` fayli. Shu tufayli
 * katalog bitta joyda turadi: backend'siz ishlaganda ham, baza bilan
 * ishlaganda ham bir xil mahsulotlar ko'rinadi.
 */
@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger('Seed');

  constructor(
    @InjectRepository(Category) private readonly categories: Repository<Category>,
    @InjectRepository(Subcategory) private readonly subs: Repository<Subcategory>,
    @InjectRepository(Product) private readonly products: Repository<Product>,
    @InjectRepository(Post) private readonly posts: Repository<Post>,
    @InjectRepository(Faq) private readonly faqs: Repository<Faq>,
    @InjectRepository(Setting) private readonly settings: Repository<Setting>,
    @InjectRepository(Promo) private readonly promos: Repository<Promo>,
    @InjectRepository(User) private readonly users: Repository<User>
  ) {}

  async onModuleInit() {
    if (process.env.SEED_DEMO === 'false') return;
    await this.seedAdmin();
    if (await this.products.count()) return; // allaqachon to'ldirilgan
    await this.seedCatalog();
  }

  /** data.js faylini o'qib, window.SEED obyektini qaytaradi */
  private loadSeedFile(): any | null {
    const path = join(process.cwd(), '..', 'assets', 'js', 'data.js');
    try {
      const code = readFileSync(path, 'utf8');
      const sandbox: any = { window: {} };
      runInNewContext(code, sandbox, { timeout: 5000 });
      return sandbox.window.SEED || null;
    } catch (e) {
      this.logger.warn(`data.js o'qilmadi (${path}) — demo katalog o'tkazib yuborildi`);
      return null;
    }
  }

  private async seedAdmin() {
    const email = 'admin@mydrone.uz';
    if (await this.users.findOne({ where: { email } })) return;
    await this.users.save(this.users.create({
      name: 'Administrator', email,
      passwordHash: await bcrypt.hash('admin12345', 10),
      phone: '+998 90 123 45 67', role: 'admin', refCode: 'ADMIN001', bonus: 0
    }));
    this.logger.log(`Administrator yaratildi: ${email} / admin12345`);
  }

  private async seedCatalog() {
    const SEED = this.loadSeedFile();
    if (!SEED) return;

    /* Sozlamalar */
    for (const [key, value] of Object.entries(SEED.settings || {})) {
      await this.settings.save(this.settings.create({ key, value: value as unknown }));
    }

    /* Kategoriyalar va subkategoriyalar */
    let sort = 0;
    for (const c of SEED.categories || []) {
      await this.categories.save(this.categories.create({
        id: c.id, nameUz: c.name_uz, nameRu: c.name_ru, img: c.img, icon: c.icon, sort: sort++
      }));
      let ssort = 0;
      for (const s of c.subs || []) {
        await this.subs.save(this.subs.create({
          id: s.id, categoryId: c.id, nameUz: s.name_uz, nameRu: s.name_ru, sort: ssort++
        }));
      }
    }

    /* Mahsulotlar */
    for (const p of SEED.products || []) {
      await this.products.save(this.products.create({
        slug: p.slug, categoryId: p.cat, subId: p.sub || null, brand: p.brand,
        nameUz: p.name_uz, nameRu: p.name_ru,
        price: p.price, oldPrice: p.old || 0,
        stock: p.stock, qty: p.qty || 0, lead: p.lead || 0,
        rating: p.rating || 5, reviewsCount: p.reviews || 0, sold: p.sold || 0,
        isNew: !!p.isNew, isHit: !!p.isHit,
        imgs: p.imgs || [], shortUz: p.short_uz || '', shortRu: p.short_ru || '',
        specs: p.specs || [], active: true
      }));
    }

    /* Blog */
    for (const b of SEED.posts || []) {
      await this.posts.save(this.posts.create({
        slug: b.slug, img: b.img, date: b.date,
        catUz: b.cat_uz, catRu: b.cat_ru,
        titleUz: b.title_uz, titleRu: b.title_ru,
        leadUz: b.lead_uz, leadRu: b.lead_ru,
        bodyUz: b.body_uz, bodyRu: b.body_ru, published: true
      }));
    }

    /* Ko'p so'raladigan savollar */
    let fsort = 0;
    for (const f of SEED.faq || []) {
      await this.faqs.save(this.faqs.create({
        qUz: f.q_uz, qRu: f.q_ru, aUz: f.a_uz, aRu: f.a_ru, sort: fsort++
      }));
    }

    /* Promokodlar */
    await this.promos.save([
      this.promos.create({ code: 'SALOM10', type: 'percent', value: 10, active: true,
        noteUz: 'Birinchi xarid uchun 10%', noteRu: 'Первая покупка −10%' }),
      this.promos.create({ code: 'DRON500', type: 'fixed', value: 500000, active: true,
        noteUz: "500 000 so'm chegirma", noteRu: 'Скидка 500 000 сум' })
    ]);

    this.logger.log(`Demo katalog yozildi: ${(SEED.products || []).length} mahsulot, ` +
      `${(SEED.categories || []).length} kategoriya, ${(SEED.posts || []).length} maqola`);
  }
}
