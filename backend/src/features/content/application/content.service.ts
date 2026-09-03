import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Faq } from '../infrastructure/faq.entity';
import { Lead } from '../infrastructure/lead.entity';
import { Post } from '../infrastructure/post.entity';
import { Setting } from '../infrastructure/setting.entity';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(Post) private readonly posts: Repository<Post>,
    @InjectRepository(Faq) private readonly faqs: Repository<Faq>,
    @InjectRepository(Setting) private readonly settings: Repository<Setting>,
    @InjectRepository(Lead) private readonly leads: Repository<Lead>
  ) {}

  /* -------- Blog -------- */

  listPosts(all = false) {
    return this.posts.find({
      where: all ? {} : { published: true },
      order: { date: 'DESC' }
    });
  }

  async post(slug: string) {
    const post = await this.posts.findOne({ where: { slug } });
    if (!post) throw new NotFoundException('Maqola topilmadi');
    return post;
  }

  async savePost(dto: Partial<Post> & { id?: string }) {
    if (!dto.titleUz) throw new BadRequestException('Sarlavha kerak');
    const slug = (dto.slug || dto.titleUz).toLowerCase()
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const entity = dto.id ? await this.posts.findOne({ where: { id: dto.id } }) : this.posts.create();
    if (!entity) throw new NotFoundException('Maqola topilmadi');
    Object.assign(entity, {
      slug,
      img: dto.img ?? entity.img ?? '',
      date: dto.date || entity.date || new Date().toISOString().slice(0, 10),
      catUz: dto.catUz ?? entity.catUz ?? '', catRu: dto.catRu || dto.catUz || entity.catRu || '',
      titleUz: dto.titleUz, titleRu: dto.titleRu || dto.titleUz,
      leadUz: dto.leadUz ?? entity.leadUz ?? '', leadRu: dto.leadRu ?? entity.leadRu ?? '',
      bodyUz: dto.bodyUz ?? entity.bodyUz ?? '', bodyRu: dto.bodyRu ?? entity.bodyRu ?? '',
      published: dto.published ?? entity.published ?? true
    });
    return this.posts.save(entity);
  }

  async deletePost(id: string) {
    await this.posts.delete({ id });
    return { ok: true };
  }

  /* -------- FAQ -------- */

  listFaq() {
    return this.faqs.find({ order: { sort: 'ASC' } });
  }

  saveFaq(dto: Partial<Faq>) {
    return this.faqs.save(this.faqs.create(dto));
  }

  async deleteFaq(id: string) {
    await this.faqs.delete({ id });
    return { ok: true };
  }

  /* -------- Sozlamalar -------- */

  async allSettings(): Promise<Record<string, unknown>> {
    const rows = await this.settings.find();
    return Object.fromEntries(rows.map((r) => [r.key, r.value]));
  }

  async saveSettings(dto: Record<string, unknown>) {
    for (const [key, value] of Object.entries(dto)) {
      await this.settings.save(this.settings.create({ key, value }));
    }
    return this.allSettings();
  }

  /* -------- Murojaatlar -------- */

  async addLead(dto: { type?: 'callback' | 'contact'; name: string; phone: string; msg?: string }) {
    if (!dto.name?.trim() || !dto.phone?.trim()) throw new BadRequestException('Ism va telefon kerak');
    return this.leads.save(this.leads.create({
      type: dto.type || 'callback',
      name: dto.name.trim(),
      phone: dto.phone.trim(),
      msg: dto.msg || ''
    }));
  }

  listLeads() {
    return this.leads.find({ order: { createdAt: 'DESC' }, take: 300 });
  }

  async handleLead(id: string, handled: boolean) {
    const lead = await this.leads.findOne({ where: { id } });
    if (!lead) throw new NotFoundException();
    lead.handled = handled;
    return this.leads.save(lead);
  }
}
