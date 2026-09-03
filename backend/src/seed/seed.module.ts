import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../features/auth/infrastructure/user.entity';
import { Category } from '../features/catalog/infrastructure/category.entity';
import { Product } from '../features/catalog/infrastructure/product.entity';
import { Subcategory } from '../features/catalog/infrastructure/subcategory.entity';
import { Faq } from '../features/content/infrastructure/faq.entity';
import { Post } from '../features/content/infrastructure/post.entity';
import { Setting } from '../features/content/infrastructure/setting.entity';
import { Promo } from '../features/orders/infrastructure/promo.entity';
import { SeedService } from './seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Subcategory, Product, Post, Faq, Setting, Promo, User])],
  providers: [SeedService]
})
export class SeedModule {}
