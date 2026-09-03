import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogModule } from '../catalog/catalog.module';
import { ContentModule } from '../content/content.module';
import { OrdersService } from './application/orders.service';
import { Order } from './infrastructure/order.entity';
import { OrderItem } from './infrastructure/order-item.entity';
import { Promo } from './infrastructure/promo.entity';
import { AdminOrdersController, AdminPromosController, OrdersController } from './presentation/orders.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, Promo]), CatalogModule, ContentModule],
  controllers: [OrdersController, AdminOrdersController, AdminPromosController],
  providers: [OrdersService],
  exports: [OrdersService, TypeOrmModule]
})
export class OrdersModule {}
