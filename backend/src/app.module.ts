import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './features/auth/auth.module';
import { CatalogModule } from './features/catalog/catalog.module';
import { ContentModule } from './features/content/content.module';
import { DashboardModule } from './features/dashboard/dashboard.module';
import { OrdersModule } from './features/orders/orders.module';
import { RootController } from './root.controller';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || '127.0.0.1',
      port: Number(process.env.DB_PORT || 5432),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'mydrone',
      autoLoadEntities: true,
      synchronize: process.env.TYPEORM_SYNC !== 'false'
    }),
    AuthModule,
    CatalogModule,
    ContentModule,
    OrdersModule,
    DashboardModule,
    SeedModule
  ],
  controllers: [RootController]
})
export class AppModule {}
