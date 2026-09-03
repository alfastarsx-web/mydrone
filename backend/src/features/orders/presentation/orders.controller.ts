import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload, OrderStatus } from '../../../common/types';
import { AdminGuard } from '../../auth/presentation/admin.guard';
import { CurrentUser } from '../../auth/presentation/current-user.decorator';
import { JwtAuthGuard } from '../../auth/presentation/jwt-auth.guard';
import { CreateOrderDto, OrdersService } from '../application/orders.service';
import { Promo } from '../infrastructure/promo.entity';

@Controller('orders')
export class OrdersController {
  constructor(private readonly orders: OrdersService, private readonly jwt: JwtService) {}

  /** Buyurtma mehmon sifatida ham, tizimga kirgan holda ham beriladi */
  @Post()
  async create(@Body() dto: CreateOrderDto, @Req() req: any) {
    let userId: string | undefined;
    const header = String(req.headers.authorization || '');
    if (header.startsWith('Bearer ')) {
      try {
        const payload = await this.jwt.verifyAsync<JwtPayload>(header.slice(7), { secret: process.env.JWT_SECRET });
        userId = payload.sub;
      } catch { /* mehmon sifatida davom etadi */ }
    }
    return this.orders.create(dto, userId);
  }

  @Get('promo/:code')
  promo(@Param('code') code: string) {
    return this.orders.checkPromo(code);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  my(@CurrentUser() user: JwtPayload) {
    return this.orders.myOrders(user.sub);
  }

  @Get(':id')
  one(@Param('id') id: string) {
    return this.orders.byId(id);
  }
}

@Controller('admin/orders')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminOrdersController {
  constructor(private readonly orders: OrdersService) {}

  @Get()
  list(@Query('status') status?: OrderStatus) {
    return this.orders.list(status);
  }

  @Put(':id/status')
  status(@Param('id') id: string, @Body() dto: { status: OrderStatus }) {
    return this.orders.setStatus(id, dto.status);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orders.remove(id);
  }
}

@Controller('admin/promos')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminPromosController {
  constructor(private readonly orders: OrdersService) {}

  @Get()
  list() {
    return this.orders.listPromos();
  }

  @Post()
  save(@Body() dto: Partial<Promo>) {
    return this.orders.savePromo(dto);
  }

  @Delete(':code')
  remove(@Param('code') code: string) {
    return this.orders.deletePromo(code);
  }
}
