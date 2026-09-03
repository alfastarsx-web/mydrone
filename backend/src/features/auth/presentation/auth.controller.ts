import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtPayload } from '../../../common/types';
import { AuthService } from '../application/auth.service';
import { AdminGuard } from './admin.guard';
import { CurrentUser } from './current-user.decorator';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  register(@Body() dto: { name: string; email: string; password: string; phone?: string; ref?: string }) {
    return this.auth.register(dto);
  }

  @Post('login')
  login(@Body() dto: { email: string; password: string }) {
    return this.auth.login(dto.email, dto.password);
  }

  @Post('refresh')
  refresh(@Body() dto: { refresh: string }) {
    return this.auth.refresh(dto.refresh);
  }

  @Post('logout')
  logout(@Body() dto: { refresh: string }) {
    return this.auth.logout(dto.refresh);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@CurrentUser() user: JwtPayload) {
    return this.auth.me(user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  update(@CurrentUser() user: JwtPayload, @Body() dto: { name?: string; phone?: string; email?: string }) {
    return this.auth.updateProfile(user.sub, dto);
  }
}

@Controller('users')
@UseGuards(JwtAuthGuard, AdminGuard)
export class UsersController {
  constructor(private readonly auth: AuthService) {}

  @Get()
  list() {
    return this.auth.list();
  }
}
