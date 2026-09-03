import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../auth/infrastructure/user.entity';
import { Product } from '../catalog/infrastructure/product.entity';
import { Lead } from '../content/infrastructure/lead.entity';
import { Order } from '../orders/infrastructure/order.entity';
import { DashboardService } from './application/dashboard.service';
import { DashboardController } from './presentation/dashboard.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Product, User, Lead])],
  controllers: [DashboardController],
  providers: [DashboardService]
})
export class DashboardModule {}
