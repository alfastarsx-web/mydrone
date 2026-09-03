import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Category } from '../infrastructure/category.entity';
import { Product } from '../infrastructure/product.entity';
import { Review } from '../infrastructure/review.entity';
import { Subcategory } from '../infrastructure/subcategory.entity';

export interface ProductQuery {
  cat?: string; sub?: string; brand?: string; stock?: string;
  min?: string; max?: string; q?: string; sort?: string;
  page?: string; limit?: string;
}

@Injectable()
export class CatalogService {
  constructor(
    @InjectRepository(Category) private readonly categories: Repository<Category>,
    @InjectRepository(Subcategory) private readonly subs: Repository<Subcategory>,
    @InjectRepository(Product) private readonly products: Repository<Product>,
    @InjectRepository(Review) private readonly reviews: Repository<Review>
  ) {}

  /* ---------------- Kategoriyalar ---------------- */

  listCategories() {
    return this.categories.find({ order: { sort: 'ASC', id: 'ASC' } });
  }

  async saveCategory(dto: Partial<Category> & { subs?: Partial<Subcategory>[] }) {
    if (!dto.id) throw new BadRequestException('Kategoriya identifikatori (slug) kerak');
    const cat = await this.categories.save(this.categories.create({
      id: dto.id, nameUz: dto.nameUz!, nameRu: dto.nameRu || dto.nameUz!,
      img: dto.img || '', icon: dto.icon || 'box', sort: dto.sort ?? 0
    }));
    return this.categories.findOne({ where: { id: cat.id } });
  }

  async deleteCategory(id: string) {
    const used = await this.products.count({ where: { categoryId: id } });
    if (used) throw new BadRequestException(`Bu kategoriyada ${used} ta mahsulot bor — avval ularni ko'chiring`);
    await this.categories.delete({ id });
    return { ok: true };
  }

  async saveSubcategory(dto: Partial<Subcategory>) {
    if (!dto.id || !dto.categoryId) throw new BadRequestException('id va categoryId kerak');
    return this.subs.save(this.subs.create({
      id: dto.id, categoryId: dto.categoryId,
      nameUz: dto.nameUz!, nameRu: dto.nameRu || dto.nameUz!, sort: dto.sort ?? 0
    }));
  }

  async deleteSubcategory(id: string) {
    await this.products.update({ subId: id }, { subId: null });
    await this.subs.delete({ id });
    return { ok: true };
  }

  /* ---------------- Mahsulotlar ---------------- */

  async listProducts(q: ProductQuery, includeInactive = false) {
    const qb = this.products.createQueryBuilder('p');
    if (!includeInactive) qb.andWhere('p.active = true');
    if (q.cat) qb.andWhere('p.category_id = :cat', { cat: q.cat });
    if (q.sub) qb.andWhere('p.sub_id = :sub', { sub: q.sub });

    const brands = (q.brand || '').split(',').filter(Boolean);
    if (brands.length) qb.andWhere('p.brand IN (:...brands)', { brands });

    const stocks = (q.stock || '').split(',').filter(Boolean);
    if (stocks.length) qb.andWhere('p.stock IN (:...stocks)', { stocks });

    if (q.min) qb.andWhere('p.price >= :min', { min: Number(q.min) });
    if (q.max) qb.andWhere('p.price <= :max', { max: Number(q.max) });
    if (q.q) {
      qb.andWhere('(p.name_uz ILIKE :s OR p.name_ru ILIKE :s OR p.brand ILIKE :s OR p.slug ILIKE :s)',
        { s: `%${q.q}%` });
    }

    const sorts: Record<string, [string, 'ASC' | 'DESC']> = {
      pop: ['p.sold', 'DESC'], new: ['p.created_at', 'DESC'],
      cheap: ['p.price', 'ASC'], exp: ['p.price', 'DESC'], rate: ['p.rating', 'DESC']
    };
    const [field, dir] = sorts[q.sort || 'pop'] || sorts.pop;
    qb.orderBy(field, dir);

    const page = Math.max(1, Number(q.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(q.limit) || 60));
    qb.skip((page - 1) * limit).take(limit);

    const [items, total] = await qb.getManyAndCount();
    return { items, total, page, pages: Math.ceil(total / limit) || 1 };
  }

  async bySlug(slug: string) {
    const product = await this.products.findOne({ where: { slug } });
    if (!product) throw new NotFoundException('Mahsulot topilmadi');
    const reviews = await this.reviews.find({
      where: { productId: product.id, approved: true },
      order: { createdAt: 'DESC' }, take: 20
    });
    return { ...product, reviews };
  }

