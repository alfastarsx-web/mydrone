import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { JwtPayload } from '../../../common/types';
import { AdminGuard } from '../../auth/presentation/admin.guard';
import { CurrentUser } from '../../auth/presentation/current-user.decorator';
import { JwtAuthGuard } from '../../auth/presentation/jwt-auth.guard';
import { CatalogService, ProductQuery } from '../application/catalog.service';
import { Category } from '../infrastructure/category.entity';
import { Product } from '../infrastructure/product.entity';
import { Subcategory } from '../infrastructure/subcategory.entity';

/* ------------ Ochiq (mijozlar uchun) ------------ */

@Controller('categories')
export class CategoriesController {
  constructor(private readonly catalog: CatalogService) {}

  @Get()
  list() {
    return this.catalog.listCategories();
  }
}

@Controller('products')
export class ProductsController {
  constructor(private readonly catalog: CatalogService) {}

  @Get()
  list(@Query() q: ProductQuery) {
    return this.catalog.listProducts(q);
  }

  @Get('brands')
  brands() {
    return this.catalog.brands();
  }

  @Get('suggest')
  suggest(@Query('q') q: string) {
    return this.catalog.suggest(q);
  }

  @Get(':slug')
  one(@Param('slug') slug: string) {
    return this.catalog.bySlug(slug);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/reviews')
  review(
    @Param('id') id: string,
    @Body() dto: { name: string; rate: number; text: string },
    @CurrentUser() user: JwtPayload
  ) {
    return this.catalog.addReview(id, dto, user.sub);
  }
}

/* ------------ Admin ------------ */

@Controller('admin/catalog')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminCatalogController {
  constructor(private readonly catalog: CatalogService) {}

  @Get('products')
  products(@Query() q: ProductQuery) {
    return this.catalog.listProducts({ ...q, limit: q.limit || '200' }, true);
  }

  @Post('products')
  createProduct(@Body() dto: Partial<Product>) {
    return this.catalog.saveProduct(dto);
  }

  @Put('products/:id')
  updateProduct(@Param('id') id: string, @Body() dto: Partial<Product>) {
    return this.catalog.saveProduct({ ...dto, id });
  }

  @Delete('products/:id')
  deleteProduct(@Param('id') id: string) {
    return this.catalog.deleteProduct(id);
  }

  @Post('categories')
  saveCategory(@Body() dto: Partial<Category>) {
    return this.catalog.saveCategory(dto);
  }

  @Delete('categories/:id')
  deleteCategory(@Param('id') id: string) {
    return this.catalog.deleteCategory(id);
  }

  @Post('subcategories')
  saveSub(@Body() dto: Partial<Subcategory>) {
    return this.catalog.saveSubcategory(dto);
  }

  @Delete('subcategories/:id')
  deleteSub(@Param('id') id: string) {
    return this.catalog.deleteSubcategory(id);
  }

  @Get('reviews')
  reviews(@Query('approved') approved?: string) {
    return this.catalog.listReviews(approved === undefined ? undefined : approved === 'true');
  }

  @Put('reviews/:id')
  moderate(@Param('id') id: string, @Body() dto: { approved: boolean }) {
    return this.catalog.moderateReview(id, !!dto.approved);
  }

  @Delete('reviews/:id')
  deleteReview(@Param('id') id: string) {
    return this.catalog.deleteReview(id);
  }
}
