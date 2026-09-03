import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './application/auth.service';
import { RefreshToken } from './infrastructure/refresh-token.entity';
import { User } from './infrastructure/user.entity';
import { AuthController, UsersController } from './presentation/auth.controller';
import { JwtAuthGuard } from './presentation/jwt-auth.guard';
import { AdminGuard } from './presentation/admin.guard';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([User, RefreshToken]),
    JwtModule.register({ global: true })
  ],
  controllers: [AuthController, UsersController],
  providers: [AuthService, JwtAuthGuard, AdminGuard],
  exports: [AuthService, JwtAuthGuard, AdminGuard, TypeOrmModule]
})
export class AuthModule {}
