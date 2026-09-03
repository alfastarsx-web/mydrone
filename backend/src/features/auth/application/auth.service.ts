import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { randomBytes } from 'node:crypto';
import { JwtPayload } from '../../../common/types';
import { RefreshToken } from '../infrastructure/refresh-token.entity';
import { User } from '../infrastructure/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(RefreshToken) private readonly tokens: Repository<RefreshToken>,
    private readonly jwt: JwtService
  ) {}

  /** Foydalanuvchini tashqariga chiqarish shakli — parol hech qachon qaytmaydi */
  publicUser(u: User) {
    return {
      id: u.id, name: u.name, email: u.email, phone: u.phone, role: u.role,
      ref: u.refCode, bonus: u.bonus, invited: u.invitedCount, earned: u.earned,
      created: u.createdAt
    };
  }

  private async makeRefCode(name: string): Promise<string> {
    const base = (name.replace(/[^A-Za-z]/g, '').toUpperCase().slice(0, 4) || 'DRON');
    for (let i = 0; i < 20; i++) {
      const code = base + Math.floor(1000 + Math.random() * 9000);
      if (!(await this.users.findOne({ where: { refCode: code } }))) return code;
    }
    return base + randomBytes(3).toString('hex').toUpperCase();
  }

  private async issue(user: User) {
    const payload: JwtPayload = { sub: user.id, email: user.email, role: user.role };
    const access = await this.jwt.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES || '15m'
    });
    const refresh = randomBytes(48).toString('hex');
    const days = Number((process.env.JWT_REFRESH_EXPIRES || '30d').replace(/\D/g, '')) || 30;
    await this.tokens.save(this.tokens.create({
      userId: user.id,
      token: refresh,
      expiresAt: new Date(Date.now() + days * 864e5)
    }));
    return { access, refresh, user: this.publicUser(user) };
  }

  async register(dto: { name: string; email: string; password: string; phone?: string; ref?: string }) {
    const email = String(dto.email || '').trim().toLowerCase();
    if (!dto.name || !email || !dto.password) throw new BadRequestException('Ism, email va parol majburiy');
    if (String(dto.password).length < 6) throw new BadRequestException('Parol kamida 6 belgidan iborat bo\'lsin');
    if (await this.users.findOne({ where: { email } })) throw new BadRequestException('Bu email allaqachon ro\'yxatdan o\'tgan');

    const inviter = dto.ref
      ? await this.users.findOne({ where: { refCode: String(dto.ref).toUpperCase().trim() } })
      : null;

    const bonusNew = 100000; // yangi mijozga chegirma (sozlamalardan olinadi)
    const user = await this.users.save(this.users.create({
      name: String(dto.name).trim(),
      email,
      passwordHash: await bcrypt.hash(String(dto.password), 10),
      phone: dto.phone || '',
      role: 'customer',
      refCode: await this.makeRefCode(dto.name),
      refBy: inviter ? inviter.id : null,
      bonus: inviter ? bonusNew : 0
    }));

    if (inviter) {
      inviter.invitedCount = (inviter.invitedCount || 0) + 1;
      await this.users.save(inviter);
    }
    return this.issue(user);
  }

  async login(email: string, password: string) {
    const user = await this.users.findOne({ where: { email: String(email || '').trim().toLowerCase() } });
    if (!user || !(await bcrypt.compare(String(password || ''), user.passwordHash))) {
      throw new UnauthorizedException('Email yoki parol noto\'g\'ri');
    }
    return this.issue(user);
  }

  async refresh(token: string) {
    const row = await this.tokens.findOne({ where: { token: String(token || '') } });
    if (!row || row.expiresAt.getTime() < Date.now()) throw new UnauthorizedException('Sessiya muddati tugagan');
    const user = await this.users.findOne({ where: { id: row.userId } });
    if (!user) throw new UnauthorizedException('Foydalanuvchi topilmadi');
    await this.tokens.delete({ id: row.id }); // bir martalik — aylantirib beriladi
    return this.issue(user);
  }

  async logout(token: string) {
    if (token) await this.tokens.delete({ token });
    return { ok: true };
  }

  async me(userId: string) {
    const user = await this.users.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException();
    return this.publicUser(user);
  }

  async updateProfile(userId: string, dto: { name?: string; phone?: string; email?: string }) {
    const user = await this.users.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException();
    if (dto.email && dto.email.toLowerCase() !== user.email) {
      const email = dto.email.trim().toLowerCase();
      if (await this.users.findOne({ where: { email } })) throw new BadRequestException('Bu email band');
      user.email = email;
    }
    if (dto.name) user.name = dto.name.trim();
    if (dto.phone !== undefined) user.phone = dto.phone;
    await this.users.save(user);
    return this.publicUser(user);
  }

  /** Admin uchun mijozlar ro'yxati */
  async list() {
    const rows = await this.users.find({ order: { createdAt: 'DESC' } });
    return rows.map((u) => this.publicUser(u));
  }
}
