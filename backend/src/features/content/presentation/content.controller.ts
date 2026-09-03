import { Body, Controller, Delete, Get, Param, Post as HttpPost, Put, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../../auth/presentation/admin.guard';
import { JwtAuthGuard } from '../../auth/presentation/jwt-auth.guard';
import { ContentService } from '../application/content.service';
import { Faq } from '../infrastructure/faq.entity';
import { Post } from '../infrastructure/post.entity';

/* ------------ Ochiq ------------ */

@Controller()
export class ContentController {
  constructor(private readonly content: ContentService) {}

  @Get('posts')
  posts() {
    return this.content.listPosts();
  }

  @Get('posts/:slug')
  post(@Param('slug') slug: string) {
    return this.content.post(slug);
  }

  @Get('faq')
  faq() {
    return this.content.listFaq();
  }

  @Get('settings')
  settings() {
    return this.content.allSettings();
  }

  @HttpPost('leads')
  lead(@Body() dto: { type?: 'callback' | 'contact'; name: string; phone: string; msg?: string }) {
    return this.content.addLead(dto);
  }
}

/* ------------ Admin ------------ */

@Controller('admin/content')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminContentController {
  constructor(private readonly content: ContentService) {}

  @Get('posts')
  posts() {
    return this.content.listPosts(true);
  }

  @HttpPost('posts')
  createPost(@Body() dto: Partial<Post>) {
    return this.content.savePost(dto);
  }

  @Put('posts/:id')
  updatePost(@Param('id') id: string, @Body() dto: Partial<Post>) {
    return this.content.savePost({ ...dto, id });
  }

  @Delete('posts/:id')
  deletePost(@Param('id') id: string) {
    return this.content.deletePost(id);
  }

  @HttpPost('faq')
  saveFaq(@Body() dto: Partial<Faq>) {
    return this.content.saveFaq(dto);
  }

  @Delete('faq/:id')
  deleteFaq(@Param('id') id: string) {
    return this.content.deleteFaq(id);
  }

  @Put('settings')
  settings(@Body() dto: Record<string, unknown>) {
    return this.content.saveSettings(dto);
  }

  @Get('leads')
  leads() {
    return this.content.listLeads();
  }

  @Put('leads/:id')
  handleLead(@Param('id') id: string, @Body() dto: { handled: boolean }) {
    return this.content.handleLead(id, !!dto.handled);
  }
}
