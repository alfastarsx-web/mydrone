import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

/** JwtAuthGuard dan keyin ishlatiladi — faqat admin roliga ruxsat */
@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();
    if (req.user?.role !== 'admin') throw new ForbiddenException('Faqat administrator uchun');
    return true;
  }
}