  async saveProduct(dto: Partial<Product> & { id?: string }) {
    if (!dto.nameUz || !dto.price) throw new BadRequestException('Nomi va narxi majburiy');
    const slug = (dto.slug || dto.nameUz).toLowerCase()
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const clash = await this.products.findOne({ where: { slug } });
    if (clash && clash.id !== dto.id) throw new BadRequestException('Bunday slug allaqachon bor');

    const entity = dto.id
      ? await this.products.findOne({ where: { id: dto.id } })
      : this.products.create();
    if (!entity) throw new NotFoundException('Mahsulot topilmadi');

    Object.assign(entity, {
      slug,
      categoryId: dto.categoryId ?? entity.categoryId,
      subId: dto.subId ?? entity.subId ?? null,
      brand: dto.brand ?? entity.brand ?? '',
      nameUz: dto.nameUz, nameRu: dto.nameRu || dto.nameUz,
      price: Number(dto.price), oldPrice: Number(dto.oldPrice || 0),
      stock: dto.stock ?? entity.stock ?? 'in',
      qty: Number(dto.qty ?? entity.qty ?? 0),
      lead: Number(dto.lead ?? entity.lead ?? 0),
      isNew: dto.isNew ?? entity.isNew ?? false,
      isHit: dto.isHit ?? entity.isHit ?? false,
      imgs: dto.imgs?.length ? dto.imgs : (entity.imgs?.length ? entity.imgs : ['drone-air-1.jpg']),
      shortUz: dto.shortUz ?? entity.shortUz ?? '',
      shortRu: dto.shortRu || dto.shortUz || entity.shortRu || '',
      specs: dto.specs ?? entity.specs ?? [],
      active: dto.active ?? entity.active ?? true
    });
    return this.products.save(entity);
  }

  async deleteProduct(id: string) {
    await this.products.delete({ id });
    return { ok: true };
  }

  /** Qidiruv taklifi (autocomplete) */
  suggest(term: string) {
    if (!term || term.trim().length < 2) return Promise.resolve([]);
    const s = `%${term.trim()}%`;
    return this.products.find({
      where: [
        { nameUz: ILike(s), active: true },
        { nameRu: ILike(s), active: true },
        { brand: ILike(s), active: true }
      ],
      take: 6
    });
  }

  /* ---------------- Sharhlar ---------------- */

  async addReview(productId: string, dto: { name: string; rate: number; text: string }, userId?: string) {
    const product = await this.products.findOne({ where: { id: productId } });
    if (!product) throw new NotFoundException('Mahsulot topilmadi');
    const review = await this.reviews.save(this.reviews.create({
      productId, userId: userId || null,
      name: dto.name, rate: Math.min(5, Math.max(1, Number(dto.rate) || 5)),
      text: String(dto.text || ''), approved: false
    }));
    return review;
  }

  listReviews(approved?: boolean) {
    return this.reviews.find({
      where: approved === undefined ? {} : { approved },
      order: { createdAt: 'DESC' }, take: 200
    });
  }

  async moderateReview(id: string, approved: boolean) {
    const review = await this.reviews.findOne({ where: { id } });
    if (!review) throw new NotFoundException();
    review.approved = approved;
    await this.reviews.save(review);
    await this.recalcRating(review.productId);
    return review;
  }

  async deleteReview(id: string) {
    const review = await this.reviews.findOne({ where: { id } });
    if (review) {
      await this.reviews.delete({ id });
      await this.recalcRating(review.productId);
    }
    return { ok: true };
  }

  /** Mahsulot reytingi tasdiqlangan sharhlardan qayta hisoblanadi */
  private async recalcRating(productId: string) {
    const rows = await this.reviews.find({ where: { productId, approved: true } });
    const product = await this.products.findOne({ where: { id: productId } });
    if (!product) return;
    product.reviewsCount = rows.length;
    product.rating = rows.length
      ? Number((rows.reduce((s, r) => s + r.rate, 0) / rows.length).toFixed(2))
      : 5;
    await this.products.save(product);
  }

  /** Buyurtma berilganda zaxirani kamaytirish */
  async decreaseStock(productId: string, qty: number) {
    const product = await this.products.findOne({ where: { id: productId } });
    if (!product) return;
    product.sold = (product.sold || 0) + qty;
    if (product.stock === 'in') {
      product.qty = Math.max(0, product.qty - qty);
      if (product.qty === 0) product.stock = 'out';
    }
    await this.products.save(product);
  }

  brands() {
    return this.products
      .createQueryBuilder('p')
      .select('DISTINCT p.brand', 'brand')
      .where("p.brand <> ''")
      .orderBy('brand', 'ASC')
      .getRawMany()
      .then((rows) => rows.map((r) => r.brand));
  }
}
