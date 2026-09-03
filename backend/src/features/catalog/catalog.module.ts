import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogService } from './application/catalog.service';
import { Category } from './infrastructure/category.entity';
import { Product } from './infrastructure/product.entity';
import { Review } from './infrastructure/review.entity';
import { Subcategory } from './infrastructure/subcategory.entity';
import { AdminCatalogController, CategoriesController, ProductsController } from './presentation/catalog.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Subcategory, Product, Review])],
  controllers: [CategoriesController, ProductsController, AdminCatalogController],
  providers: [CatalogService],
  exports: [CatalogService, TypeOrmModule]
})
export class CatalogModule {}
